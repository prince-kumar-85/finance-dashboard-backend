const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, 'User already exists with this email');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'viewer',
    });

    const token = generateToken(user);

    return successResponse(res, 201, 'User registered successfully', {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    if (user.status !== 'active') {
      return errorResponse(res, 403, 'Your account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user);

    return successResponse(res, 200, 'Login successful', {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Current user fetched successfully', req.user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
