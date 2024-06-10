const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      throw new Error();
    }

    const tokenValue = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenValue, config.jwtSecret);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': tokenValue });

    if (!user) {
      throw new Error();
    }

    req.token = tokenValue;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;