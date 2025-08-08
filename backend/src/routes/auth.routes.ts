import express from "express";
import { redirectToSlack, handleSlackCallback } from "../controllers/auth.controller";
import { AuthenticatedRequest, authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/slack", redirectToSlack);
router.get("/slack/callback", handleSlackCallback);

router.get("/me", authenticateUser, (req: AuthenticatedRequest, res) => {
    console.log("🔐 Authenticated user:", req.user);
    if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { user_id, team_id } = req.user!;
  res.status(200).json({ user_id, team_id });
});

export default router;
