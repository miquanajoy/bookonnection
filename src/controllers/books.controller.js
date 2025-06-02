const axios = require('axios');

exports.searchBooks = async (req, res) => {
  const { q, author, subject, maxResults, startIndex, langRestrict, orderBy } = req.query;

  let query = q || '';
  if (subject) query += `+subject:${subject}`;
  if (author) query += `+inauthor:"${author}"`;

  const results = Math.min(Number(maxResults) || 10, 40);
  const start = Number(startIndex) || 0;
  const lang = langRestrict || 'vi';

  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${results}&startIndex=${start}&langRestrict=${lang}`;
  if (orderBy) url += `&orderBy=${orderBy}`;

  try {
    const response = await axios.get(url);

    // Chỉ lấy trường cần thiết
    const items = (response.data.items || []).map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      pageCount: item.volumeInfo.pageCount,
      image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
      // Thêm các trường khác nếu cần
    }));

    res.json({
      totalItems: response.data.totalItems,
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu Google Books', error: error.message });
  }
};
