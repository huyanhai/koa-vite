const Router = require('koa-router');
const userController = require('../controller/userController');
const router = new Router();

router.prefix('/api/user');

router
  .get('/getAll', userController.getAllUser)
  .post('/saveUser', userController.saveUser)
  .get('/getUserById', userController.getUserById);

module.exports = router;
