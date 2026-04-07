import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interviewcontroller.js";

const router = express.Router();

// ✅ GET Interviews (Frontend ke liye)
router.get("/", (req, res) => {
  res.json([
    {
      title: "Frontend Interview",
      description: "React, JavaScript, CSS questions",
    },
    {
      title: "Backend Interview",
      description: "Node.js, Express, MongoDB questions",
    },
  ]);
});

// ✅ Resume Upload + AI Analysis
router.post(
  "/resume",
  isAuth,
  upload.single("resume"),
  analyzeResume
);

export default router;