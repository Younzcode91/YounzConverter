<?php

namespace App\Conversions;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MockConverterAdapter implements ConverterAdapter
{
    public function convert(UploadedFile $file, string $targetFormat, array $options = []): array
    {
        $directory = 'conversions/'.Str::uuid();
        $source = $file->storeAs($directory, 'source-'.$file->getClientOriginalName());
        $output = $directory.'/hasil-'.pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME).'.'.$targetFormat;
        Storage::disk('local')->copy($source, $output);

        return ['source_path' => $source, 'output_path' => $output, 'simulated' => true];
    }
}
