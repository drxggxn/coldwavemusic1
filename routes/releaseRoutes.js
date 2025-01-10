const express = require('express');
const protect = require('../middleware/authMiddleware');
const Release = require('../models/Release');
const router = express.Router();

// Получение списка всех релизов
router.get('/', protect, async (req, res) => {
    try {
        const releases = await Release.find();
        res.json(releases);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения релизов', error });
    }
});

// Получение деталей одного релиза
router.get('/:id', protect, async (req, res) => {
    try {
        const release = await Release.findById(req.params.id);
        if (!release) {
            return res.status(404).json({ message: 'Релиз не найден' });
        }
        res.json(release);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения релиза', error });
    }
});

// Создание нового релиза
router.post('/', protect, async (req, res) => {
    const { title, genre, releaseDate, coverImage, tracks, description } = req.body;

    try {
        const release = new Release({
            title,
            genre,
            releaseDate,
            coverImage,
            tracks,
            description
        });

        await release.save();
        res.status(201).json({ message: 'Релиз успешно создан', release });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка создания релиза', error });
    }
});

// Обновление релиза
router.put('/:id', protect, async (req, res) => {
    const { title, genre, releaseDate, coverImage, tracks, description, status } = req.body;

    try {
        const release = await Release.findById(req.params.id);
        if (!release) {
            return res.status(404).json({ message: 'Релиз не найден' });
        }

        release.title = title || release.title;
        release.genre = genre || release.genre;
        release.releaseDate = releaseDate || release.releaseDate;
        release.coverImage = coverImage || release.coverImage;
        release.tracks = tracks || release.tracks;
        release.description = description || release.description;
        release.status = status || release.status;

        await release.save();
        res.json({ message: 'Релиз обновлен', release });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления релиза', error });
    }
});

// Удаление релиза
router.delete('/:id', protect, async (req, res) => {
    try {
        const release = await Release.findById(req.params.id);
        if (!release) {
            return res.status(404).json({ message: 'Релиз не найден' });
        }

        await release.remove();
        res.json({ message: 'Релиз удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления релиза', error });
    }
});

module.exports = router;
