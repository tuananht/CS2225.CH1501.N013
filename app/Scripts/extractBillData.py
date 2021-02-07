#$name, $dataPath, $imagePath
import sys, time, json


import cv2, re
import os
from skimage.filters import threshold_local
import numpy as np
import imutils
import pytesseract

def image_to_data(originalImage, image, language = 'vie'):
  # immage_to_data will return object with:
  # level, page_num, block_num, par_num, line_num, word_num
  # top, left, width, height, conf, text
  data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT, lang=language)
  n_boxes = len(data['level'])
  overlay = image.copy()
  originalOverlay = originalImage.copy()
  for i in range(n_boxes):
    if int(data['conf'][i]) < 60:
      (x, y, w, h) = (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
      overlay = cv2.rectangle(overlay, (x, y), (x + w, y + h), (0, 255, 0), 2)
      originalOverlay = cv2.rectangle(originalOverlay, (x, y), (x + w, y + h), (0, 255, 0), 2)

  return originalOverlay, overlay, data


def image_to_string(image, language = 'vie'):
  text = pytesseract.image_to_string(image, output_type=pytesseract.Output.DICT, lang=language)
  return text

def parse_bill_data(bill_data):
	data = {
		'website':'N/a',
		'address': 'N/a',
		'id': 'N/a',
		'date':'N/a',
		'cashier':'N/a',
		'items': [],
		'amount': 'N/a'
	}
	
	bill_data = bill_data.split("\n")

	#Remove empty line
	bill_data = filter(lambda x: len(x.strip()), bill_data) 
	bill_data = list(bill_data)

	print(bill_data)

	#Remove unwanted data at begining
	while(not re.search('(www\.|\.bachhoa|hoaxanh\.|\.com)', bill_data[0].lower())):
		del bill_data[0]
	
	data["website"] = bill_data[0].lower()

	#Detect address
	data['address'] = bill_data[1] + " " + bill_data[2]
	line = 3
	while line < len(bill_data) and not re.search('(Số|CT)', bill_data[line]):
		line += 1

	if line < len(bill_data):
		data['id'] = re.search("\d+", bill_data[line])[0]
		data['date'] = re.search("\d+\/\d+\/\d+\s*\d+:\d+", bill_data[line+1])[0]
		data['cashier'] = re.search("[:;,\.\|]\s+(.*?)$", bill_data[line+2])[1]
	line += 2

	while (line < len(bill_data) and not re.search('(sl|giá|bán|t\.|tiền)', bill_data[line].lower())):
		line += 1
	
	if line < len(bill_data):
		line += 1

		while(True):
			item = bill_data[line]
			item_data = bill_data[line+1].split()

			if not re.search('[0-9,\.]+\s+[0-9,\.]+\s+[0-9,\.]+', bill_data[line+1]):
				break
			
			quantity = item_data[0]
			price = item_data[1].replace(",", "")
			amount = item_data[2].replace(",", "")
			data['items'].append({'item': item, 'quantity': quantity, 'price':price, 'amount': amount})
			line += 2

		try:
			amount = bill_data[line]
			amount = re.search("[0-9,\.\s]+$", amount)[0].replace(",","")
			data['amount'] = amount.strip()
		except Exception as e:
			pass
	print(data)
	return data

if __name__ == "__main__":
	data_path = sys.argv[1]

	try:
		# Get two reduced images from step preprocessing
		originalWarped = cv2.imread(data_path + "/original-warped.jpg")
		warped = cv2.imread(data_path + "/warped.jpg")

		originalOverlay, imageBox, data = image_to_data(originalWarped, warped)

		#Save converted image
		cv2.imwrite(data_path + "/data_location.jpg", originalOverlay)

		bill_data = image_to_string(warped)['text']

		data = parse_bill_data(bill_data)
		data['success'] = True
		f = open(data_path + "/bill-data.txt", 'w')
		f.write(json.dumps(data))
		f.close()
	except Exception as e:
		data = {
			'success': False,
			'message': str(e)
		}
		f = open(data_path + "/bill-data.txt", 'w')
		f.write(json.dumps(data))
		f.close()
		raise e
	