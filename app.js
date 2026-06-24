import express from "express";

const app = express();

const PORT = 3000;


app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(PORT, () => {
    console.log("Running on port " + PORT);
});