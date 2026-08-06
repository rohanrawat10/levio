import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../utils/config";

function Step1SetUp({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    console.log("handle Resume is being Called")
    if (!resumeFile || analyzing){
      console.log("2 returned ")
      return;
    };
    setAnalyzing(true);
    setLoading(true);
      console.log("passed validation 3")
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `${serverUrl}/api/resume/resume`,
        formData,
        {
          withCredentials: true,
        },
      );
      console.log("Resume Data" + response.data);
      setRole(response.data.role || "");
      setExperience(response.data.experience || "");
      setProjects(response.data.projects || []);
      setSkills(response.data.skills || []);
      setResumeText(response.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
      setLoading(false);
      console.log("Toast should appear");

       toast.success("Resume Analyzed! ✅");
    } catch (err) {
      console.log("Handle Upload resume error:", err.message);
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-100 to-green-50 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI. Improve
            communication, technical skills, and confidence.
          </p>
          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                text: "Start Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="p-2 bg-green-50 rounded-lg">{item.icon}</div>
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Configure your Interview
          </h2>
          <div className="space-y-6">
            {/* Role */}
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter role (e.g React Developer)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            {/* Experience */}
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Experience (e.g 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/* Mode */}
            <select
              value={mode}
              className="w-full py-3 px-4 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all text-gray-600"
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="">Select Interview Type</option>
              <option value="technical">Technical Interview</option>
              <option value="hr">HR Interview</option>
            </select>

            {/* Resume Upload */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                onClick={() => document.getElementById("resumeUpload").click()}
              >
                <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-gray-600 font-medium">
                  {resumeFile ? resumeFile.name : "Click to upload resume"}
                </p>
                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    disabled={analyzing || analysisDone}
                    className={`mt-4 px-5 py-2 rounded-lg transition-all text-white
    ${
      analysisDone
        ? "bg-green-600 cursor-not-allowed" // ✅ green when done
        : "bg-gray-900 hover:bg-gray-800 cursor-pointer" // normal
    }
  `}
                  >
                    {analyzing
                      ? <ClipLoader size={20} color="#fff" />:analysisDone?"Analysed"
                        : "Analyse Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              disabled={!role || !experience || !mode}
              onClick={() =>
                onStart({
                  role,
                  experience,
                  mode,
                  resumeText,
                  skills,
                  projects,
                })
              }
              className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600
                hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold
                transition duration-200 shadow-md"
            >
              {/* {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : ( */}
                {/* "Start Interview" */}
              {/* )} */}
              Start Interview
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Step1SetUp;
