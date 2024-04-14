const registerRoute = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../../../db/models/');

registerRoute.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ where: { email } });
    if (user) {
      console.log(`Этот пользователь уже зарегистрирован с почты ${user.email}`);
      res.json({
        err: `Этот пользователь уже зарегистрирован с почты ${user.email}`,
      });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hash });

      req.session.email = newUser.email;
      req.session.userid = newUser.id;

      req.session.save(() => {
        console.log(`Registration complete ${email}`);
        res.json({ msg: `Приветствую ${email}!  `, user: newUser });
      });
    }
  } catch (error) {
    console.log(`Ошибка на этапе регистрации ОШИБКА ${error}`);
  }
});

module.exports = registerRoute;