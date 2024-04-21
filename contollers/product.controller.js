const db = require("../database");
const { decodeToken } = require("../utils");

const productController = {
	createProduct: async (req, res) => {
		try {
			const {shopId, title, price, stock, status, oldPrice = 0} =  req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const {email} = decodeToken({token})

			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message:"Невалидный токен" });
			}

			const currentShop = await db.query(
				`SELECT * FROM "shop" WHERE id = $1`,
				[shopId]
			);

			if (!currentShop.rows.length) {
				return res
					.status(400)
					.json({ message: "Магазин не найден" });
			}

			const newProduct = await db.query(
				`INSERT INTO "product" (shop_id, title, price, stock, status, old_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING title`,
				[shopId, title, price, stock, status, oldPrice]
			)

			res.json({message: "Товар успешно создан", product: newProduct.rows[0].title});
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	updateProduct: async (req, res) => {
		try {
			const {productId, shopId, title, price, stock, status, oldPrice = 0} =  req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const {email} = decodeToken({token})

			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message:"Невалидный токен" });
			}

			const currentShop = await db.query(
				`SELECT * FROM "shop" WHERE id = $1`,
				[shopId]
			);

			if (!currentShop.rows.length) {
				return res
					.status(400)
					.json({ message: "Магазин не найден" });
			}

			const currentProduct = await db.query(`SELECT * FROM "product" WHERE id = $1`, [productId])

			if (!currentProduct.rows.length) {
				return res.status(400).json({message: "Данный товар не существует"})
			}

			const updatedProduct = await db.query(
				`UPDATE "product"
 				SET shop_id = $2, title = $3, price = $4, stock = $5, status = $6, old_price = $7
 				WHERE id = $1 RETURNING title`,

				[productId, shopId, title, price, stock, status, oldPrice]
			)

			const productTitle = updatedProduct.rows[0].title

			res.json({message: "Товар успешно изменен", product: productTitle});
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getProductById: async (req, res) => {
		try {
			const {productId, shopId} =  req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const {email} = decodeToken({token})

			const result = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (result.rows.length === 0) {
				return res
					.status(400)
					.json({ message: "Пользователь не найден" });
			}

			const currentShop = await db.query(
				`SELECT * FROM "shop" WHERE id = $1`,
				[shopId]
			);

			if (!currentShop.rows.length) {
				return res
					.status(400)
					.json({ message: "Магазин не найден" });
			}

			const currentProduct = await db.query(`SELECT * FROM "product" WHERE id = $1`, [productId])

			if (!currentProduct.rows.length) {
				return res.status(400).json({message: "Данный товар не существует"})
			}

			const product = currentProduct.rows[0]

			return res.json(product)
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
	getAllProducts: async (req, res) => {
		try {
			const { shopId } =  req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const {email} = decodeToken({token})

			const result = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (result.rows.length === 0) {
				return res
					.status(400)
					.json({ message: "Пользователь не найден" });
			}

			const currentShop = await db.query(
				`SELECT * FROM "shop" WHERE id = $1`,
				[shopId]
			);

			if (!currentShop.rows.length) {
				return res
					.status(400)
					.json({ message: "Магазин не найден" });
			}

			const productList = await db.query(`SELECT * FROM "product"`)

			if (!productList.rows.length) {
				return res.status(400).json({message: "Данный товар не существует"})
			}

			const products = productList.rows

			return res.json(products)
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},
};

module.exports = productController;
