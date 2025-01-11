const jwt = require('jsonwebtoken');

function protect(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените 'your_jwt_secret' на ваш секрет
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Неверный или просроченный токен' });
    }
}

module.exports = protect;