const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');

router.get('/search', booksController.searchBooks);

module.exports = router;
