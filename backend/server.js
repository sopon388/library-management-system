require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "library-management-api" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/users", require("./routes/users"));
app.use("/api/loans", require("./routes/loans"));
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/dashboard", require("./routes/dashboard"));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch(err => { console.error(err); process.exit(1); });
