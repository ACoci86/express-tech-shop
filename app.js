import express from "express";
import { pool } from "./db/index.js"; // Note: If using native ES Modules, you often need the .js extension

const app = express();
const PORT = 3000;

// Middleware for parsing requests (Good practice to include early)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212"
  },
  {
    id: 3,
    name: "USB-C Hub",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761"
  }
];

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/products", (req, res) => {
    res.render("pages/products", { products });
});


app.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS now");
        res.send("DB connected: " + result.rows[0].now);
    } catch (error) {
        console.error(error);
        res.status(500).send("DB connection failed");
    }
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});