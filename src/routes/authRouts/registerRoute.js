const registerRoute = require('express').Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

function generateToken(id, email) {
  return JWT.sign({
    id, email,
  }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const { User } = require('../../../db/models/');

// console.log(User);

registerRoute.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ where: { email } });
    console.log(user);
    if (user) {
      res.json({
        message: `Этот пользователь уже зарегистрирован с почты ${user.email}`,
      });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hash });
console.log(hash);
      // req.session.email = newUser.email;
      // req.session.userid = newUser.id;

      // req.session.save(() => {
      //   res.json({ message: `Приветствую ${email}!  `, user: newUser });
      // });

      const token = generateToken( {id:crypto.randomUUID(), email });
        res.json({token, message: 'Вы успешно зарегистрировались' })
    }
  } catch (error) {
    console.log(`Ошибка на этапе регистрации ОШИБКА ${error}`);
  }
});

module.exports = registerRoute;