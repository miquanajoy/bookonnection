const express = require('express');
const app = express();

const userRoutes = require('./routes/user.routes');
const booksRoutes = require('./routes/books.routes');



app.use(express.json()); // Cho phép server nhận JSON

// Đăng ký các routes chính
app.use('/api/users', userRoutes);
app.use('/api/books', booksRoutes);

// Route test trang chủ
app.get('/', (req, res) => res.send('API blog sách đang chạy!'));

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
