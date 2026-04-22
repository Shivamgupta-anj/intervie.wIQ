// // // import fs from "fs";
// // // import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
// // // import { askAi } from "../services/openRouter.service.js";

// // // export const analyzeResume = async (req, res) => {
// // //   try {
// // //     if (!req.file) {
// // //       return res.status(400).json({ message: "No file uploaded" });
// // //     }

// // //     const filepath = req.file.path;
// // //     const fileBuffer = await fs.promises.readFile(filepath);
// // //     const uint8Array = new Uint8Array(fileBuffer);

// // //     const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

// // //     let resumeText = "";

// // //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
// // //       const page = await pdf.getPage(pageNum);
// // //       const content = await page.getTextContent();

// // //       const pageText = content.items
// // //         .map((item) => item.str || "")
// // //         .join(" ");

// // //       resumeText += pageText + "\n";
// // //     }

// // //     resumeText = resumeText.replace(/\s+/g, " ").trim();

// // //     const messages = [
// // //       {
// // //         role: "system",
// // //         content: `Extract structured data from resume.
// // // Return strictly JSON:
// // // {
// // //   "role": "string",
// // //   "experience": "string",
// // //   "projects": ["project1", "project2"],
// // //   "skills": ["skill1", "skill2"]
// // // }`,
// // //       },
// // //       {
// // //         role: "user",
// // //         content: resumeText,
// // //       },
// // //     ];

// // //     const aiResponse = await askAi(messages);

// // //     let parsed;
// // //     try {
// // //       parsed = JSON.parse(aiResponse);
// // //     } catch (e) {
// // //       return res.status(500).json({
// // //         message: "AI returned invalid JSON",
// // //         raw: aiResponse,
// // //       });
// // //     }

// // //     fs.unlinkSync(filepath);

// // //     res.json({
// // //       role: parsed.role,
// // //       experience: parsed.experience,
// // //       projects: parsed.projects,
// // //       skills: parsed.skills,
// // //       resumeText,
// // //     });
// // //   } catch (error) {
// // //     console.error(error);

// // //     if (req.file && fs.existsSync(req.file.path)) {
// // //       fs.unlinkSync(req.file.path);
// // //     }

// // //     return res.status(500).json({ message: error.message });
// // //   }
// // // };

// // import fs from "fs";
// // // import * as pdfParse from "pdf-parse";
// // import * as pdfParse from "pdfjs-dist/legacy/build/pdf.mjs";
// // import { askAi } from "../services/openRouter.service.js";
// // import User from "../models/User.js";
// // import Interview from "../models/Interview.js";

// // export const analyzeResume = async (req, res) => {
// //   try {
// //     console.log("FILE:", req.file);

// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const filepath = req.file.path;

// //     // ✅ Read PDF
// //     const dataBuffer = await fs.promises.readFile(filepath);
// //     const pdfData = await pdfParse(dataBuffer);

// //     let resumeText = pdfData.text;

// //     resumeText = resumeText.replace(/\s+/g, " ").trim();

// //     // ✅ AI Prompt
// //     const messages = [
// //       {
// //         role: "system",
// //         content: `Extract structured data from resume.
// // Return strictly JSON:
// // {
// //   "role": "string",
// //   "experience": "string",
// //   "projects": ["project1", "project2"],
// //   "skills": ["skill1", "skill2"]
// // }`,
// //       },
// //       {
// //         role: "user",
// //         content: resumeText,
// //       },
// //     ];

// //     const aiResponse = await askAi(messages);

// //     let parsed;
// //     try {
// //       parsed = JSON.parse(aiResponse);
// //     } catch (e) {
// //       return res.status(500).json({
// //         message: "AI returned invalid JSON",
// //         raw: aiResponse,
// //       });
// //     }

// //     // ✅ delete file after use
// //     fs.unlinkSync(filepath);

// //     return res.json({
// //       role: parsed.role,
// //       experience: parsed.experience,
// //       projects: parsed.projects,
// //       skills: parsed.skills,
// //       resumeText,
// //     });

// //   } catch (error) {
// //     console.error("SERVER ERROR:", error);

// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     return res.status(500).json({ message: error.message });
// //   }
// // };

// // export const generateQuestion = async (req, res) => {
// //   try {
// //     let { role, experience, mode, resumeText, projects, skills } = req.body;

// //     // ✅ Fix: trim safely
// //     role = role?.trim();
// //     experience = experience?.trim();
// //     mode = mode?.trim();

