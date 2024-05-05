const db = require("../database");
const { decodeToken } = require("../utils");
const orderController = {
	createOrder: async (req, res) => {
		try {
			const { serviceId } = req.body;
			const [_, token] = await req.headers.authorization.split(" ");
			const { email, id } = await decodeToken({ token });
			const service = await db.query(
				`SELECT * FROM "service" WHERE id = $1`,
				[serviceId]
			);

			if (!service.rows.length) {
				return res.status(400).json({ message: "Невалидный сервис" });
			}
			const { owner_id: sellerId } = service.rows[0];
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);
			if (!user.rows.length) {
				return res.status(400).json({ message: "Невалидный токен" });
			}
			if (sellerId === id) {
				return res.status(400).json({
					message:
						"Вы не можете создать заказ на свой собственный сервис",
				});
			}
			const newOrder = await db.query(
				`INSERT INTO "order" (seller_id, service_id, buyer_id, status) VALUES ($1, $2, $3, 'await_payment') RETURNING id`,
				[sellerId, serviceId, id]
			);
			res.json({
				message: "Заказ успешно создан",
				orderId: newOrder.rows[0].id,
			});
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	closeOrder: async (req, res) => {
		try {
			const { orderId } = req.body;
			const [_, token] = await req.headers.authorization.split(" ");
			const { email, id } = await decodeToken({ token });
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);
			if (!user.rows.length) {
				return res.status(400).json({ message: "Невалидный токен" });
			}
			const order = await db.query(
				'SELECT * FROM "order" WHERE id = $1',
				[orderId]
			);

			if (!order.rows.length) {
				return res.status(400).json({ message: "Невалидный ордер" });
			}

			const [{ buyer_id, seller_id }] = order.rows;

			if (id === buyer_id || id === seller_id) {
				await db.query(
					`UPDATE "order" SET status = 'cancel' WHERE id = $1`,
					[orderId]
				);
				return res.json({ message: "Заказ отменен" });
			}

			res.status(400).json({
				buyer_id,
				id,
				seller_id,
				message: "Нет прав на закрытие заказа",
			});
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getOrderById: async (req, res) => {
		try {
			const { orderId } = req.query;
			const [_, token] = await req.headers.authorization.split(" ");
			const { email, id } = await decodeToken({ token });
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);
			if (!user.rows.length) {
				return res.status(400).json({ message: "Невалидный токен" });
			}
			const order = await db.query(
				'SELECT * FROM "order" WHERE id = $1',
				[orderId]
			);

			if (!order.rows.length) {
				return res.status(400).json({ message: "Невалидный ордер" });
			}

			const [{ buyer_id, seller_id }] = order.rows;

			if (buyer_id === id || seller_id === id) {
				return res.json({ order: order.rows[0] });
			}

			return res
				.status(400)
				.json({ message: "Нет прав на получение заказа" });
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getOrders: async (req, res) => {
		try {
			const [_, token] = await req.headers.authorization.split(" ");
			const { email, id } = await decodeToken({ token });
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);
			if (!user.rows.length) {
				return res.status(400).json({ message: "Невалидный токен" });
			}

			const orders = await db.query(
				'SELECT * FROM "order" WHERE seller_id = $1 OR buyer_id = $1',
				[id]
			);

			if (!orders.rows.length) {
				return res.json({ orders: [] });
			}

			res.json({ orders: orders.rows });
		} catch (error) {
			console.error("Error:", error);
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
};

module.exports = orderController;
