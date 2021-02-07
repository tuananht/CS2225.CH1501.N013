<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquiry;
use Illuminate\Support\Facades\Storage;

class HistoryController extends Controller
{
    public function index()
    {
        $inquiries = Inquiry::orderBy('created_at', 'desc')->get();
        return view('history', ['inquiries'=>$inquiries]);
    }

    public function clearInquiry()
    {
        $inquiries = Inquiry::all();

        foreach ($inquiries as $inquiry) {
            //Delete directory
            if(Storage::disk('public')->exists($inquiry->path)){
                Storage::disk('public')->deleteDirectory($inquiry->path);
            }

            //Delete database
            $inquiry->delete();
        }
        return redirect('/history');
    }
}
