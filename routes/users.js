const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getMyUser,
} = require('../controllers/users');

userRoutes.get('/me', getMyUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUser);

module.exports = userRoutes;
