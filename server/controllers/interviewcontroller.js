

// import fs from "fs";
// // import pdfParse from "pdf-parse";
// import { askAi } from "../services/openRouter.service.js";
// import User from "../models/usermodel.js";
// import Interview from "../models/interview.model.js";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse");
// /* =========================
//    📄 ANALYZE RESUME
// ========================= */
// export const analyzeResume = async (req, res) => {
//   try {
//     console.log("FILE:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const filepath = req.file.path;

//     const dataBuffer = await fs.promises.readFile(filepath);
//     const pdfData = await pdfParse(dataBuffer);  // ✅ fixed

//     let resumeText = pdfData.text || "";
//     resumeText = resumeText.replace(/\s+/g, " ").trim();

//     const messages = [
//       {
//         role: "system",
//         content: `Extract structured data from resume.
// Return strictly JSON:
// {
//   "role": "string",
//   "experience": "string",
//   "projects": ["project1", "project2"],
//   "skills": ["skill1", "skill2"]
// }`,
//       },
//       {
//         role: "user",
//         content: resumeText,
//       },
//     ];

//     const aiResponse = await askAi(messages);

//     let parsed;
//     try {
//       parsed = JSON.parse(aiResponse);
//     } catch (e) {
//       return res.status(500).json({
//         message: "AI returned invalid JSON",
//         raw: aiResponse,
//       });
//     }

//     fs.unlinkSync(filepath);

//     return res.json({
//       role: parsed.role || "",
//       experience: parsed.experience || "",
//       projects: parsed.projects || [],
//       skills: parsed.skills || [],
//       resumeText,
//     });

//   } catch (error) {
//     console.error("SERVER ERROR:", error);

//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     return res.status(500).json({ message: error.message });
//   }
// };


// /* =========================
//    🎯 GENERATE QUESTIONS
// ========================= */
// export const generateQuestion = async (req, res) => {
//   try {
//     // console.log("req.userId:", req.userId);      // ← ADD THIS
//     // console.log("req.user:", req.user);          // ← ADD THIS
//     // console.log("req.body:", req.body);    
//     let { role, experience, mode, resumeText, projects, skills } = req.body;
//         console.log("BEFORE TRIM:", { role, experience, mode });

//     role = role?.trim();
//     experience = experience?.trim();
//     mode = mode?.trim();
//     console.log("AFTER TRIM:", { role, experience, mode });

//     if (!role || !experience || !mode) {
//       return res.status(400).json({
//         message: "Role, experience and mode are required",
//       });
//     }

//     const user = await User.findById(req.userId);

