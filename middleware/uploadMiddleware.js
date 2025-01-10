const multer = require('multer');
const path = require('path');

// Настройка хранилища файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Папка для хранения загруженных файлов
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Генерация уникального имени файла
    }
});

// Фильтрация типов файлов
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'audio/mpeg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Файл разрешен
    } else {
        cb(new Error('Неверный формат файла'), false);  // Ошибка при неподдерживаемом формате
    }
};

// Инициализация Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
