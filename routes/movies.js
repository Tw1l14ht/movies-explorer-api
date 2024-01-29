const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, removeMovie, postMovies,
} = require('../controllers/movies');
const { linkVerify } = require('../utils/regexFunc');
const { idVerify } = require('../utils/constans');

const idJoi = {
  params: Joi.object().keys({
    movieID: Joi.string().required().custom(idVerify),
  }),
};

const movieJoi = {
  body: Joi.object().keys({
    country: Joi.string().min(2).max(200).required(),
    director: Joi.string().min(2).max(100).required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().min(2).max(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(linkVerify),
    trailerLink: Joi.string().required().regex(linkVerify),
    thumbnail: Joi.string().required().regex(linkVerify),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(100).required(),
    nameEN: Joi.string().min(2).max(100).required(),
  }),
};

movieRoutes.get('/', getMovies);

movieRoutes.post('/', celebrate(movieJoi), postMovies);

movieRoutes.delete('/:movieID', celebrate(idJoi), removeMovie);

module.exports = movieRoutes;
