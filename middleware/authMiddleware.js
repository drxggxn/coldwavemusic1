const jwt = require('jsonwebtoken');

// Миддлвар для проверки авторизации через JWT токен
function protect(req, res, next) {
    // Получаем токен из заголовков
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Если токен не передан, возвращаем ошибку
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените 'your_jwt_secret' на ваш секрет
        req.user = decoded; // Сохраняем информацию о пользователе в объект запроса
        next(); // Переходим к следующему обработчику маршрута
    } catch (error) {
        res.status(401).json({ message: 'Неверный или просроченный токен' });
    }
}

module.exports = protect;
