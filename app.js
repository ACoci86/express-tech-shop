import "dotenv/config";
import express from "express";
import session from "express-session";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();
const PORT = 3000;

app.use(express.json()); //lets Express read JSON data
app.use(express.urlencoded({ extended: true })); //lets Express read data from HTML forms

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //do not keep saving unchanged sessions (req.session.userId = user.id;)
    saveUninitialized: false //do not create empty sessions for anonymous visitors (req.session.userName = user.name;)
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("pages/home");
});

app.use("/products", productRoutes);

app.use("/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});