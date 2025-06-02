const axios = require('axios'); // Dùng để gọi HTTP đến Google Books API
const buildGoogleBooksQuery = require('./utils/buildGoogleBooksQuery'); // Import helper vừa tách ra

// Middleware/handler cho POST /api/books/search
module.exports = async (req, res) => {


    // Lấy các trường filter/paging từ body
    const {
        subject,
        intitle,
        inauthor,
        inpublisher,
        isbn,
        langRestrict,
        printType,
        orderBy,
        filter,
        pageSize,
        page
    } = req.body;

    // Lấy trường langRestrict, mặc định là 'vi'
    const lang = langRestrict || 'vi';

    // Xử lý phân trang (paging)
    const results = Math.min(Number(pageSize) || 10, 40);   // Số sách/trang (tối đa 40)
    const pageNumber = Math.max(Number(page) || 1, 1);      // Trang hiện tại (>=1)
    const start = (pageNumber - 1) * results;               // startIndex: vị trí sách đầu của trang

    // Ghép query tìm kiếm
    const q = buildGoogleBooksQuery({ intitle, inauthor, inpublisher, subject, isbn });

    // Tạo URL request đến Google Books API
    let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`;
    url += `&langRestrict=${lang}`; // Bắt buộc luôn có langRestrict=vi (hoặc giá trị FE truyền vào)
    if (langRestrict) url += `&langRestrict=${langRestrict}`; // Ngôn ngữ
    if (printType) url += `&printType=${printType}`;           // Loại tài liệu
    if (orderBy) url += `&orderBy=${orderBy}`;                 // Sắp xếp
    if (filter) url += `&filter=${filter}`;                    // Filter đặc biệt (ebooks, free-ebooks, ...)
    url += `&maxResults=${results}`;                           // Số sách/trang
    url += `&startIndex=${start}`;                             // Phân trang

    try {
        // Gọi Google Books API
        const response = await axios.get(url);

        // Chỉ lấy các trường cần thiết trả về cho FE
        const items = (response.data.items || []).map(item => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            publisher: item.volumeInfo.publisher,
            publishedDate: item.volumeInfo.publishedDate,
            description: item.volumeInfo.description,
            pageCount: item.volumeInfo.pageCount,
            image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null,
        }));

        // Trả kết quả về FE
        res.json({
            totalItems: response.data.totalItems, // Tổng số kết quả tìm được
            page: pageNumber,                     // Trang hiện tại
            pageSize: results,                    // Số sách/trang
            items                                 // Danh sách sách tóm gọn
        });
    } catch (error) {
        // Nếu lỗi, trả về lỗi cho FE
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu Google Books', error: error.message });
    }
};
