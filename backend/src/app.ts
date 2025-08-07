import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK", time: new Date() });
});

export default app;
