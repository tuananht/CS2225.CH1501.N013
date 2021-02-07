<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\DetectorController;
use App\Http\Controllers\HistoryController;

Route::get('/', [DetectorController::class, 'index']);
Route::post('/upload-bill', [DetectorController::class, 'uploadBill']);
Route::get('/inquiry/{id}/', [DetectorController::class, 'getInquiry']);
Route::post('/inquiry/{id}/preprocessing', [DetectorController::class, 'preprocessing']);
Route::post('/inquiry/{id}/detect-bill-type', [DetectorController::class, 'typeDetect']);
Route::post('/inquiry/{id}/detect-bill-type-result', [DetectorController::class, 'typeDetectResult']);
Route::post('/inquiry/{id}/extract', [DetectorController::class, 'extractData']);
Route::post('/inquiry/{id}/extract-result', [DetectorController::class, 'extractDataResult']);
Route::get('/inquiry/{id}/delete', [DetectorController::class, 'delete']);

Route::get('/history/clear', [HistoryController::class, 'clearInquiry']);
Route::get('/history', [HistoryController::class, 'index']);

