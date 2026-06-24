import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("pages/register")
}); 

router.get("/login", (req, res) => {
    res.send("Login will come soon")
});

export default router 