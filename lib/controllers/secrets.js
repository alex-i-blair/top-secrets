const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const secret = await Secret.insert({
      ...req.body,
      username: req.user.username,
    });
    console.log(req.body);
    res.json(secret);
  } catch (error) {
    next(error);
  }
});