// //     if (!role || !experience || !mode) {
// //       return res.status(400).json({
// //         message: "Role, experience and mode are required",
// //       });
// //     }

// //     const user = await User.findById(req.userId);

// //     if (!user) {
// //       return res.status(404).json({
// //         message: "User not found.",
// //       });
// //     }

// //     if (user.credits < 50) {
// //       return res.status(400).json({
// //         message: "Not enough credits. Minimum 50 required.",
// //       });
// //     }

// //     const projectText =
// //       Array.isArray(projects) && projects.length
// //         ? projects.join(", ")
// //         : "None";

// //     const skillsText =
// //       Array.isArray(skills) && skills.length
// //         ? skills.join(", ")
// //         : "None";

// //     const safeResume = resumeText?.trim() || "None";

// //     const userPrompt = `
// // Role: ${role}
// // Experience: ${experience}
// // InterviewMode: ${mode}
// // Projects: ${projectText}
// // Skills: ${skillsText}
// // Resume: ${safeResume}
// // `;

// //     if (!userPrompt.trim()) {
// //       return res.status(400).json({
// //         message: "Prompt content is empty.",
// //       });
// //     }

// //     const messages = [
// //       {
// //         role: "system",
// //         content: `You are a real human interviewer conducting a professional interview.

// // Speak in simple, natural English.

// // Generate exactly 5 interview questions.

// // Rules:
// // - Each question must be 15–30 words
// // - One question per line
// // - No numbering
// // - No extra text
// // - Keep it practical and realistic

// // Difficulty:
// // 1 → Easy  
// // 2 → Easy-Medium  
// // 3 → Medium  
// // 4 → Medium-Hard  
// // 5 → Hard`,
// //       },
// //       {
// //         role: "user",
// //         content: userPrompt,
// //       },
// //     ];

// //     // ✅ Fix: correct variable name
// //     const aiResponse = await askAi(messages);

// //     if (!aiResponse || !aiResponse.trim()) {
// //       return res.status(500).json({
// //         message: "AI returned empty response.",
// //       });
// //     }

// //     // ✅ Extract questions
// //     const questionsArray = aiResponse
// //       .split("\n")
// //       .map((q) => q.trim())
// //       .filter((q) => q.length > 0)
// //       .slice(0, 5);

// //     if (questionsArray.length === 0) {
// //       return res.status(500).json({
// //         message: "AI failed to generate questions.",
// //       });
// //     }

// //     user.credits -= 50;
// //     await user.save();

// //     const interview = await Interview.create({
// //       userId: req.user._id,
// //       role,
// //       experience,
// //       mode,
// //       resumeText: safeResume,
// //       Questions : questionsArray.map((q,index)=>({
// //         Question : q,
// //         difficulty : ["easy","easy-medium","medium","medium-hard","hard"],
// //         timeLimit : [60,60,90,90,120][index],
// //       }))
// //     })
// //     res.json ({
// //       interviewId : interview._id,
// //       creditsLeft : user.credits,
// //       questions : interview.Questions,
// //       userName : user.name,
// //     })


    
// //   } catch (error) {

// //     return res.status(500).json({
// //         message : `filed to create interview : ${error}`
// //       })
    
// //   }

// //   export const submitAnswer = async (req,res) => {
// //     try{

// //       const { interviewId, questionIndex, answer, timeTaken } = req.body

// // const interview = await Interview.findById(interviewId)
// // const question = interview.questions[questionIndex]

// // // If no answer
// // if (!answer) {
// // question.score = 0;
// // question. feedback = "You did not submit an answer.";
// // question.answer = "";

// // await interview.save();

// // return res.json({
// // feedback: question. feedback
// // });

// //     }

// //     if(timeTaken > question.timeLimit){
// //       question.score = 0;
// //       question.feedback = `Time limit exceeded. You took ${timeTaken} seconds but the limit was ${question.timeLimit} seconds.`;
// //       question.answer = answer;

// //       await interview.save();
// //       return res.json({
// //         feedback: question.feedback
// //       });
// //     }

// //     const messages = [
// //       {
// //         role : "system",
// //         content : `you are a professional human interviewer evaluting a candidate's answer.
        
// //         Evaluate naturally and fairly like a real preson would.
        
// //         score the answer in these areas (0 to 10): 
        
