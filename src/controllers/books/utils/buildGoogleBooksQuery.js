// Hàm helper để ghép query string đúng chuẩn Google Books API
module.exports = function buildGoogleBooksQuery({ intitle, inauthor, inpublisher, subject, isbn }) {
    let query = '';
    if (intitle) query += `intitle:${intitle} `;      // Lọc theo tên sách
    if (inauthor) query += `inauthor:${inauthor} `;   // Lọc theo tác giả
    if (inpublisher) query += `inpublisher:${inpublisher} `; // Lọc nhà xuất bản
    if (subject) query += `subject:${subject} `;      // Lọc thể loại
    if (isbn) query += `isbn:${isbn} `;               // Lọc ISBN
    return query.trim(); // Xoá khoảng trắng dư thừa ở cuối
  };
  