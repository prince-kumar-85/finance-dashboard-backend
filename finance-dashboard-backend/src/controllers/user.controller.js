const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return successResponse(
      res,
      200,
      'Users fetched successfully',
      users.map((user) => user.toSafeObject())
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User fetched successfully', user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    return successResponse(res, 200, 'User updated successfully', user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
};
