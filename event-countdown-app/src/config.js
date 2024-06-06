const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET
};
