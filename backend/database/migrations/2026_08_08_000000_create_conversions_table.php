<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('converter');
            $table->string('source_name');
            $table->string('source_path');
            $table->string('output_path');
            $table->string('target_format', 16);
            $table->string('status')->default('completed');
            $table->json('options')->nullable();
            $table->unsignedBigInteger('size');
            $table->boolean('simulated')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversions');
    }
};
