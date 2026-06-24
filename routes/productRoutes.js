import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");

    res.render("pages/products", {
      products: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong loading products");
  }
});

export default router;