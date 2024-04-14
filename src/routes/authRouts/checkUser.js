const express = require('express');
const checkUser = express.Router();

checkUser.get('/', async (req, res) => {
  
  console.log(req.session);

  if (req.session.login !== undefined) {
    res.json({ auth: true });
  } else {
    res.json({ auth: false });
  }
});

module.exports = checkUser;