//      console.log("USER FOUND:", user);        // ← ADD THIS
//     console.log("USER CREDITS:", user?.credits); // ← ADD THIS
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (user.credits < 50) {
//       return res.status(400).json({
//         message: "Not enough credits. Minimum 50 required.",
//       });
//     }

//     const projectText =
//       Array.isArray(projects) && projects.length
//         ? projects.join(", ")
//         : "None";

//     const skillsText =
//       Array.isArray(skills) && skills.length
//         ? skills.join(", ")
//         : "None";

//     const safeResume = resumeText?.trim() || "None";

//     const userPrompt = `
// Role: ${role}
// Experience: ${experience}
// InterviewMode: ${mode}
// Projects: ${projectText}
// Skills: ${skillsText}
// Resume: ${safeResume}
// `;

// if(!userPrompt.trim()){
//   return res.status(400).json({
//     message : "Prompt content is empty."
//   })
// }

//     const messages = [
//       {
//         role: "system",
//         content: `You are a real human interviewer conducting a professional interview.

// Speak in simple, natural English.

// Generate exactly 5 interview questions.

// Strict Rules:
// - Each question must be 15–30 words
// -Each question must be a single complete sentence.
// -Do not number them,
// -Do not add explanations.
// -keep language simple and conversational.
// - One question per line
// - No numbering
// - No extra text

// Difficulty:
// Question 1 → Easy  
// Question 2 → Easy-Medium  
// Question 3 → Medium  
// Question 4 → Medium-Hard  
// Question 5 → Hard

// Make questions based on the candidate's role, experience,interviewMode, projects, skills and resume details.
// `,

//       },
//       {
//         role: "user",
//         content: userPrompt,
//       },
//     ];

//     const aiResponse = await askAi(messages);

//     if (!aiResponse || !aiResponse.trim()) {
//       return res.status(500).json({ message: "AI returned empty response." });
//     }

//     const questionsArray = aiResponse
//       .split("\n")
//       .map((q) => q.trim())
//       .filter((q) => q.length > 0)
//       .slice(0, 5);

//     if (questionsArray.length === 0) {
//       return res.status(500).json({ message: "AI failed to generate questions." });
//     }

//     user.credits -= 50;
//     await user.save();

//     const interview = await Interview.create({
//       userId: user._id,
//       role,
//       experience,
//       mode,
//       resumetext: safeResume,
//       questions: questionsArray.map((q, index) => ({
//         question: q,
//         difficulty: ["easy", "easy-medium", "medium", "medium-hard", "hard"][index],
//         timeLimit: [60, 60, 90, 90, 120][index],
//       })),
//     });

//     return res.json({
//       interviewId: interview._id,
//       creditsLeft: user.credits,
//       userName: user.name,
//       questions: interview.questions,
      
//     });

//   } catch (error) {
//     // return res.status(500).json({
//     //   message: `failed to create interview: ${error}`,
//     // });
//     console.error("FULL ERROR:", error);  // ← shows real error in terminal
//     return res.status(500).json({
//       message: error.message,
//       stack: error.stack,
//     });
//   }
// };


// /* =========================
//    🧠 SUBMIT ANSWER
// ========================= */
// export const submitAnswer = async (req, res) => {
//   try {
//     const { interviewId, questionIndex, answer, timeTaken } = req.body;

//     const interview = await Interview.findById(interviewId);
//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     const question = interview.questions[questionIndex];
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     // ❌ No answer submitted
//     if (!answer) {
//       question.score = 0;
//       question.feedback = "You did not submit an answer.";
//       question.answer = "";
//       await interview.save();
//       return res.json({ feedback: question.feedback });
//     }

//     // ⏱ Time exceeded
//     if (timeTaken > question.timeLimit) {
//       question.score = 0;
//       question.feedback = `Time limit exceeded. You took ${timeTaken}s but limit was ${question.timeLimit}s.`;
//       question.answer = answer;
//       await interview.save();
//       return res.json({ feedback: question.feedback });
//     }

//     // 🤖 AI Evaluation
//     const messages = [
//       {
//         role: "system",
//         content: `You are a professional interviewer evaluating a candidate's answers in a real interview.

//         evaluate naturally and fairly like a real person would.
//         score the answer in these areas (0 to 10):

//         1. Confidence – Does the answer sound clear and confident and well-presented?
//         2. Communication – Is the answer well-structured and easy to understand?
//         3. Correctness – How correct and relevant is the answer to the question?

//         Rules :
//         -Be realistic and unbiased.
//         -Do not give random high scores.
//         -If the answer is weak, score low.
//         -If the answer is strong and detailed, score higher.
//         -Consider clarity, structure and relevance.

//         calculate :
//         finalscore = average of confidence, communication and correctness (Rounded to nearest whole number).

//         feedback rules:
//         - Write natural human feedback.
//         - 10 to 15 words only.
//         - Sound like real interview feedback.
//         - Can suggest improvement if needed.
//         - Do NOT repeat the question.
//         - Do NOT explain scoring.
//         - Keep tone professional and honest.

//         return ONLY valid JSON in this format:

// {
//   "confidence": number,
//   "communication": number,
//   "correctness": number,
//   "finalScore": number,
//   "feedback": "text"
// }`,
//       },
//       {
//         role: "user",
//         content: `Question: ${question.question}\nAnswer: ${answer}`,
//       },
//     ];

//     const aiResponse = await askAi(messages);  // ✅ was missing

//     let parsed;
//     try {
//       parsed = JSON.parse(aiResponse);
//     } catch (e) {
//       return res.status(500).json({
//         message: "AI returned invalid JSON",
//         raw: aiResponse,
//       });
//     }

//     // ✅ Save evaluation to question
//     question.answer = answer;
//     question.confidence = parsed.confidence;
//     question.communication = parsed.communication;
//     question.correctness = parsed.correctness;
//     question.score = parsed.finalScore;
//     question.feedback = parsed.feedback;

//     await interview.save();

//     return res.status(200).json({ feedback: parsed.feedback });  // ✅ fixed res.status(200).json

//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to submit answer: ${error}`,
//     });
//   }
// };


// /* =========================
//    🏁 FINISH INTERVIEW
// ========================= */
// export const finishInterview = async (req, res) => {  // ✅ fixed typo finsihInterview
//   try {
//     const { interviewId } = req.body;

//     const interview = await Interview.findById(interviewId);
//     if (!interview) {
//       return res.status(404).json({ message: "Interview not found" });
//     }

//     const totalQuestions = interview.Questions.length;  // ✅ capital Q

//     let totalScore = 0;
//     let totalConfidence = 0;
//     let totalCommunication = 0;
//     let totalCorrectness = 0;

//     interview.Questions.forEach((q) => {  // ✅ capital Q
//       totalScore += q.score || 0;
//       totalConfidence += q.confidence || 0;
//       totalCommunication += q.communication || 0;
//       totalCorrectness += q.correctness || 0;
//     });

//     const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
//     const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
//     const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
//     const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

//     interview.finalScore = finalScore;
//     interview.status = "Completed";  // ✅ matches schema enum exactly

//     await interview.save();

//     return res.status(200).json({
//       finalScore: Number(finalScore.toFixed(1)),
//       confidence: Number(avgConfidence.toFixed(1)),
//       communication: Number(avgCommunication.toFixed(1)),
//       correctness: Number(avgCorrectness.toFixed(1)),
//       questionWiseScore: interview.Questions.map((q) => ({  // ✅ capital Q
//         question: q.question,
//         score: q.score || 0,
//         feedback: q.feedback || "",
//         confidence: q.confidence || 0,
//         communication: q.communication || 0,
//         correctness: q.correctness || 0,
//       })),
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to finish interview: ${error}`
//     });
//   }
// };


// export const getMyInterviews =async (req,res)=>{
//   try{
//     const interview = await Interview.find({userId:req.userId})
//     .sort({createdAt:-1})
//     .select("role experience mode finalScore status createdAt");

//     return res.status(200).json(interview)

//   }catch (err){
//     return res.status(500).json({message:`failed to find currentUser Interview ${err}`})
//   }
// }

// export const getInterviewReport = async (req,res)=>{
//   try{
//     const interview = await Interview.findById(req.params.id)
//     if(!interview){
//       return res.status(404).json ({message:"Interview not dound"})
//     }
//     const totalQuestions = interview.questions.length;  

    
//     let totalConfidence = 0;
//     let totalCommunication = 0;
//     let totalCorrectness = 0;

//     interview.questions.forEach((q) => {  // ✅ capital Q
      
//       totalConfidence += q.confidence || 0;
//       totalCommunication += q.communication || 0;
//       totalCorrectness += q.correctness || 0;
//     });

//     // const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
//     const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
//     const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
//     const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;


//     return res.json({
//       role: interview.role,           // ✅ add
//       experience: interview.experience, // ✅ add
//       mode: interview.mode,
//       finalScore : interview.finalScore,
//       confidence : Number(avgConfidence.toFixed(1)),
//       communication : Number(avgCommunication.toFixed(1)),
//       correctness:Number(avgCorrectness.toFixed(1)),
//       questionWiseScore:interview.questions


//     })

    

//   }catch(err){
//     return res.status(404).json({message:`failed to find currentUser Interview report ${err}`})

//   }
// }


import fs from "fs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/usermodel.js";
import Interview from "../models/interview.model.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/* =========================
   📄 ANALYZE RESUME
========================= */
export const analyzeResume = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filepath = req.file.path;

    const dataBuffer = await fs.promises.readFile(filepath);
    const pdfData = await pdfParse(dataBuffer);

    let resumeText = pdfData.text || "";
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `Extract structured data from resume.
Return strictly JSON:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: aiResponse,
      });
    }

    fs.unlinkSync(filepath);

    return res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      resumeText,
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};


