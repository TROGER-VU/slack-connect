import express from "express";
import { redirectToSlack, handleSlackCallback } from "../controllers/auth.controller";

const router = express.Router();

router.get("/slack", redirectToSlack);
router.get("/slack/callback", handleSlackCallback);

export default router;
