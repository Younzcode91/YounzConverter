<?php

namespace App\Http\Requests;

use App\Conversions\ConverterRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Validator;

class StoreConversionRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return ['file' => ['required', 'file', 'max:25600'], 'converter' => ['required', 'string'], 'target_format' => ['required', 'string', 'max:16'], 'options' => ['sometimes', 'array']];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            $converter = ConverterRegistry::find((string) $this->input('converter'));
            $file = $this->file('file');
            $target = strtolower((string) $this->input('target_format'));
            if (! $converter) { $validator->errors()->add('converter', 'Konverter tidak tersedia.'); return; }
            if (! in_array($target, $converter['targets'], true)) $validator->errors()->add('target_format', 'Format tujuan tidak didukung.');
            if ($file && ! in_array(strtolower($file->getClientOriginalExtension()), $converter['extensions'], true)) $validator->errors()->add('file', 'Format file tidak cocok dengan konverter.');
            $allowedMimes = ['image/jpeg','image/png','image/webp','image/gif','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv','video/mp4','video/webm'];
            if ($file && ! in_array($file->getMimeType(), $allowedMimes, true)) $validator->errors()->add('file', 'Tipe MIME file tidak diizinkan.');
        }];
    }

    protected function failedValidation(ValidatorContract $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Data yang diberikan tidak valid.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
