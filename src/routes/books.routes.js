const express = require('express');
const router = express.Router();
const searchBooks = require('../controllers/books/searchBooks');

router.post('/search', searchBooks);

module.exports = router;
