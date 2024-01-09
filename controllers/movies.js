const movieSchema = require('../models/movie');
const BadRequestError = require('../stat_code_errors/BadRequestError');
const NotFoundError = require('../stat_code_errors/NotFoundError');
const ForbiddenError = require('../stat_code_errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.removeMovie = (req, res, next) => {
  const { movieId } = req.params;
  movieSchema.findById(movieId)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужой фильм'));
      }
      movieSchema.findOneAndDelete({ _id: movieId })
        .then((moviE) => res.send(moviE));
    })
    .catch(next);
};

module.exports.postMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  movieSchema.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при добавлении фильма. '));
      } else {
        next(err);
      }
    });
};
