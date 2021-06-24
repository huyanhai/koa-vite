const User = require('../model/user');
const ApiError = require('../error/index');

class UserController {
  static async getAllUser(ctx) {
    ctx.body = await User.find({});
  }
  static async getUserById(ctx) {
    const id = ctx.query.id;
    const user = await User.findOne({ id: id });
    if (user) {
      ctx.body = user;
    } else {
      throw new ApiError(ApiError.errorType.UserNotExist);
    }
  }
  static async saveUser(ctx) {
    let req = ctx.request.body;
    if (!req.userName) {
      throw new ApiError(ApiError.errorType.UnknownError);
    }
    let user = new User({
      userName: req.userName,
      age: req.age,
      tags: req.tags,
      phone: req.phone
    });
    user = await user.save();
    ctx.body = user;
  }
}

module.exports = UserController;
