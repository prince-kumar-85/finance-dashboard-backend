const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateUserValidator } = require('../validators/user.validator');

const router = express.Router();

router.use(authMiddleware, authorizeRoles('admin'));

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', updateUserValidator, validate, userController.updateUser);

module.exports = router;
