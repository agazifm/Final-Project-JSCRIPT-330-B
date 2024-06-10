const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  mongodbUriDev: process.env.MONGODB_URI_DEV,
  mongodbUriTest: process.env.MONGODB_URI_TEST,
  jwtSecret: process.env.JWT_SECRET,
};
