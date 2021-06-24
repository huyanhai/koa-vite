const mongoose = require('mongoose');
const { DB_URL } = require('../config');

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功');
});

mongoose.connection.on('error', err => {
  console.log('数据库连接失败', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('数据库连接已断开');
});

module.exports = mongoose;
