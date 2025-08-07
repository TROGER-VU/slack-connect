import app from "./app";
import connectDB from "./db";
import { startMessageScheduler } from "./services/scheduler.service";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    startMessageScheduler();
  });
});