// //         1.Confidence – Does the answer sounds clear and confident?
// //         2.Relevance – How relevant is the answer to the question?
// //         3.Depth – Does the answer show deep understanding?
// //         4.Problem-Solving – Does the answer demonstrate good problem-solving skills?
// //         5.Communication – Is the answer well-structured and easy to understand?
        
// //         Rules :
        
// //         - Be realistic and unbaised
// //         - Do not give random high scores.
// //         - If the answer is weak, score low
// //         -if the answer is strong and detailed, score higher.
// //         - cosider clarity structure and relevance.

// //         Calculate :
// //         finalScore = average of confidence , communication and corrrectness(Rounded  nearest to whole number ).

// //         Feedback Rules:
// //         - Write natural human feedback.
// //         - 10 to 15 words only.
// //         - Sound like real interview feedback.
// //         - Can suggest improvement if needed.
// //         - Do NOT repeat the question.
// //         - Do NOT explain scoring.
// //         - Keep tone professional and honest.

// //         Return ONLY valid JSON in this format:
// // {
// //         "confidence": number,
// // "communication": number,
// // "correctness": number,
// // "finalScore": number,
// // "feedback": "short human feedback"

// //       }
// //       },


// // {

// // role: "user",
// // content:
// // Question: ${question.question}
// // Answer: ${answer}
      



// //         `
// //       }
// //     ];

// //     // const aiResponse = await askAi(messages);
// //     const aiResponse = await askAi(messages)

// // const parsed = JSON.parse(aiResponse);

// // question.answer = answer;
// // question. confidence = parsed.confidence;
// // question. communication = parsed. communication;
// // question.correctness = parsed.correctness;
// // question.score = parsed.finalScore;
// // question. feedback = parsed.feedback;

// // await interview.save();

// // return res.json(200).json({feedback: parsed.feedback})


// //     catch(error){
// //       return res.status(500).json({
// //         message : `filed to submit answer : ${error}`
// //       })
// //     }
// //   }


// // };

// import fs from "fs";
// import * as pdfParse from "pdfjs-dist/legacy/build/pdf.mjs";
// import { askAi } from "../services/openRouter.service.js";
// import User from "../models/usermodel.js";
// // import Interview from "../models/Interview.js";
// import Interview from "../models/interview.model.js";
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
//     const pdfData = await pdfParse(dataBuffer);

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

//     // delete file
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
//     let { role, experience, mode, resumeText, projects, skills } = req.body;

//     role = role?.trim();
//     experience = experience?.trim();
//     mode = mode?.trim();

//     if (!role || !experience || !mode) {
//       return res.status(400).json({
//         message: "Role, experience and mode are required",
//       });
//     }

//     const user = await User.findById(req.userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found.",
//       });
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

//     const messages = [
//       {
//         role: "system",
//         content: `You are a real human interviewer conducting a professional interview.

// Speak in simple, natural English.

// Generate exactly 5 interview questions.

// Rules:
// - Each question must be 15–30 words
// - One question per line
// - No numbering
// - No extra text

// Difficulty:
// 1 → Easy  
// 2 → Easy-Medium  
// 3 → Medium  
// 4 → Medium-Hard  
// 5 → Hard`,
//       },
//       {
//         role: "user",
//         content: userPrompt,
//       },
//     ];

//     const aiResponse = await askAi(messages);

//     if (!aiResponse || !aiResponse.trim()) {
//       return res.status(500).json({
//         message: "AI returned empty response.",
//       });
//     }

//     const questionsArray = aiResponse
//       .split("\n")
//       .map((q) => q.trim())
//       .filter((q) => q.length > 0)
//       .slice(0, 5);

//     if (questionsArray.length === 0) {
//       return res.status(500).json({
//         message: "AI failed to generate questions.",
//       });
//     }

//     user.credits -= 50;
//     await user.save();

//     const interview = await Interview.create({
//       userId: req.userId,
//       role,
//       experience,
//       mode,
//       resumeText: safeResume,
//       Questions: questionsArray.map((q, index) => ({
//         question: q,
//         difficulty: ["easy", "easy-medium", "medium", "medium-hard", "hard"][index],
//         timeLimit: [60, 60, 90, 90, 120][index],
//       })),
//     });

//     return res.json({
//       interviewId: interview._id,
//       creditsLeft: user.credits,
//       questions: interview.Questions,
//       userName: user.name,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to create interview: ${error}`,
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

//     const question = interview.Questions[questionIndex];

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     // ❌ No answer
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

//     const messages = [
//       {
//         role: "system",
//         content: `You are a professional interviewer evaluating answers.

