const { PrismaClient } = require('@prisma/client'); //Import PrismaClient từ package.
const prisma = new PrismaClient(); 
module.exports = prisma; //Tạo 1 instance (prisma), xuất ra ngoài cho các file khác dùng chung.