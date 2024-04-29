const db = require("../database");
const bcrypt = require("bcryptjs");
const { generateToken, decodeToken } = require("../utils");
const nodemailer = require("nodemailer");
const { v4 } = require("uuid");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "coctencoflez@gmail.com",
		pass: "izjn njvi cxap muvc",
	},
});

const authController = {
	login: async (req, res) => {
		try {
			const { email, password } = req.body;
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (user.rows.length === 0) {
				return res
					.status(400)
					.json({ message: "Пользователь не найден" });
			}
			if (!user.rows[0].is_confirmed) {
				return res.status(400).json({ message: "Аккаунт не подтвержден. Проверьте вашу почту для подтверждения регистрации." });
			}
			const checkPass = await bcrypt.compare(
				password,
				user.rows[0].password
			);
			if (!checkPass) {
				return res.status(400).json({ message: "Неверный пароль" });
			}

			const token = generateToken({
				id: user.rows[0].id,
				email: user.rows[0].email,
			});
			res.json({ token, message: "Вы успешно авторизовались" });
		} catch (error) {
			res.status(500).json({ error: "Ошибка авторизации" });
		}
	},
	register: async (req, res) => {
		try {
			const { email, password } = req.body;
			const existingUser = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);
	
			if (existingUser && existingUser.rows.length > 0) {
				return res
					.status(400)
					.json({ message: "Этот пользователь уже зарегистрирован" });
			}
	
			const hash = await bcrypt.hash(password, 10);
			const confirmToken = v4(); // Создание уникального кода подтверждения
	
			const newUser = await db.query(
				`INSERT INTO "user" (email, password, is_confirmed, confirm_token) VALUES ($1, $2, $3, $4) RETURNING id, email`,
				[email, hash, false, confirmToken]
			);
			const [user] = newUser.rows;
			const mailOptions = {
				from: "coctencoflez@gmail.com",
				to: email,
				subject: "Подтверждение регистрации",
				text: `Ваедите код для подтверждения своей почты: ${confirmToken}`,
			};
	
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error("Ошибка отправки электронной почты:", error);
					res.status(500).json({
						error: "Ошибка отправки электронной почты",
					});
				} else {
					res.json({
						message:
							"Подтверждение регистрации отправлено на вашу почту",
					});
				}
			});
		} catch (error) {
			console.error("Ошибка регистрации:", error);
			res.status(500).json({ error: "Ошибка регистрации" });
		}
	},
	confirmEmail: async (req, res) => {
		try {
			const { confirmToken } = req.body;
			const { email } = req.body; 
	
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1 AND confirm_token = $2`,
				[email, confirmToken]
			);
	
			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message: "Неверный код подтверждения" });
			}
	
			await db.query(`UPDATE "user" SET is_confirmed = true WHERE email = $1`, [
				email,
			]);
	
			res.json({ message: "Почта подтверждена" });
		} catch (error) {
			console.error("Ошибка подтверждения:", error);
			res.status(500).json({ error: "Ошибка подтверждения" });
		}
	},
};

module.exports = authController;
