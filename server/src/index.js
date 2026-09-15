import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Warden API listening on :${port}`));
