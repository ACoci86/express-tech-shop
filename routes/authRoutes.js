import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
    res.send("Register will come soon")
}); 

router.get("/login", (req, res) => {
    res.send("Login will come soon")
});

export default router 