const prisma = require('../prisma/client');

// Lấy danh sách sách
exports.getBooks = async (req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
};

// Thêm sách mới
exports.createBook = async (req, res) => {
  const { title, author } = req.body;
  const book = await prisma.book.create({
    data: { title, author },
  });
  res.json(book);
};
