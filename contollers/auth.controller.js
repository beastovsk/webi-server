const User = require("../db/models/user");
const bcrypt = require("bcryptjs");
const {generateToken} = require("../utils");

const express = require("express")
const router = express.Router()

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            const token = generateToken(user.email, user.id);
            const checkPass = await bcrypt.compare(password, user.password);

            if (user) {
                res.json({ message: "Пользователь не найден" });
                return;
            }
            if (!checkPass) {
                res.json({ message: 'Неверный пароль' });
                return;
            }
            res.json({token: 'asdasd', message: 'Вы успешно авторизовались' })
        } catch (error) {
            res.json({ error: error.message });
        }
    },
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            const hash = await bcrypt.hash(password, 10);
            const token = generateToken( {id:crypto.randomUUID(), email });

            if (user) {
                res.json({
                    message: `Этот пользователь уже зарегистрирован`,
                });

                return
            }
            await User.create({ email, password: hash });
            res.json({token, message: 'Вы успешно зарегистрировались' })

        } catch (error) {
            res.json({ error: error.message });
        }
    }
}

module.exports = authController