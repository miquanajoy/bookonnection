const prisma = require('../../../prisma/client');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
const bcrypt = require('bcryptjs');

// Đăng ký
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Kiểm tra email đã tồn tại chưa
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

  // 2. Mã hóa (hash) mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Tạo user mới trong database
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  // 4. Không trả password cho client
  const { password: pw, ...safeUser } = user;
  res.json(safeUser);
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // 1. Tìm user theo email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

  // 2. So sánh password đã hash
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

  // Tạo JWT token (không nên bỏ password vào payload)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  // 3. Trả về user (không trả password)
  const { password: pw, ...safeUser } = user;
  res.json({ user: safeUser, token });
};
