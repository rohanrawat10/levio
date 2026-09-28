import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import {
  FaBriefcase,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { serverUrl } from "../utils/config";

function HistoryPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/interview/interview-history`,
        {
          withCredentials: true,
        }
      );

      setInterviews(data.interviews || []);
    } catch (err) {
      console.log("History error:", err.message);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 8) return "bg-emerald-50 border-emerald-200";
    if (score >= 6) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent 🌟";
    if (score >= 7) return "Good 👍";
    if (score >= 5) return "Average 📈";
    return "Need Work 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Interview History
          </h1>

          <p className="text-gray-500">
            Track your progress across all past interviews
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading interview history...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">📭</p>

            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Interviews Yet
            </h2>

            <p className="text-gray-400 mb-6">
              Start your interview to see your history here
            </p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{
                scale: 1.025,
                backgroundColor: "#059669",
              }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/interview")}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg"
            >
              Start Interview
            </motion.button>
          </motion.div>
        )}

        {/* Interview Cards */}
        {!loading && interviews.length > 0 && (
          <div className="space-y-4">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() =>
                  navigate(`/report/${interview._id}`)
                }
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start">

                  {/* Left */}
                  <div className="flex-1">

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                          interview.mode === "technical"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-purple-50 text-purple-600 border-purple-200"
                        }`}
                      >
                        {interview.mode === "technical"
                          ? "Technical"
                          : "HR"}
                      </span>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${getScoreBg(
                          interview.finalScore
                        )}`}
                      >
                        {getScoreLabel(interview.finalScore)}
                      </span>

                    </div>

                    {/* Role */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {interview.role}
                    </h3>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">

                      <span className="flex items-center gap-1">
                        <FaBriefcase size={12} />
                        {interview.experience}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaClock size={12} />

                        {new Date(
                          interview.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span className="flex items-center gap-1">
                        <FaChartLine size={12} />
                        {interview.questions?.length || 0} questions
                      </span>

                    </div>
                  </div>

                  {/* Right — Score */}
                  <div className="flex flex-col items-center ml-4">

                    <span
                      className={`text-3xl font-bold ${getScoreColor(
                        interview.finalScore
                      )}`}
                    >
                      {interview.finalScore}
                    </span>

                    <span className="text-xs text-gray-400">
                      / 10
                    </span>

                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default HistoryPage;

