#./darknet detector test config/data/obj.data config/cfg/yolov4-obj.cfg weights/front_cmtnd_resized.weights -thresh 0.25 -dont_show -save_labels < test1.txt
./darknet detector test config/data/obj.data config/cfg/yolov3.cfg weights/thua_front_cmtnd.weights -thresh 0.25 -dont_show -save_labels < test1.txt
