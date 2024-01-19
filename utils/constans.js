const validID = require('mongoose').Types.ObjectId;
const BadRequestError = require('../stat_code_errors/BadRequestError');

const statCode500 = 500;
const statCode400 = 400;
const statCode404 = 404;
const statCode401 = 401;

const idVerify = (movieId) => {
  if (validID.isValid(movieId)) {
    return movieId;
  }
  throw new BadRequestError('Передан некорректный id');
};

module.exports = {
  statCode500,
  statCode400,
  statCode404,
  statCode401,
  idVerify,
};
