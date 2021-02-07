#$name, $dataPath, $imagePath
import sys
import os
import glob
import cv2
import numpy as np
import random
import darknet

data_path = sys.argv[1]
status = open(data_path + "/type-detect.txt", "w")
def update_status(message):
	status.write(message)
	status.flush()

def image_detection(image_path, network, class_names, class_colors, thresh):
	# Darknet doesn't accept numpy images.
	# Create one with image we reuse for each detect
	width = darknet.network_width(network)
	height = darknet.network_height(network)
	darknet_image = darknet.make_image(width, height, 3)
	update_status("Loading image...\n")
	image = cv2.imread(image_path)
	update_status("Convert image...\n")
	image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
	image_resized = cv2.resize(image_rgb, (width, height),
							   interpolation=cv2.INTER_LINEAR)

	darknet.copy_image_from_bytes(darknet_image, image_resized.tobytes())
	update_status("Detecting...\n")
	detections = darknet.detect_image(network, class_names, darknet_image, thresh=thresh)
	darknet.free_image(darknet_image)
	image = darknet.draw_boxes(detections, image_resized, class_colors)
	update_status("Generating the result...\n")
	return cv2.cvtColor(image, cv2.COLOR_BGR2RGB), detections

def convert2relative(image, bbox):
	"""
	YOLO format use relative coordinates for annotation
	"""
	x, y, w, h = bbox
	height, width, _ = image.shape
	return x/width, y/height, w/width, h/height


def save_annotations(name, image, detections, class_names):
	"""
	Files saved with image_name.txt and relative coordinates
	"""
	file_name = name.split(".")[:-1][0] + ".txt"
	with open(file_name, "w") as f:
		for label, confidence, bbox in detections:
			x, y, w, h = convert2relative(image, bbox)
			label = class_names.index(label)
			f.write("{} {:.4f} {:.4f} {:.4f} {:.4f} {:.4f}\n".format(label, x, y, w, h, float(confidence)))
	
def run_yolov3(input_file, weights, config_file, data_file):
	
	random.seed(3)  # deterministic bbox colors
	update_status("Loading model...\n")
	network, class_names, class_colors = darknet.load_network(
		config_file,
		data_file,
		weights,
		batch_size=1
	)
	image, detections = image_detection(input_file, network, class_names, class_colors, 0.5)
	return (image, detections)

if __name__ == "__main__":
	try:
		input_file = data_path + "/original-warped.jpg"

		if (not os.path.exists(input_file)):
			raise Exception('Input image does not exist!')

		update_status("Executing YOLO darknet...\n")
		weights = "bachhoaxanh/yolov3_4000.weights"
		config_file = "bachhoaxanh/yolov3.cfg"
		data_file = "bachhoaxanh/obj.data"
		image, detections = run_yolov3(input_file, weights, config_file, data_file)
		coordinates=False

		#Save detected image
		cv2.imwrite(data_path + "/type_detect.jpg", image)

		#Check if images has BHX logo
		is_has_logo = False
		confidence = 0
		for label, confidence, bbox in detections:
			if label == "logo":
				is_has_logo = True
				update_status("[completed]|success|bhx|{:.2f}".format(float(confidence)))
				break
		
		if not is_has_logo:
			update_status("[completed]|error|Unsupported")
	except Exception as e:
		update_status("[completed]|error|" + str(e))
	status.close()