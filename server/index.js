


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDb.js";
import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userroutes.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(cors({
    origin: [
        "http://localhost:5173",                          // for local dev
        "https://intervie-wiq-clientside.onrender.com"   // for production
    ],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment",paymentRouter)

// ─── Health Check ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ─── Start Server ─────────────────────────────────────────
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
});