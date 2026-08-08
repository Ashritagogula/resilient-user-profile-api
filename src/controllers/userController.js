const UserService = require("../services/userService");
const { CircuitBreakerOpenException } = require("../utils/circuitBreaker");

const userService = new UserService();

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({
        errorCode: 'EMAIL_CONFLICT',
        message: 'A user with this email already exists'
      });
    }
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found"
      });
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found"
      });
    }
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found"
      });
    }
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getEnrichedUser = async (req, res, next) => {
  try {
    const enrichedData = await userService.getEnrichedUser(req.params.id);
    res.status(200).json(enrichedData);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found"
      });
    }
    next(error);
  }
};