<?php

use App\Http\Controllers\Api\ConversionController;
use Illuminate\Support\Facades\Route;

Route::get('/converters', [ConversionController::class, 'index']);
Route::post('/conversions', [ConversionController::class, 'store']);
Route::get('/conversions/{conversion}', [ConversionController::class, 'show']);
Route::get('/conversions/{conversion}/download', [ConversionController::class, 'download']);