// Score (0–10):
// - confidence
// - communication
// - correctness

// FinalScore = average (rounded)

// Feedback:
// - 10–15 words
// - Natural and professional
// - No explanation

// Return JSON:
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
//         content: `Question: ${question.question}
// Answer: ${answer}`,
//       },
//     ];

    



//   } catch (error) {
//     return res.status(500).json({
//       message: `failed to submit answer: ${error}`,
//     });
//   }
// };


// export const finsihInterview = async (req,res) => {
//   try{

//     const { interviewId } = req.body;

//     const interview = await Interview.findById(interviewId)
//     if(!interview){
//       return res.status(404).json({message : "Interview not found"})
//     }


//     const totalQuestions = interview.questions.length;

//     let totalScore = 0;
//     let totalConfidence = 0;
//     let totalCommunication = 0;
//     let totalCorrectness = 0;

//     interview.questions.forEach((q) => {
//       totalScore += q.score || 0;
//       totalConfidence += q.confidence || 0;
//       totalCommunication += q.communication || 0;
//       totalCorrectness += q.correctness || 0;
//     });

//     const finalScore = totalQuestions
//       ? totalScore / totalQuestions
//       : 0;

//       const avgConfidence = totalQuestions
//       ? totalConfidence / totalQuestions
//       : 0;

//       const avgCommunication = totalQuestions
//       ? totalCommunication / totalQuestions
//       : 0;

//       const avgCorrectness = totalQuestions
//       ? totalCorrectness / totalQuestions
//       : 0;

//       interview.finalScore = finalScore;
//       interview.status = "completed";

//       await interview.save();

//       return res.status(200).json({
//           finalScore: Number(finalScore.toFixed(1)),
//           confidence: Number(avgConfidence.toFixed(1)),
//           communication: Number(avgCommunication.toFixed(1)),
//           correctness: Number(avgCorrectness.toFixed(1)),
//           questionWiseScore: interview.questions.map((q) => ({
//           question: q.question,
//           score: q.score || 0,
//           feedback: q. feedback || "",
//           confidence: q.confidence || 0,
//           communication: q.communication || 0,
//           correctness: q.correctness || 0,

//           })),
//         })

//   }catch(error){

//     return res.status(500).json({
//       message : `failed to finish interview : ${error}`
//     })

//   }
// }


import fs from "fs";
// import pdfParse from "pdf-parse";
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
    const pdfData = await pdfParse(dataBuffer);  // ✅ fixed

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
      Array.isArray(projects) && projects.length
        ? projects.join(", ")
        : "None";

    const skillsText =
      Array.isArray(skills) && skills.length
        ? skills.join(", ")
        : "None";

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

Rules:
- Each question must be 15–30 words
- One question per line
- No numbering
- No extra text

Difficulty:
1 → Easy  
2 → Easy-Medium  
3 → Medium  
4 → Medium-Hard  
5 → Hard`,
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
      userId: req.userId,
      role,
      experience,
      mode,
      resumeText: safeResume,
      Questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy-medium", "medium", "medium-hard", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      questions: interview.Questions,
      userName: user.name,
    });

  } catch (error) {
    return res.status(500).json({
      message: `failed to create interview: ${error}`,
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

    const question = interview.Questions[questionIndex];
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
        content: `You are a professional interviewer evaluating answers.

Score (0–10):
- confidence
- communication
- correctness

FinalScore = average of all three (rounded to whole number)

Feedback rules:
- 10 to 15 words only
- Natural and professional tone
- No explanation of scoring
- Can suggest improvement if needed

Return ONLY valid JSON:
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

    const aiResponse = await askAi(messages);  // ✅ was missing

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

    return res.status(200).json({ feedback: parsed.feedback });  // ✅ fixed res.status(200).json

  } catch (error) {
    return res.status(500).json({
      message: `failed to submit answer: ${error}`,
    });
  }
};


/* =========================
   🏁 FINISH INTERVIEW
========================= */
export const finishInterview = async (req, res) => {  // ✅ fixed typo finsihInterview
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.Questions.length;  // ✅ capital Q

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.Questions.forEach((q) => {  // ✅ capital Q
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    interview.finalScore = finalScore;
    interview.status = "Completed";  // ✅ matches schema enum exactly

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.Questions.map((q) => ({  // ✅ capital Q
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });

  } catch (error) {
    return res.status(500).json({
      message: `failed to finish interview: ${error}`,
    });
  }
};