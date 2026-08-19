import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
import User from "../models/user.models.js";
import { monitorEventLoopDelay } from "perf_hooks";
import Interview from "../models/interview.model.js";


export const analyzeResume = async (req, res) => {
  console.log("1. controller hit");
  console.log("2.req.file", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file required" });
    }
    //read file from the disk
    const filePath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    //load pdf
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    // extract text from all pages
    let resumeText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `
              extract structured data from resume.
              Return ONLY valid JSON:
              {
              "role":"string",
              "experience":"string",
              "projects":["project1","project2"],
              "skills":["skill1","skill2"]
              }
              Do not include markdown.
              Don not explanations
            `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];
    const aiResponse = await askAi(messages);
    const parsed = JSON.parse(aiResponse);
    await fs.promises.unlink(filePath);

    res.status(200).json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path);
    }
    return res
      .status(500)
      .json({ message: "analyze resume error:", error: err.message });
  }
};

export const genrateQuestions = async (req, res) => {
  try {
    const { role, experience, resumeText, mode, projects, skills } = req.body;
    experience = experience.trim();
    resumeText = resumeText.trim();
    mode = mode.trim();
    if (!role || !experience || !resumeText || !mode) {
      return res.status(400).json({ message: "Enter the details!" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    if (user.credits < 50) {
      return res.status(400).json({ messages: "Add credits to contnue" });
    }
    const projectsText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText.trim() || "None";
    const userPrompt = `
 Role:${role},
 Experience:${experience},
 InterviewMode:${mode},
 Resume:${safeResume},

`;

    if (!userPrompt.trim()) {
      return res.status(400).json({ message: "Promt content is empty." });
    }
    const messages = [
      {
        role: "System",
        content: `
        You are a real human interviewer conducting a professional interview.

        Speak in simple, natural English as if you are directly talking to the candidate.

        Generate exactly 5 interview questions.
        
        Strict Rules:
        -Each questions must contain between 15 and 25 words.
        -Each questions must be a single complete sentence.
        -Do NOT number them.
        -Do NOT add explanation.
        -Do NOT add extra text before or after.
        -One question per line only.
        -Keep language simple and conversational.
        - One question per line only.
        -keep language simple and conversational.
        -Questions must feel practical and realistic.

        Difficulty progressions:
        Question 1 → easy
        Question 2 → medium
        Question 3 → medium
        Question 4 → hard
        Question 5 → hard

        Make questions based on the candidate's role, experience, interview mode, projects, skills and resume details.
        `,
      },
      {
        role: "user",
        conten: userPrompt,
      },
    ];
    const aiResponse = await askAi(messages);
    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response" });
    }
    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.trim())
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res.status(500).json({
        message: "AI failed  to generate questions.",
      });
    }
    user.credtis -= 50;
    await user.save();
    const interview = await interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "medium", "medium", "hard", "hard"][index],
        timeLimit: [60, 90, 90, 120, 120][index],
      })),
    });
    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (err) {
    return res.status(500).json({ message: `failed to generate questions: ${err.message} `});
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, interviewIndex, answer, timeTaken } = req.body;
    const interview = await Interview.findById(interviewIndex);
    const question = interview.questions[interviewIndex];
    // if no answer
    if (!interview || !question) {
      question.score = 0;
      ((question.feedback = "You did not submit an answer"),
        (question.answer = ""));
      await interview.save();
      return res.json({
        feedback: question.feedback,
      });
    }
    // if time exceeded
    if (timeTaken > intverview.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluted.";
      question.answer = answer;

      await interview.save();
      res.status({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "System",
        content: `
        You are a real human interviewer conducting a professional interview.

       Evalute naturally and fairly, like a real person would.
       
       Score the answer in these areas (0 to 10):

       1.Confidence - Does the answer sound clear, confident, and well-presented?
       2. Communication - Is the language simple, clear , and easy to understand?
       3. Corrections - Is the answer accurate, relevant, and complete?

       Rules:
       - Be realistic and unbiased. 
       - Do not give random high scores.
       - If the answer is weak, score low.
       - If the answer is strong and detailed, score high.
       - Consider clarity, structure, and relevance.
        
       Calculate: 
       finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

       Feedback Rules:
       - Write natural human feedback.
      - 10 to 15 words only.
      - Sound like real interview feedback.
      - Can suggest imporevment if needed.
      - Do NOT repeat the question.
      - Keep tone professional and honest.

      Return ONLY valid JSON in this format:
      {
      "confidnce":number,
      "communication":number,
      "correctness":number,
      "finalScore":number,

      }
       `,
      },
      {
        role: "user",
        conten: `
        Question:${question.question}
        Answer:${answer}

        `
      },
    ];

    const aiResponse = await askAi(messages)
    const parsed = JSON.parse(aiResponse)

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({feedback :parsed.feedback})

  } catch (err) {
    return res.status(500).json({ message: `failed to submit answer:${err.message}` });
  }
};


export const finishInterview = async(req,res)=>{
  try{
      const {interviewId} = req.body; 
      const interview = await Interview.findById(interviewId);
      if(!interview){
        return res.status(404).json({message:"Interview not found"});
      }

      let totalQuestions = interview.questions.length;

      let totalScore = 0;
      let totalConfidence = 0;
      let totalCommunication = 0;
      let totalCorrectioness = 0;

      interview.questions.forEach((q)=>{
        totalScore += q.score || 0;
        totalConfidence += q.confidence || 0;
        totalCommunication += q.communication || 0;
        totalCorrectioness += q.correctness || 0;
      });
      
      const finalScore = totalQuestions ? totalScore/totalQuestions:0;
       const avgConfidence = totalQuestions ? totalConfidence/totalQuestions:0;
       const  avgCommunication = totalQuestions ? totalCommunication/totalQuestions:0;
       const  avgCorrectness = totalQuestions ? totalCorrectioness/totalQuestions:0;

            interview.finalScore = finalScore;
            interview.status = "completed";

            await interview .save();
            return res.status(200).json({
              finalScore : Number(finalScore.toFixed(1)),
              confidence:Number(avgConfidence.toFixed(1)),
              communication:Number(avgCommunication.toFixed(1)),
              correctness:Number(avgCorrectness.toFixed(1)),
              questionWiseScore : interview.questions.map((q)=({
                question:q.question,
                score:q.scoe || 0,
                feedback: q.freedback || "",
                confidence:q.confidence || 0,
                communication: q.communcation || 0,
                correctness:q.correctness || 0,
              }))
            })

  }
  catch(err){
    return res.status(500).json({message:`finish interview error ${err.message}`})
  }
}