<?php

namespace App\Http\Controllers\Api;

use App\Conversions\ConverterRegistry;
use App\Conversions\MockConverterAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConversionRequest;
use App\Models\Conversion;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ConversionController extends Controller
{
    public function index(): JsonResponse { return response()->json(['data' => ConverterRegistry::ITEMS, 'simulated' => true]); }

    public function store(StoreConversionRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $result = (new MockConverterAdapter)->convert($file, strtolower((string) $request->input('target_format')), $request->input('options', []));
        $conversion = Conversion::create([...$request->only('converter', 'target_format', 'options'), ...$result, 'source_name' => $file->getClientOriginalName(), 'size' => $file->getSize(), 'status' => 'completed']);
        return response()->json(['data' => $this->data($conversion)], 201);
    }

    public function show(Conversion $conversion): JsonResponse { return response()->json(['data' => $this->data($conversion)]); }

    public function download(Conversion $conversion) { abort_unless(Storage::disk('local')->exists($conversion->output_path), 404); return Storage::disk('local')->download($conversion->output_path, 'YounzConverter-'.pathinfo($conversion->source_name, PATHINFO_FILENAME).'.'.$conversion->target_format); }

    private function data(Conversion $conversion): array
    {
        return ['id' => $conversion->id, 'converter' => $conversion->converter, 'source_name' => $conversion->source_name, 'target_format' => $conversion->target_format, 'status' => $conversion->status, 'size' => $conversion->size, 'simulated' => $conversion->simulated, 'options' => $conversion->options, 'download_url' => url("/api/conversions/{$conversion->id}/download"), 'created_at' => $conversion->created_at?->toISOString()];
    }
}
