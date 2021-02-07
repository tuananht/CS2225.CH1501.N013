#$name, $dataPath, $imagePath
import sys, time, json


import cv2
import os
from skimage.filters import threshold_local
import numpy as np
import imutils
import pytesseract

#function to find two largest countours which ones are may be
#	full image and our rectangle edged object
def find_largest_countours(cntList, cntWidths):
	newCntList = []
	newCntWidths = []

	#finding 1st largest rectangle
	first_largest_cnt_pos = cntWidths.index(max(cntWidths))

	# adding it in new
	newCntList.append(cntList[first_largest_cnt_pos])
	newCntWidths.append(cntWidths[first_largest_cnt_pos])

	#removing it from old
	cntList.pop(first_largest_cnt_pos)
	cntWidths.pop(first_largest_cnt_pos)

	#finding second largest rectangle
	seccond_largest_cnt_pos = cntWidths.index(max(cntWidths))

	# adding it in new
	newCntList.append(cntList[seccond_largest_cnt_pos])
	newCntWidths.append(cntWidths[seccond_largest_cnt_pos])

	#removing it from old
	cntList.pop(seccond_largest_cnt_pos)
	cntWidths.pop(seccond_largest_cnt_pos)

	print('Old Screen Dimentions filtered', cntWidths)
	print('Screen Dimentions filtered', newCntWidths)
	return newCntList, newCntWidths


#function to transform image to four points
def four_point_transform(image, pts):
	# obtain a consistent order of the points and unpack them
	# individually
	rect = order_points(pts)

	# # multiply the rectangle by the original ratio
	# rect *= ratio

	(tl, tr, br, bl) = rect

	# compute the width of the new image, which will be the
	# maximum distance between bottom-right and bottom-left
	# x-coordiates or the top-right and top-left x-coordinates
	widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
	widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
	maxWidth = max(int(widthA), int(widthB))

	# compute the height of the new image, which will be the
	# maximum distance between the top-right and bottom-right
	# y-coordinates or the top-left and bottom-left y-coordinates
	heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
	heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
	maxHeight = max(int(heightA), int(heightB))

	# now that we have the dimensions of the new image, construct
	# the set of destination points to obtain a "birds eye view",
	# (i.e. top-down view) of the image, again specifying points
	# in the top-left, top-right, bottom-right, and bottom-left
	# order
	dst = np.array([
		[0, 0],
		[maxWidth - 1, 0],
		[maxWidth - 1, maxHeight - 1],
		[0, maxHeight - 1]], dtype="float32")

	# compute the perspective transform matrix and then apply it
	M = cv2.getPerspectiveTransform(rect, dst)
	warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

	# return the warped image
	return warped


#function to order points to proper rectangle
def order_points(pts):
	# initialzie a list of coordinates that will be ordered
	# such that the first entry in the list is the top-left,
	# the second entry is the top-right, the third is the
	# bottom-right, and the fourth is the bottom-left
	rect = np.zeros((4, 2), dtype="float32")

	# the top-left point will have the smallest sum, whereas
	# the bottom-right point will have the largest sum
	s = pts.sum(axis=1)
	rect[0] = pts[np.argmin(s)]
	rect[2] = pts[np.argmax(s)]

	# now, compute the difference between the points, the
	# top-right point will have the smallest difference,
	# whereas the bottom-left will have the largest difference
	diff = np.diff(pts, axis=1)
	rect[1] = pts[np.argmin(diff)]
	rect[3] = pts[np.argmax(diff)]

	# return the ordered coordinates
	return rect


def convert_image_from_raw(raw, scan=True):
  if (scan == False):
    return raw, raw
  image = raw
  ratio = image.shape[0] / 500.0
  orig = image.copy()
  image = imutils.resize(image, height = 500)

  # convert image from colored to gray scale
  gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

  # apply filter - bilateral filter for smoothing images, 
  # reduce the noise while preserving edges
  gray = cv2.bilateralFilter(gray, 11, 17, 17)

  # smooth the edges with median Blur
  gray = cv2.medianBlur(gray, 5)

  # detect out edges using canny algorithm
  edged = cv2.Canny(gray, 30, 400)
  
  # find contours in the edged image
  # keep only the largest ones, and initialize our screen contour
  countours, hierarcy = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
  imageCopy = image.copy()

  # approximate the contour

  cnts = sorted(countours, key=cv2.contourArea, reverse=True)

  screenCntList = []
  scrWidths = []
  for cnt in cnts:
      peri = cv2.arcLength(cnt, True) 
      # you want square but you got bad one so you need to approximate
      approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
      
      screenCnt = approx
      if len(screenCnt) == 4:
          (X, Y, W, H) = cv2.boundingRect(cnt)
          screenCntList.append(screenCnt)
          scrWidths.append(W)

  screenCntList, scrWidths = find_largest_countours(screenCntList, scrWidths)

  # check
  if not len(screenCntList) >= 2:  # there is no rectangle found
      print("No rectangle found")
  elif scrWidths[0] != scrWidths[1]:  # mismatch in rect
      print("Mismatch in rectangle")

  # apply transform and show result
  pts = screenCntList[0].reshape(4, 2)

  # Define our rectangle 
  rect = order_points(pts)

  originalWarped = four_point_transform(orig, screenCntList[0].reshape(4, 2) * ratio)
  warped = cv2.cvtColor(originalWarped, cv2.COLOR_BGR2GRAY)
  T = threshold_local(warped, 11, offset = 10, method = "gaussian")
  warped = (warped > T).astype("uint8") * 255
  return originalWarped, warped

if __name__ == "__main__":
	data_path = sys.argv[1]
	extension = sys.argv[2]
	file_name = data_path + "/original." + extension
	img = cv2.imread(file_name)

	#Convert to jpeg
	cv2.imwrite(data_path + "/original.jpg", img)

	#reduce image
	originalWarped, warped = convert_image_from_raw(img)

	#Save converted image
	cv2.imwrite(data_path + "/original-warped.jpg", originalWarped)
	cv2.imwrite(data_path + "/warped.jpg", warped)

	f = open(data_path + '/preprocessing.txt', 'w')
	f.write('completed')
	f.close()