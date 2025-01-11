const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Подключение к базе данных SQLite
const db = new sqlite3.Database('./database.db');

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Проверка, существует ли пользователь
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
            }
            if (row) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }

            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);

            // Создание нового пользователя
            db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
                }
                res.status(201).json({ message: 'Пользователь успешно зарегистрирован', userId: this.lastID });
            });
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка регистрации', error: error.message });
    }
});

// Логин пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Поиск пользователя
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
            }
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' });
            }

            // Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            // Создание JWT токена
            const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

            res.json({ message: 'Успешный вход', token });
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка входа', error: error.message });
    }
});

// Получение списка пользователей
router.get('/users', (req, res) => {
    db.all('SELECT id, username, email FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных', error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;