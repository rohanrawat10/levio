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
    let { role, experience, resumeText, mode, projects, skills } = req.body;
    experience = experience.trim();
    resumeText = resumeText.trim();
    mode = mode.trim();

    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({
        message: "Resume text is empty. Please upload and analyze your resume first.",
      });
    }

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Enter the details!" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.credits < 1) {
      return res.status(400).json({ message: "Add credits to continue" });
    }

    // ✅ Dynamic question count
    const questionCount = mode === "technical" ? 20 : 5;

    // ✅ Determine candidate level from experience
    const getLevel = (experience) => {
      const exp = experience.toLowerCase();
      if (exp.includes("0") || exp.includes("fresher") || exp.includes("no experience"))
        return "fresher";
      if (exp.includes("1") || exp.includes("2"))
        return "junior";
      if (exp.includes("3") || exp.includes("4") || exp.includes("5"))
        return "mid";
      if (exp.includes("6") || exp.includes("7") || exp.includes("8"))
        return "senior";
      return "junior";
    };

    const level = getLevel(experience);
    console.log("Candidate level:", level);
    console.log("Question count:", questionCount);

    // ✅ Level-based instructions
    const levelInstructions = {
      fresher: `
        Candidate is a FRESHER with no work experience.
        - Ask basic conceptual questions about their skills
        - Focus on fundamentals and personal project work
        - Be encouraging, not intimidating
        - Avoid asking about production experience
        - Ask what they KNOW not what they HAVE DONE professionally
      `,
      junior: `
        Candidate has 1-2 years experience.
        - Mix of conceptual and practical questions
        - Ask about projects and decisions made
        - Ask about debugging and problem-solving approach
        - Avoid very deep system design questions
      `,
      mid: `
        Candidate has 3-5 years experience.
        - Focus on architecture and design decisions
        - Ask about performance optimization
        - Ask about code reviews and best practices
        - Include scenario-based questions
        - Ask about tradeoffs between technologies
      `,
      senior: `
        Candidate has 6+ years experience.
        - Ask about system design and scalability
        - Ask about team leadership and mentoring
        - Ask about handling production incidents
        - Ask about technical debt and refactoring strategies
        - Ask about business impact of technical decisions
      `
    };

    const projectsText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText.trim() || "None";

    const userPrompt = `
      Candidate Role: ${role}
      Experience: ${experience}
      Interview Mode: ${mode}
      Skills and Technologies: ${skillsText}
      Projects: ${projectsText}
      Resume Summary: ${safeResume}
      
      Generate ${questionCount} questions that COVER BOTH skills and projects.
      Do NOT focus only on projects.
    `;

    const messages = [
      {
        role: "system",
        content: `
          You are a real human interviewer conducting a professional interview.
          Speak in simple, natural English as if talking directly to the candidate.

          CANDIDATE LEVEL: ${level.toUpperCase()}
          ${levelInstructions[level]}

          Generate exactly ${questionCount} interview questions.

          ${mode === "technical" ? `
          STRICT DISTRIBUTION — follow exactly:
          - Questions 1-3   → easy    — ask about SKILLS and LANGUAGES they know
          - Questions 4-11   → medium  — ask about TECHNOLOGIES and TOOLS they used
          - Questions 11-16  → hard    — ask about PROJECTS, DECISIONS, CHALLENGES
          - Questions 16-20 → extreme — deep PROBLEM-SOLVING based on their stack

          QUESTION QUALITY RULES:
          - Do NOT ask definition questions like "What is useState?" or "What is MongoDB?"
          - Ask HOW and WHY questions instead:
            ❌ "What is useEffect?"
            ✅ "How do you prevent infinite loops when using useEffect in React?"
          - Ask about REAL scenarios and TRADEOFFS:
            ✅ "Why did you choose MongoDB over SQL for your ${projectsText} project?"
            ✅ "How would you optimize a slow API endpoint in your Node.js app?"
          - Cover BOTH skills and projects equally
          - Do NOT repeat the same topic twice
          ` : `
          HR INTERVIEW RULES:
          - Question 1 → easy   — background and introduction
          - Question 2 → easy   — strengths and what makes them unique
          - Question 3 → medium — teamwork and collaboration experience
          - Question 4 → medium — a challenge they faced and how they handled it
          - Question 5 → hard   — career goals and long-term motivation
          - Keep questions warm, conversational and human
          `}

          FORMAT RULES — strictly follow:
          - Each question must be between 15 and 25 words
          - Each question must be a single complete sentence
          - Do NOT number the questions
          - Do NOT add any explanation or extra text
          - One question per line only
          - Keep language simple and conversational
        `,
      },
      {
        role: "user",
        content: userPrompt,
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
      .slice(0, questionCount); // ✅ dynamic count

    if (questionsArray.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions.",
      });
    }

    // ✅ Dynamic difficulty
    const getDifficulty = (index, mode) => {
      if (mode === "hr") {
        return ["easy", "easy", "medium", "medium", "hard"][index] || "hard";
      }
      if (index < 3) return "easy";
      if (index < 11) return "medium";
      if (index < 16) return "hard";
      return "extreme";
    };

    // ✅ Dynamic time limit
    const getTimeLimit = (index, mode) => {
      if (mode === "hr") return 90;
      if (index < 3) return 60;
      if (index < 7) return 90;
      if (index < 11) return 120;
      return 150;
    };

    user.credits -= 1; // ✅ deduct 1 credit not 50
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: getDifficulty(index, mode),
        timeLimit: getTimeLimit(index, mode),
      })),
    });

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });

  } catch (err) {
    console.log("Generate Questions Error:", err);
    return res.status(500).json({
      message: `Failed to generate questions: ${err.message}`
    });
  }
};
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, interviewIndex, answer, timeTaken } = req.body;
    console.log("1. submitAnswer hit ✅")
    console.log("2. req.body:", req.body)

    // ✅ check interview first
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[interviewIndex];
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // if no answer
    if (!answer || answer.trim() === "") {
      question.score = 0;
      question.feedback = "You did not submit an answer";
      question.answer = "";
      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    // if time exceeded
    if (timeTaken > question.timeLimit) { // ✅ fixed typo + use question.timeLimit
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;
      await interview.save();
      return res.status(200).json({ feedback: question.feedback }); // ✅ fixed
    }

    const messages = [
      {
        role: "system", // ✅ lowercase
        content: `
          You are a real human interviewer conducting a professional interview.
          Evaluate naturally and fairly, like a real person would.

          Score the answer in these areas (0 to 10):
          1. Confidence - Does the answer sound clear, confident, and well-presented?
          2. Communication - Is the language simple, clear, and easy to understand?
          3. Correctness - Is the answer accurate, relevant, and complete?

          Rules:
          - Be realistic and unbiased.
          - Do not give random high scores.
          - If the answer is weak, score low.
          - If the answer is strong and detailed, score high.

          Calculate:
          finalScore = average of confidence, communication, and correctness.

          Feedback Rules:
          - Write natural human feedback.
          - 10 to 15 words only.
          - Sound like real interview feedback.
          - Do NOT repeat the question.
          - Keep tone professional and honest.

          Return ONLY valid JSON:
          {
            "confidence": number,
            "communication": number,
            "correctness": number,
            "finalScore": number,
            "feedback": "string"
          }
        `
      },
      {
        role: "user",
        content: `
          Question: ${question.question}
          Answer: ${answer}
        ` // ✅ fixed typo
      }
    ];

    console.log("3. calling AI ✅")
    const aiResponse = await askAi(messages);
    console.log("4. AI raw response:", aiResponse)

    const cleanResponse = aiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanResponse); // ✅ clean before parsing
    console.log("5. parsed:", parsed)

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;

    await interview.save();

    return res.status(200).json({ feedback: parsed.feedback });

  } catch (err) {
    console.log("submitAnswer Error:", err.message)
    return res.status(500).json({
      message: `Failed to submit answer: ${err.message}`
    });
  }
};
export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    let totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectioness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectioness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;
    const avgCorrectness = totalQuestions
      ? totalCorrectioness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();
    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map(
        (q = {
          question: q.question,
          score: q.scoe || 0,
          feedback: q.freedback || "",
          confidence: q.confidence || 0,
          communication: q.communcation || 0,
          correctness: q.correctness || 0,
        }),
      ),
    });
  } catch (err) {
    console.log("finish interview error:", err);
    return res
      .status(500)
      .json({ message: `finish interview error ${err.message}` });
  }
};
