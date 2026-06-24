import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();


//render page with all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query 
    ("SELECT * FROM products ORDER BY id ASC");

    res.render("pages/products", {
      products: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong loading products");
  }
});

//render page with single product
router.get("/:id", async(req, res) => {

    try{
        const id = req.params.id;
        const result = await pool.query (
            "SELECT * FROM products WHERE id = $1",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Product not found");
        }
        res.render("pages/product-details", {
            product: result.rows[0]
        })
    }

    catch(error) {
        console.error(error);
        res.status(500).send("Something went wrong");

    }



})

export default router;