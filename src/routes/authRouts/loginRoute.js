const loginRoute = require('express').Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const { User } = require('../../../db/models');

function generateToken(id, email) {
  return JWT.sign({
    id, email,
  }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

loginRoute.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.json({ message: `${email} не зарегистрирован..` });
    } else {
      const checkPass = await bcrypt.compare(password, user.password);
      if (checkPass) {
        const token = generateToken(user.email, user.id);
      res.json({token, message: 'Вы успешно авторизовались' })
      return
      } else {
        res.json({ message: 'Неверный пароль' }); 
      }
    }
  } catch (error) {
    console.log(`loginRoutes =>>> ${error}`);
    res.status(500).json({ err: 'Внутренняя ошибка сервера' }); 
  }
});

module.exports = loginRoute;