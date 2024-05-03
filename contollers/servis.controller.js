const db = require("../database");
const { decodeToken } = require("../utils");

const serviceController = {
	createService: async (req, res) => {
		try {
			const { userId, Service, title, price, images, videoLink, description, previewLink, telegram, isHighlighted = false, isPremium = false, isVisible = true } = req.body;
			const [_, token] = await req.headers.authorization.split(" ");
			const { email, id } = await decodeToken({ token });
			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message: "Невалидный токен" });
			}

			const newService = await db.query(
				`INSERT INTO "service" (userId, Service, title, price, images, videoLink, description, previewLink, telegram, isHighlighted, isPremium, isVisible) 
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING title`,
				[id, Service, title, price, images, videoLink, description, previewLink, telegram, isHighlighted, isPremium, isVisible]
			);

			res.json({ message: "Сервис успешно создан", 
            service: newService.rows[0].title
         });
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},

	removeService: async (req, res) => {
		try {
			const { serviceId } = req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const { email } = decodeToken({ token });

			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message: "Невалидный токен" });
			}

			const deletedService = await db.query(
				`DELETE FROM "service" WHERE id = $1 RETURNING title`,
				[serviceId]
			);

			if (!deletedService.rows.length) {
				return res.status(400).json({ message: "Данный сервис не существует" });
			}

			res.json({ message: "Сервис успешно удален", service: deletedService.rows[0].title });
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},

	updateService: async (req, res) => {
		try {
			const { serviceId, userId, Service, title, price, images, videoLink, description, previewLink, telegram, isHighlighted, isPremium, isVisible } = req.body;
			const [_, token] = req.headers.authorization.split(" ");
			const { email, id } = decodeToken({ token });

			const user = await db.query(
				`SELECT * FROM "user" WHERE email = $1`,
				[email]
			);

			if (!user.rows.length) {
				return res
					.status(400)
					.json({ message: "Невалидный токен" });
			}

			const updatedService = await db.query(
				`UPDATE "service"
				 SET userId = $2, Service = $3, title = $4, price = $5, images = $6, videoLink = $7, description = $8, previewLink = $9, telegram = $10, isHighlighted = $11, isPremium = $12, isVisible = $13
				 WHERE id = $1 RETURNING title`,
				[serviceId, id, Service, title, price, images, videoLink, description, previewLink, telegram, isHighlighted, isPremium, isVisible]
			);

			if (!updatedService.rows.length) {
				return res.status(400).json({ message: "Данный сервис не существует" });
			}

			res.json({ message: "Сервис успешно изменен", service: updatedService.rows[0].title });
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},

	getServiceById: async (req, res) => {
		try {
			const { serviceId } = req.body;

			const service = await db.query(
				`SELECT * FROM "service" WHERE id = $1`,
				[serviceId]
			);

			if (!service.rows.length) {
				return res.status(400).json({ message: "Данный сервис не существует" });
			}

			res.json(service.rows[0]);
		} catch (error) {
			res.status(500).json({ error: "Ошибка сервера" });
		}
	},

	getServices: async (req, res) => {
        try {
            const { name, priceFrom, priceTo } = req.query
            let query = `SELECT * FROM "service" WHERE 1 = 1`;
    
            if (name) {
                query += ` AND "service" ILIKE '%${name}%'`;
            }
            if (priceFrom && priceTo) {
                query += ` AND "price" BETWEEN ${priceFrom} AND ${priceTo}`;
            } else if (priceFrom) {
                query += ` AND "price" >= ${priceFrom}`;
            } else if (priceTo) {
                query += ` AND "price" <= ${priceTo}`;
            }
    
            console.log("Generated query:", query); // Логирование сформированного SQL-запроса
    
            const services = await db.query(query);
    
            res.json(services.rows);
        } catch (error) {
            console.error("Error:", error); // Логирование ошибки, если возникла
            res.status(500).json({ error: "Ошибка сервера" });
        }
    },
};

module.exports = serviceController;