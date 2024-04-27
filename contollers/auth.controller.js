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
			const confirmToken = await v4();

			const newUser = await db.query(
				`INSERT INTO "user" (email, password, is_valid, confirm_token) VALUES ($1, $2, $3, $4) RETURNING id, email`,
				[email, hash, false, confirmToken]
			);

			const [user] = newUser.rows;

			const token = await generateToken({
				id: user.id,
				email: user.email,
			});

			const mailOptions = {
				from: "coctencoflez@gmail.com",
				to: email,
				subject: "Подтверждение регистрации",
				text: `Поздравляем с успешной регистрацией! Перейдите по ссылке, чтобы подтвердить свою учетную запись: http://localhost:3000/confirm/${confirmToken}`,
			};

			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					res.status(500).json({
						error: "Ошибка отправки электронной почты",
					});
				} else {
					res.json({
						token,
						message:
							"Подтверждение регистрации отправлено на вашу почту",
					});
				}
			});
		} catch (error) {
			res.status(500).json({ error: "Ошибка регистрации" });
		}
	},
	confirmEmail: async (req, res) => {
		try {
			const { confirmCode } = req.body;
			const [_, token] = await req.headers.authorization.split(" ");
			const { email } = await decodeToken({ token });

			const currentUser = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!currentUser.rows.length) {
				return res
					.status(400)
					.json({ message: "Пользователь не найден" });
			}

			const [user] = currentUser.rows;

			if (user.is_valid) {
				return res
					.status(400)
					.json({ message: "Почта уже подтверждена" });
			}

			if (confirmCode != user.confirm_token) {
				return res.status(400).json({
					message: "Неверный код подтверждения",
				});
			}

			await db.query(`UPDATE "user" SET is_valid = $2 WHERE email = $1`, [
				email,
				true,
			]);
			return res.json({ message: "Почта подтверждена" });
		} catch (error) {
			res.status(500).json({ error: "Ошибка подтверждения" });
		}
	},
};

module.exports = authController;
