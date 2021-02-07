<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Support\Str;
use App\Models\Inquiry;

class DetectorController extends Controller
{
    private $billTypes = [
        "bhx" => "Bách Hoá Xanh"
    ];

    public function index()
    {
        $exampleFiles = Storage::disk('public')->files('example');
        return view("home", ['exampleFiles'=>$exampleFiles]);
    }

    public function getInquiry($id)
    {
        $inquiry = Inquiry::whereUuid($id)->first();

        if(!$inquiry){
            abort(404);
        }

        return view("inquiry", ['inquiry'=>$inquiry]);
    }

    public function uploadBill(Request $request)
    {
        $rules = array(
		    'file' => 'image|mimes:jpeg,jpg,png|max:10240',
		);

        $validation = Validator::make($request->all(), $rules);
        if ($validation->fails())
		{
			return response($validation->errors()->first(), 400);
		}

        $file = $request->file('file');

        $inquiry = new Inquiry();
        $inquiry->extension = $file->extension();
        $inquiry->size = $file->getSize();
        $inquiry->filename = $file->getClientOriginalName();
        $inquiry->save();

        $path = 'bill/'.$inquiry->uuid;
        $request->file('file')->storeAs($path, 'original.'.$inquiry->extension, 'public');
        $request->file('file')->storeAs($path, $inquiry->filename, 'public');
        
        $inquiry->path = $path;
        $inquiry->save();

        return ["id"=> $inquiry->uuid];
    }

    public function preprocessing($id, Request $request)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return response(['message'=>'Not found'], 404);
        }

        if(!Storage::disk('public')->exists('bill/' . $id . '/preprocessing.txt')){
            $process = new Process(['python3', app_path() .'/Scripts/preprocessing.py', storage_path() . '/app/public/' . $inquiry->path, $inquiry->extension]);
            $process->run();
    
            if (!$process->isSuccessful()) {
                //If you uncomment the next line it is good for debugging but it will break the front end. Remember to comment it back later if you uncomment it.
                throw new ProcessFailedException($process);
            }
        }
        

        return ['images'=>[
            'Croped' => "/storage/{$inquiry->path}/original-warped.jpg",
            'Warped + Filter' => "/storage/{$inquiry->path}/warped.jpg",
        ]];
    }

    public function typeDetect($id, Request $request)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return response(['message'=>'Not found'], 404);
        }

        response(["result" => "OK"])->send();

        if(!Storage::disk('public')->exists($inquiry->path . '/type-detect.txt')){
            // $process = new Process(['python3', app_path() .'Scripts/billTypeDetector.py', $dataPath]);
            $process = new Process(['python3', app_path() .'/Scripts/billDetector/detector.py', storage_path() . '/app/public/' . $inquiry->path]);
            $process->setWorkingDirectory(app_path() .'/Scripts/billDetector/');
            $process->run();

            if (!$process->isSuccessful()) {
                //If you uncomment the next line it is good for debugging but it will break the front end. Remember to comment it back later if you uncomment it.
                throw new ProcessFailedException($process);
            }
        }
        
    }

    public function typeDetectResult($id, Request $request)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return response(['message'=>'Not found'], 404);
        }

        if(!Storage::disk('public')->exists($inquiry->path . '/type-detect.txt')){
            return ["completed" => false, 'message'=> "", 'extra'=>'Not create'];
        }

        $status  = Storage::disk('public')->get($inquiry->path  . '/type-detect.txt');
        $status = explode("\n", $status);
        $lastMessage = $status[count($status)-1];

        if ($lastMessage == "" && count($status) > 1){
            $lastMessage = $status[count($status)-2];
        }

        if (strpos($lastMessage, "[completed]") === 0){
            $lastMessage = explode("|", $lastMessage);
            $return = [
                "completed" => true, 
                'isSupported' => $lastMessage[1] == "success",
                'message' => $lastMessage[2]
            ];

            if($lastMessage[1] == "success"){
                $return['code'] = $lastMessage[2];
                $return['name'] = $this->billTypes[$lastMessage[2]];
                $return['confidence'] = $lastMessage[3];
                $return['images'] = [
                    'Bill Type Detect' => '/storage/' . $inquiry->path .'/type_detect.jpg'
                ];
            }
            return $return;
        }
        
        
        return ["completed" => false, 'message' => $lastMessage];
    }

    public function extractData($id, Request $request)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return response(['message'=>'Not found'], 404);
        }

        response(["result" => "OK"])->send();        

        if(!Storage::exists('public/bill/' . $id . '/bill-data.txt')){
            // $process = new Process(['python3', app_path() .'Scripts/billTypeDetector.py', $dataPath]);
            $process = new Process(['python3', app_path() .'/Scripts/extractBillData.py', storage_path() . '/app/public/' . $inquiry->path]);
            $process->run();
        }
        

        if (!$process->isSuccessful()) {
            //If you uncomment the next line it is good for debugging but it will break the front end. Remember to comment it back later if you uncomment it.
            throw new ProcessFailedException($process);
        }
    }

    public function extractDataResult($id, Request $request)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return response(['message'=>'Not found'], 404);
        }

        if(!Storage::exists('public/bill/' . $id . '/bill-data.txt')){
            return ["completed" => false];
        }

        $data  = Storage::get('public/bill/' . $id . '/bill-data.txt');
        $data = json_decode($data, false);

        return [
            "completed" => true, 
            'data'=>$data, 
            'images' => [
                'Object Boxed' => "/storage/{$inquiry->path}/data_location.jpg"
            ]
        
        ];
    }

    public function delete($id)
    {
        $inquiry = Inquiry::whereUuid($id)->first();
        if(!$inquiry){
            return redirect('/history');
        }

        //Delete directory
        if(Storage::disk('public')->exists($inquiry->path)){
            Storage::disk('public')->deleteDirectory($inquiry->path);
        }

        //Delete database
        $inquiry->delete();
        return redirect('/history');
    }
}
