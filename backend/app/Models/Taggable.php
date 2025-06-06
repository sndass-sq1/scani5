<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Tag;


class Taggable extends Model
{
    use HasFactory;

    protected $fillable = ['name']; // Add other necessary fields

    public function tags()
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
