import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
// import { analyzeResume, generateQuestion } from "../controllers/interviewcontroller.js";

// interviewroute.js

import { analyzeResume, generateQuestion, submitAnswer, finishInterview } from "../controllers/interviewcontroller.js"
//                                                                          ✅ finishInterview (not finsihInterview)

const router = express.Router();

// // ✅ GET Interviews (Frontend ke liye)
// router.get("/", (req, res) => {
//   res.json([
//     {
//       title: "Frontend Interview",
//       description: "React, JavaScript, CSS questions",
//     },
//     {
//       title: "Backend Interview",
//       description: "Node.js, Express, MongoDB questions",
//     },
//   ]);
// });

// ✅ Resume Upload + AI Analysis
router.post(
  "/resume",
  isAuth,
  upload.single("resume"),
  analyzeResume
);

router.post("/generate-questions",isAuth,generateQuestion)
router.post("/submit-answer",isAuth,submitAnswer)
router.post("/finish",isAuth,finishInterview)

export default router;