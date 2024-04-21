const db = require("../database");

const orderController = {
	createOrder: async (req, res) => {
		try {
			const {shopId, phone, name, email, address, products} =  req.body;

			const currentShop = await db.query(`SELECT * FROM "shop" WHERE id = $1`, [shopId])

			if (!currentShop.rows.length) {
				res.status(400).json({
					message: "Магазин не найден"
				})
			}

			await db.query(`INSERT INTO "order" (shop_id, phone, name, email, address, products) VALUES ($1, $2, $3, $4, $5, $6)`,
				[shopId, phone, name, email, address, products]
			);

			res.json({message: "Заказ успешно создан"});
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getOrders: async (req, res) => {
		try {
			const {shopId} =  req.body;

			const currentShop = await db.query(`SELECT * FROM "shop" WHERE id = $1`, [shopId])

			if (!currentShop.rows.length) {
				return res.status(400).json({
					message: "Магазин не найден"
				})
			}

			const currentOrder = await db.query(`SELECT * FROM "order" WHERE shop_id = $1`, [shopId])

			if (!currentOrder.rows.length) {
				return res.status(400).json({
					message: "Заказ не найден"
				})
			}

			const [order] = currentOrder.rows

			res.json(order);
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getOrderById: async (req, res) => {
		try {
			const {shopId, orderId} =  req.body;

			const currentShop = await db.query(`SELECT * FROM "shop" WHERE id = $1`, [shopId])

			if (!currentShop.rows.length) {
				return res.status(400).json({
					message: "Магазин не найден"
				})
			}

			const currentOrder = await db.query(`SELECT * FROM "order" WHERE shop_id = $1 AND id = $2`, [shopId, orderId])

			if (currentOrder.rows.length === 0) {
				return res.status(400).json({
					message: "Заказ не найден"
				})
			}

			const [order] = currentOrder.rows

			return res.json(order)
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
};

module.exports = orderController;
