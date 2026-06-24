import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../db/index.js"

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("pages/register")
}); 

router.get("/login", (req, res) => {
    res.render("pages/login")
});

router.post("/register", async(req, res) => {

    try {
        const { name, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query (
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
            [name, email, passwordHash]
            
        );
        res.redirect("/auth/login")
    }

    catch(error) {
        console.error(error);
        res.status(500).send("Something went wrong!")
    }

})






export default router 