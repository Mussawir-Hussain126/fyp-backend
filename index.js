import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
