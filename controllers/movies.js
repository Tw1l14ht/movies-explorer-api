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
  const { movieID } = req.params;
  movieSchema.findById(movieID)
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужой фильм'));
      }
      return movieSchema.findOneAndDelete({ _id: movieID })
        .then((moviE) => {
          if (!movie) {
            return next(new NotFoundError('Фильм не найден'));
          }
          return res.send(moviE);
        });
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
    movieId,
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
    movieId,
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
