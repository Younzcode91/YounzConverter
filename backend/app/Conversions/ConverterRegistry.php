<?php

namespace App\Conversions;

class ConverterRegistry
{
    public const ITEMS = [
        ['id' => 'image', 'name' => 'Gambar', 'description' => 'Ubah PNG, JPG, WEBP, dan HEIC.', 'extensions' => ['jpg', 'jpeg', 'png', 'webp', 'gif'], 'targets' => ['jpg', 'png', 'webp']],
        ['id' => 'pdf', 'name' => 'PDF', 'description' => 'Konversi dokumen PDF dengan aman.', 'extensions' => ['pdf'], 'targets' => ['docx', 'jpg', 'png']],
        ['id' => 'word', 'name' => 'Word', 'description' => 'Ubah dokumen Word ke format praktis.', 'extensions' => ['doc', 'docx'], 'targets' => ['pdf', 'txt']],
        ['id' => 'excel', 'name' => 'Excel', 'description' => 'Ekspor lembar kerja untuk dibagikan.', 'extensions' => ['xls', 'xlsx', 'csv'], 'targets' => ['pdf', 'csv', 'xlsx']],
        ['id' => 'remove-background', 'name' => 'Hapus Latar', 'description' => 'Siapkan gambar transparan.', 'extensions' => ['jpg', 'jpeg', 'png', 'webp'], 'targets' => ['png']],
        ['id' => 'sticker', 'name' => 'Stiker', 'description' => 'Buat stiker siap kirim.', 'extensions' => ['jpg', 'jpeg', 'png', 'webp'], 'targets' => ['webp', 'png']],
        ['id' => 'gif', 'name' => 'GIF', 'description' => 'Buat atau optimalkan animasi.', 'extensions' => ['gif', 'mp4', 'webm', 'jpg', 'jpeg', 'png'], 'targets' => ['gif', 'mp4']],
    ];

    public static function find(string $id): ?array
    {
        foreach (self::ITEMS as $item) if ($item['id'] === $id) return $item;
        return null;
    }
}
