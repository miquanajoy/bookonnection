const axios = require('axios');

exports.searchBooks = async (req, res) => {
  const { q, author, subject, maxResults, startIndex } = req.query;

  // Tạo chuỗi query cho Google Books API
  let query = q || '';
  if (subject) query += `+subject:${subject}`;
  if (author) query += `+inauthor:"${author}"`;

  const results = Math.min(Number(maxResults) || 10, 40); // tối đa 40/lần request
  const start = Number(startIndex) || 0;

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${results}&startIndex=${start}&langRestrict=vi`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu Google Books', error: error.message });
  }
};
