const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, removeMovie, postMovies,
} = require('../controllers/movies');
const { linkVerify } = require('../utils/regexFunc');
const { idVerify } = require('../utils/constans');

const idJoi = {
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(idVerify),
  }),
};

const movieJoi = {
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().integer().min(10).max(999)
      .required(),
    year: Joi.string().min(2).max(4).required(),
    description: Joi.string().min(2).max(30).required(),
    image: Joi.string().required().regex(linkVerify),
    trailerLink: Joi.string().required().regex(linkVerify),
    thumbnail: Joi.string().required().regex(linkVerify),
    movieId: Joi.number(),
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
  }),
};

movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate(movieJoi), postMovies);

movieRoutes.delete('/:movieID', celebrate(idJoi), removeMovie);

module.exports = movieRoutes;
