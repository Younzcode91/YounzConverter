<?php

namespace App\Conversions;

use Illuminate\Http\UploadedFile;

interface ConverterAdapter
{
    public function convert(UploadedFile $file, string $targetFormat, array $options = []): array;
}
