const express = require('express');
const mongoose = require('mongoose');
const releaseRoutes = require('./routes/releaseRoutes'); // Маршруты для работы с релизами
const protect = require('./middleware/authMiddleware'); // Миддлвар для защиты маршрутов
const path = require('path');
const upload = require('./middleware/uploadMiddleware'); // Миддлвар для загрузки файлов

const app = express();

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/coldwave', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Подключено к базе данных'))
    .catch(err => console.log(err));

// Использование JSON тела в запросах
app.use(express.json());

// Статическая папка для загруженных файлов (обложки, аудиофайлы)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Главная страница (доступна для всех)
app.get('/', (req, res) => {
    res.json({ message: 'Добро пожаловать в API для работы с релизами!' });
});

// Подключение маршрутов для работы с релизами
app.use('/releases', releaseRoutes);

// Пример защищенного маршрута
app.get('/dashboard', protect, (req, res) => {
    res.json({ message: 'Добро пожаловать на вашу страницу!' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
