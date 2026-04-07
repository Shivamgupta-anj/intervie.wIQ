// import express from "express";
// import dotenv from "dotenv";
// import connectDb from "./config/connectDb.js";
// import cors from "cors";
// import authRouter from "./routes/authroute.js";
// import cookieParser from "cookie-parser";
// import userRouter from "./routes/userroutes.js";
// import interviewRouter from "./routes/interview.route.js";

// dotenv.config();

// const app = express();

// // middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// // routes
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// // app.use("/api/interview", interviewRoutes);

// // server
// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   connectDb();
// });






// //  API Route



import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import cors from "cors";
import authRouter from "./routes/authroute.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userroutes.js";
import interviewRouter from "./routes/interview.route.js";

dotenv.config();
PORT=5000
const app = express();

//  middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ❗ remove trailing /
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//  routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//  THIS WAS MISSING
app.use("/api/interview", interviewRouter);

//  test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Server is running");
});

//  server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDb();
});
