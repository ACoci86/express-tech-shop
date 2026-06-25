import "dotenv/config";
import express from "express";
import session from "express-session";
import { pool } from "./db/index.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import { requireAuth } from "./middleware/requireAuth.js";
import cartRoutes from "./routes/cartRoutes.js"
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json()); //lets Express read JSON data
app.use(express.urlencoded({ extended: true })); //lets Express read data from HTML forms

// Serve static assets (stylesheet, images) referenced by the views
app.use("/css", express.static("views/css"));
app.use("/images", express.static("views/images"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //do not keep saving unchanged sessions (req.session.userId = user.id;)
    saveUninitialized: false //do not create empty sessions for anonymous visitors (req.session.userName = user.name;)
  })
);

app.use((req, res, next) => {
    res.locals.user = {
        id: req.session.userId,
        name: req.session.userName
    };

    next();
})

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    let featured = [];

    try {
        const result = await pool.query(
            "SELECT id, name, price, image_url, stock FROM products ORDER BY created_at DESC LIMIT 3"
        );
        featured = result.rows;
    } catch (error) {
        console.error(error);
    }

    res.render("pages/home", { featured });
});

app.get("/profile", requireAuth, (req, res) => {
     res.render("pages/profile");
});

app.use("/products", productRoutes);

app.use("/auth", authRoutes);

app.use("/cart", cartRoutes);

app.use("/checkout", checkoutRoutes);

app.use("/orders", orderRoutes);


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});