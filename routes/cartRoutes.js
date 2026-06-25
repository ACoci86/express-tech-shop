import express from "express";
import { pool } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/add/:productId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const productId = req.params.productId;

    await pool.query(
      `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + 1
      `,
      [userId, productId]
    );

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong adding item to cart");
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;

    const result = await pool.query(
      `
      SELECT 
        cart_items.id AS cart_item_id,
        cart_items.quantity,
        products.id AS product_id,
        products.name,
        products.price,
        products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = $1
      ORDER BY cart_items.id ASC
      `,
      [userId]
    );

    res.render("pages/cart", {  cartItems: result.rows})
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong loading your cart");
  }
});

router.post("/remove/:cartItemId", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartItemId = req.params.cartItemId;

    await pool.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
      [cartItemId, userId]
    );

    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong removing item from cart");
  }
});

export default router;