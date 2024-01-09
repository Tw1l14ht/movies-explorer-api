const { JWT_SECRET = 'some-secret-key' } = process.env;
const { DB_ADRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

module.exports = {
  JWT_SECRET,
  DB_ADRESS,
};
