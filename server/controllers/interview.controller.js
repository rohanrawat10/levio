import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.services.js";
export const analyzeResume = async (req, res) => {
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
      const pageText = content.items.map((item) => item.str.join(" "));
      resumeText += pageText + "\n";
    }
     resumeText = resumeText
     .replace(/\s+/g," ")
     .trim();

     const messages = [
        {
            role:"system",
            content:`
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
            `
        },
        {
            role:"user",
            content:resumeText,
        }
     ]
    const aiResponse = await askAi(messages);
    const parsed = await JSON.parse(aiResponse);
   await fs.promises.unlink(filePath);

    res.status(200).json({
        role:parsed.role,
        experience:parsed.experience,
        projects:parsed.experience,
        skills:parsed.skills,
        resumeText,
    })
  } catch (err) {
    if(req.file && fs.existsSync(req.file.path)){
        await fs.promises.unlink(req.file.path);
    }
   return res
      .status(500)
      .json({ message: "analyze resume error:", error: err.message });
  }
};
