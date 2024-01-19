const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');
const NotFoundError = require('../stat_code_errors/NotFoundError');
const BadRequestError = require('../stat_code_errors/BadRequestError');
const ConflictError = require('../stat_code_errors/ConflictError');
const AuthError = require('../stat_code_errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.postUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10).then((hash) => {
    userSchema.create({
      name, email, password: hash,
    })
      .then(() => res.status(201).send({
        name, email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные'));
        } else next(err);
      });
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  userSchema.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Пользователь не найден');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMyUser = (req, res, next) => {
  userSchema.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не найден'));
      } else next(err);
    });
};
