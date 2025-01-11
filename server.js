const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const releaseRoutes = require('./routes/releaseRoutes'); // Маршруты для работы с релизами
const authRoutes = require('./routes/authRoutes'); // Маршруты для аутентификации
const protect = require('./middleware/authMiddleware'); // Миддлвар для защиты маршрутов
const upload = require('./middleware/uploadMiddleware'); // Миддлвар для загрузки файлов

const app = express();

// Создание или подключение к базе данных SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        process.exit(1);
    } else {
        console.log('Подключено к базе данных SQLite');
    }
});

// Создание таблицы пользователей, если она не существует
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

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

// Подключение маршрутов для аутентификации
app.use('/auth', authRoutes);

// Пример защищенного маршрута
app.get('/dashboard', protect, (req, res) => {
    res.json({ message: 'Добро пожаловать на вашу страницу!' });
});

// Обработка ошибок для маршрутов
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});