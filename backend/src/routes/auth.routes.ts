import express from "express";
import { redirectToSlack, handleSlackCallback } from "../controllers/auth.controller";

const router = express.Router();

router.get("/slack", redirectToSlack);
router.get("/slack/callback", handleSlackCallback);

// ✅ Auth-less version of /me
router.get("/me", (req, res) => {
  const { user_id, team_id } = req.query;

  if (!user_id || !team_id) {
    return res.status(400).json({ error: "Missing team_id or user_id" });
  }

  return res.status(200).json({ user_id, team_id });
});

export default router;