/* =========================
   🎯 GENERATE QUESTIONS
========================= */
export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, experience and mode are required",
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
Role: ${role}
Experience: ${experience}
InterviewMode: ${mode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
`;

    const messages = [
      {
        role: "system",
        content: `You are a real human interviewer conducting a professional interview.

Speak in simple, natural English.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must be 15–30 words
- Each question must be a single complete sentence.
- Do not number them.
- Do not add explanations.
- Keep language simple and conversational.
- One question per line
- No numbering
- No extra text

Difficulty:
Question 1 → Easy  
Question 2 → Easy-Medium  
Question 3 → Medium  
Question 4 → Medium-Hard  
Question 5 → Hard

Make questions based on the candidate's role, experience, interviewMode, projects, skills and resume details.`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response." });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res.status(500).json({ message: "AI failed to generate questions." });
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumetext: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy-medium", "medium", "medium-hard", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};


/* =========================
   🧠 SUBMIT ANSWER
========================= */
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ❌ No answer submitted
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    // ⏱ Time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = `Time limit exceeded. You took ${timeTaken}s but limit was ${question.timeLimit}s.`;
      question.answer = answer;
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    // 🤖 AI Evaluation
    const messages = [
      {
        role: "system",
        content: `You are a professional interviewer evaluating a candidate's answers in a real interview.

Evaluate naturally and fairly like a real person would.
Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear and confident and well-presented?
2. Communication – Is the answer well-structured and easy to understand?
3. Correctness – How correct and relevant is the answer to the question?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score higher.
- Consider clarity, structure and relevance.

Calculate:
finalScore = average of confidence, communication and correctness (rounded to nearest whole number).

Feedback rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "text"
}`,
      },
      {
        role: "user",
        content: `Question: ${question.question}\nAnswer: ${answer}`,
      },
    ];

    const aiResponse = await askAi(messages);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (e) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: aiResponse,
      });
    }

    // ✅ Save evaluation to question
    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });

  } catch (error) {
    return res.status(500).json({
      message: `failed to submit answer: ${error}`,
    });
  }
};


