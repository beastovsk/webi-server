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
            console.log(service);
    
            if (!service.rows.length) {
                return res.status(400).json({ message: "Невалидный сервис" });
            }
    
            const { userId: sellerId } = service.rows[0]; // Получаем sellerId
    
            // Проверяем пользователя по токену
            const user = await db.query(
                `SELECT * FROM "user" WHERE email = $1`,
                [email]
            );
    
            if (!user.rows.length) {
                return res.status(400).json({ message: "Невалидный токен" });
            }
    
            // Создаем заказ
            const newOrder = await db.query(
                `INSERT INTO "order" (seller_id, service_id, buyer_id, status) 
                 VALUES ($1, $2, $3, 'await_payment') RETURNING id`,
                [sellerId, serviceId, id]
            );
    
            res.json({ message: "Заказ успешно создан", orderId: newOrder.rows[0].id });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    },
    closeOrder: async (req, res) => {
        try {
            const { orderId } = req.body;
            const customerId = req.user.id;

            // Проверяем, существует ли заказ
            const orderExists = await db.query(
                `SELECT * FROM "order" WHERE id = $1 AND customerId = $2`,
                [orderId, customerId]
            );

            if (!orderExists.rows.length) {
                return res.status(400).json({ message: "Данный заказ не существует или не принадлежит вам" });
            }

            // Закрываем заказ
            await db.query(
                `UPDATE "order" SET status = 'cancel' WHERE id = $1`,
                [orderId]
            );

            res.json({ message: "Статус заказа успешно изменен на 'cancel'" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const { orderId } = req.query;

            const order = await db.query(
                `SELECT * FROM "order" WHERE id = $1`,
                [orderId]
            );

            if (!order.rows.length) {
                return res.status(400).json({ message: "Данный заказ не существует" });
            }

            res.json(order.rows[0]);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    },

    getOrders: async (req, res) => {
        try {
            const customerId = req.user.id;

            const orders = await db.query(
                `SELECT * FROM "order" WHERE customerId = $1`,
                [customerId]
            );

            res.json(orders.rows);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
};

module.exports = orderController;