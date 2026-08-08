<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ConversionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_converter_metadata(): void
    {
        $this->getJson('/api/converters')
            ->assertOk()
            ->assertJsonPath('data.0.id', 'image')
            ->assertJsonCount(7, 'data');
    }

    public function test_it_creates_and_downloads_a_simulated_conversion(): void
    {
        Storage::fake('local');

        $response = $this->post('/api/conversions', [
            'file' => UploadedFile::fake()->image('foto.png', 640, 480),
            'converter' => 'image',
            'target_format' => 'jpg',
            'options' => ['quality' => 82],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.simulated', true)
            ->assertJsonPath('data.target_format', 'jpg');

        $id = $response->json('data.id');
        $this->getJson("/api/conversions/{$id}")->assertOk()->assertJsonPath('data.id', $id);
        $this->get("/api/conversions/{$id}/download")->assertOk();
    }

    public function test_it_rejects_invalid_file_types_and_converter_mismatches(): void
    {
        Storage::fake('local');

        $this->post('/api/conversions', [
            'file' => UploadedFile::fake()->create('payload.exe', 20, 'application/x-msdownload'),
            'converter' => 'image',
            'target_format' => 'png',
        ])->assertUnprocessable()->assertJsonValidationErrors('file');

        $this->post('/api/conversions', [
            'file' => UploadedFile::fake()->create('sheet.xlsx', 20, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
            'converter' => 'image',
            'target_format' => 'png',
        ])->assertUnprocessable()->assertJsonValidationErrors('file');
    }
}
