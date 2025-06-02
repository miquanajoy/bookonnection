const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Lấy danh sách sách (ai cũng xem được)
router.get('/', bookController.getBooks);
// Thêm sách mới (phải đăng nhập)
router.post('/', authenticate, bookController.createBook);

module.exports = router;