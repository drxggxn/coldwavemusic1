const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    coverImage: { type: String },  // Путь к изображению обложки
    tracks: [{ title: String, file: String }],  // Массив треков (название и путь к файлу)
    description: { type: String },
}, { timestamps: true });

const Release = mongoose.model('Release', releaseSchema);

module.exports = Release;
