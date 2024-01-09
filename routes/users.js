const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUser, getMyUser,
} = require('../controllers/users');

userRoutes.get('/me', getMyUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = userRoutes;
