const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка регистрации', error });
    }
});

module.exports = router;

const jwt = require('jsonwebtoken');

// Логин пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Успешный вход', token });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка входа', error });
    }
});
