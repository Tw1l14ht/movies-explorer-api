const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const movieRoutes = require('./movies');
const { postUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../stat_code_errors/NotFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), postUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, movieRoutes);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Not Found'));
});

module.exports = router;
