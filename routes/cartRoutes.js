import express from "express";
import { pool } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  res.send("Cart page coming soon");
});

export default router;