const db = require("../database");
console.log(db);
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils");

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.query('SELECT * FROM "User" WHERE email = $1', [
        email,
      ]);

      if (user.rows.length === 0) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const checkPass = await bcrypt.compare(password, user.rows[0].password);
      if (!checkPass) {
        return res.status(401).json({ message: "Неверный пароль" });
      }

      const token = generateToken({
        id: user.rows[0].id,
        email: user.rows[0].email,
      });
      res.json({ token, message: "Вы успешно авторизовались" });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Ошибка авторизации" });
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await db.query(
        'SELECT * FROM "User" WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "Этот пользователь уже зарегистрирован" });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await db.query(
        'INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING id, email',
        [email, hash]
      );

      const token = generateToken({
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
      });
      res.json({ token, message: "Вы успешно зарегистрировались" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Ошибка регистрации" });
    }
  },
};

module.exports = authController;
