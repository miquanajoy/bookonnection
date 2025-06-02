const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token được truyền ở header: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Thiếu token xác thực' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
    req.user = user; // Lưu thông tin user từ token vào request
    next();
  });
};
