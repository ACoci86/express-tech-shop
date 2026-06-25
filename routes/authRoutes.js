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

router.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;
        const result = await pool.query (
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(result.rows.length === 0) {
            return res.status(401).send("Invalid email or password")
        }

        const user = result.rows[0];

        const passwordMatches = await bcrypt.compare(
            password, user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).send("invalid email or password")
        }

        req.session.userId = user.id;
        req.session.userName = user.name;

        res.redirect("/")
    }
    catch(error) {
        console.error(error);
        res.status(500).send("Something went wrong when loggin in")
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("something went wrong when loggin out")
        }

        res.redirect("/");
    }) 
})





export default router 