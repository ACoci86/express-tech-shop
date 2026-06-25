import express from "express";
import { pool } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/:orderId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const orderId = req.params.orderId;

    const orderResult = await pool.query(
      `
      SELECT id, total, status, created_at
      FROM orders
      WHERE id = $1 AND user_id = $2
      `,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).send("Order not found");
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `
      SELECT
        order_items.quantity,
        order_items.price,
        products.id AS product_id,
        products.name,
        products.image_url
      FROM order_items
      JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = $1
      ORDER BY order_items.id ASC
      `,
      [orderId]
    );

    res.render("pages/order-confirmation", {
      order,
      orderItems: itemsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong loading your order");
  }
});

export default router;
