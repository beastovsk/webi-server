const loginRoute = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../../../db/models');

loginRoute.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.json({ err: `${email} не зарегистрирован..` });
    } else {
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        req.session.email = user.email;
        req.session.userid = user.id;
        req.session.save(() => {
          console.log('Session saved!!!');
          res.json({ msg: 'Добро пожаловать!', user });
        });
      } else {
        res.json({ err: 'Неверный пароль' }); 
      }
    }
  } catch (error) {
    console.log(`loginRoutes =>>> ${error}`);
    res.status(500).json({ err: 'Внутренняя ошибка сервера' }); 
  }
});

module.exports = loginRoute;