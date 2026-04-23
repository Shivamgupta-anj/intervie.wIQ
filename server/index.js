// // // // import express from "express";
// // // // import dotenv from "dotenv";
// // // // import connectDb from "./config/connectDb.js";
// // // // import cors from "cors";
// // // // import authRouter from "./routes/authroute.js";
// // // // import cookieParser from "cookie-parser";
// // // // import userRouter from "./routes/userroutes.js";
// // // // import interviewRouter from "./routes/interview.route.js";

// // // // dotenv.config();

// // // // const app = express();

// // // // // middleware
// // // // app.use(cors({
// // // //   origin: "http://localhost:5173",
// // // //   credentials: true,
// // // // }));

// // // // app.use(express.json());
// // // // app.use(cookieParser());

// // // // // routes
// // // // app.use("/api/auth", authRouter);
// // // // app.use("/api/user", userRouter);
// // // // // app.use("/api/interview", interviewRoutes);

// // // // // server
// // // // const port = process.env.PORT || 5000;

// // // // app.listen(port, () => {
// // // //   console.log(`Server running on port ${port}`);
// // // //   connectDb();
// // // // });






// // // // //  API Route



// // // import express from "express";
// // // import dotenv from "dotenv";
// // // import connectDb from "./config/connectDb.js";
// // // import cors from "cors";
// // // import authRouter from "./routes/authroute.js";
// // // import cookieParser from "cookie-parser";
// // // import userRouter from "./routes/userroutes.js";
// // // import interviewRouter from "./routes/interview.route.js";

// // // dotenv.config();

// // // const app = express();

// // // //  middleware
// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:5173", // ❗ remove trailing /
// // //     credentials: true,
// // //   })
// // // );

// // // app.use(express.json());
// // // app.use(cookieParser());

// // // //  routes
// // // app.use("/api/auth", authRouter);
// // // app.use("/api/user", userRouter);

// // // //  THIS WAS MISSING
// // // app.use("/api/interview", interviewRouter);

// // // //  test route (optional but useful)
// // // app.get("/", (req, res) => {
// // //   res.send("Server is running");
// // // });

// // // //  server
// // // const port = process.env.PORT || 5000;

// // // app.listen(port, () => {
// // //   console.log(`Server running on port ${port}`);
// // //   connectDb();
// // // });



// // import express from "express";
// // import dotenv from "dotenv";
// // import connectDb from "./config/connectDb.js";
// // import cors from "cors";
// // import authRouter from "./routes/authroute.js";
// // import cookieParser from "cookie-parser";
// // import userRouter from "./routes/userroutes.js";
// // import interviewRouter from "./routes/interview.route.js";

// // dotenv.config();

// // const app = express();

// // // middleware
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     credentials: true,
// //   })
// // );

// // app.use(express.json());
// // app.use(cookieParser());

// // // routes
// // app.use("/api/auth", authRouter);
// // app.use("/api/user", userRouter);
// // // app.use("/api/interview", interviewRouter 
// // app.use("/interview", interviewRouter )

// // // test route
// // app.get("/", (req, res) => {
// //   res.send("Server is running");
// // });

// // // server
// // const port = process.env.PORT || 5000;

// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// //   connectDb();
// // });

// import express from "express";
// import dotenv from "dotenv";
// import connectDb from "./config/connectDb.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// dotenv.config();
// import authRouter from "./routes/authroute.js";
// import userRouter from "./routes/userroutes.js";
// import interviewRouter from "./routes/interview.route.js";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";

// app.use(cookieParser());


// const app = express();

// // ─── Middleware ───────────────────────────────────────────
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// // ─── Routes ───────────────────────────────────────────────
// app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);
// app.use("/api/interview", interviewRouter);  // ✅ consistent /api prefix

// // ─── Health Check ─────────────────────────────────────────
// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// // ─── Start Server ─────────────────────────────────────────
// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
//   connectDb();
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./config/connectDb.js";
import authRouter from "./routes/authroute.js";
import userRouter from "./routes/userroutes.js";
import interviewRouter from "./routes/interview.route.js";

dotenv.config();

const app = express(); // ✅ declare app first

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser()); // ✅ only once, after app is declared

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRouter);
// app.use("/api/auth/logout", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);

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