/* =========================
   🏁 FINISH INTERVIEW
========================= */
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // ✅ FIXED: lowercase "questions" — was "Questions" (capital Q) before
    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    // ✅ FIXED: lowercase "questions"
    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    interview.finalScore = Number(finalScore.toFixed(1));

    // ✅ FIXED: lowercase "completed" — was "Completed" which didn't match schema enum
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      // ✅ FIXED: lowercase "questions"
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });

  } catch (error) {
    console.error("finishInterview error:", error);
    return res.status(500).json({
      message: `failed to finish interview: ${error}`,
    });
  }
};


/* =========================
   📋 GET MY INTERVIEWS
========================= */
export const getMyInterviews = async (req, res) => {
  try {
    // ✅ FIXED: also select "questionWiseScore" so frontend fallback works
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt questions");

    // ✅ Build a clean response with score fallback calculated on backend too
    const result = interviews.map((item) => {
      let finalScore = item.finalScore || 0;

      // If finalScore is 0 but questions have scores, calculate it
      if (finalScore === 0 && item.questions && item.questions.length > 0) {
        const scored = item.questions.filter((q) => q.score);
        if (scored.length > 0) {
          finalScore = parseFloat(
            (scored.reduce((sum, q) => sum + (q.score || 0), 0) / scored.length).toFixed(1)
          );
        }
      }

      // If questions have scores, treat as completed
      const hasAnswers = item.questions && item.questions.some((q) => q.score > 0);
      const status = item.status === "completed" || hasAnswers ? "completed" : item.status || "incompleted";

      return {
        _id: item._id,
        role: item.role,
        experience: item.experience,
        mode: item.mode,
        finalScore,
        status,
        createdAt: item.createdAt,
      };
    });

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({
      message: `failed to find currentUser Interview ${err}`,
    });
  }
};


/* =========================
   📊 GET INTERVIEW REPORT
========================= */
export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    // ✅ FIXED: was not calculating finalScore here — now it does
    const computedFinalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    // Use saved finalScore if valid, otherwise compute from questions
    const finalScore =
      interview.finalScore && interview.finalScore > 0
        ? interview.finalScore
        : Number(computedFinalScore.toFixed(1));

    return res.json({
      role: interview.role,
      experience: interview.experience,
      mode: interview.mode,
      name: interview.name || "",          // include name if stored
      finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });

  } catch (err) {
    return res.status(500).json({
      message: `failed to find currentUser Interview report ${err}`,
    });
  }
};
