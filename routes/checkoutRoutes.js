import express from "express";
import { pool } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.session.userId;

    await client.query("BEGIN");

    const cartResult = await client.query(
      `
      SELECT 
        cart_items.id AS cart_item_id,
        cart_items.quantity,
        products.id AS product_id,
        products.name,
        products.price
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = $1
      ORDER BY cart_items.id ASC
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).send("Your cart is empty");
    }

    let total = 0;

    cartResult.rows.forEach((item) => {
      total = total + item.price * item.quantity;
    });

    const orderResult = await client.query(
      `
      INSERT INTO orders (user_id, total, status)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [userId, total, "paid"]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cartResult.rows) {
      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await client.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [userId]
    );

    await client.query("COMMIT");

    res.send(`Order created successfully. Your order ID is ${orderId}.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).send("Something went wrong during checkout");
  } finally {
    client.release();
  }
});

export default router;