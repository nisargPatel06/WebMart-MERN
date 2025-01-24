const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app;
