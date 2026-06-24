import express from "express";
import { pool } from "./db/index.js";
import productRoutes from "./routes/productRoutes.js"


const app = express();
const PORT = 3000;

// Middleware for parsing requests (Good practice to include early)
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/home");
});

app.use("/products", productRoutes);


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});