const mongoose = require('../db/index');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: String,
  age: {
    type: Number,
    min: 1,
    max: 99,
  },
  phone: String,
  tags: Array,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
