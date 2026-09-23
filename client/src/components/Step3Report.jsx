import React from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { FaChartLine, FaMicrophone, FaBrain, FaStar } from 'react-icons/fa'
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from 'react-spinners';
import { serverUrl } from '../utils/config';
import { useState } from 'react';
function Step3Report({ interviewData,originalSetup, onRetake }) {
  const navigate = useNavigate();
    // console.log(interviewData)
    const [retaking,setRetaking] = useState(false)
  console.log("interviewData:", interviewData) // 👈 add this
  console.log("finalScore:", interviewData?.finalScore)
  console.log("questionWiseScore:", interviewData?.questionWiseScore)
  const {
    finalScore,
    confidence,
    communication,
    correctness,
    questionWiseScore = []
  } = interviewData || {};

  // score color
  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  // progress bar color
  const getBarColor = (score) => {
    if (score >= 8) return "bg-emerald-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // score label
  const getScoreLabel = (score) => {
    if (score >= 9) return "Excellent 🌟";
    if (score >= 7) return "Good 👍";
    if (score >= 5) return "Average 📈";
    return "Needs Work 💪";
  };
    

  const handleRetake = async()=>{
            console.log("1. handleRetake called ");
            console.log("2. original setup:",originalSetup)
            console.log("3. orignialSetup?.role:",originalSetup?.role);
            console.log("4. originalSetup?.resumeText length:",originalSetup?.resumeText?.length)
    if(!originalSetup){
      toast.error("original setup data missing. please start a new interview.");
      return;
    }
    if(!originalSetup.role){
      toast.error("Role missing from setup");
      return;
    }
    if(!originalSetup.resumeText){
      toast.error("Resume data missing. please start a new interveiw.");
      return;
    }
    try{
setRetaking(true);

const response = await axios.post(`${serverUrl}/api/interview/generate-questions`,{
  role:originalSetup.role,
  experience:originalSetup.experience,
  resumeText:originalSetup.resumeText,
  mode:originalSetup.resumeText,
  projects:originalSetup.projects,
  skills:originalSetup.skills
},{withCredentials:true}
);

//update interview data with new questions
toast.sucess("New interview ready!")
onRetake(response.data);

    }
    catch(err){
      console.log("Retake Error:",err.message);
      toast.error("Failed to reatke interview");

    }
    finally{
      setRetaking(false);
    }

  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white 
      to-teal-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Interview Complete! 🎉
          </h1>
          <p className="text-gray-500 mb-6">
            Here's your detailed performance report
          </p>

          {/* Overall Score */}
          <div className="inline-flex flex-col items-center justify-center 
            w-36 h-36 rounded-full border-4 border-emerald-500 mb-4">
            <span className={`text-4xl font-bold ${getScoreColor(finalScore)}`}>
              {finalScore}
            </span>
            <span className="text-xs text-gray-400">out of 10</span>
          </div>

          <p className={`text-xl font-semibold ${getScoreColor(finalScore)}`}>
            {getScoreLabel(finalScore)}
          </p>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-emerald-500" />
            Performance Breakdown
          </h2>

          <div className="space-y-5">
            {[
              { label: "Confidence", score: confidence, icon: <FaStar /> },
              { label: "Communication", score: communication, icon: <FaMicrophone /> },
              { label: "Correctness", score: correctness, icon: <FaBrain /> },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="flex items-center gap-2 text-sm 
                    font-medium text-gray-700">
                    {item.icon} {item.label}
                  </span>
                  <span className={`font-bold ${getScoreColor(item.score)}`}>
                    {item.score} / 10
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score * 10}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-2.5 rounded-full ${getBarColor(item.score)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Question Wise Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Question by Question 📋
          </h2>

          <div className="space-y-4">
            {questionWiseScore.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-100 rounded-2xl p-5 
                  hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-800 flex-1 pr-4">
                    Q{index + 1}. {q.question}
                  </p>
                  <span className={`text-lg font-bold shrink-0 
                    ${getScoreColor(q.score)}`}>
                    {q.score}/10
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  💬 {q.feedback}
                </p>

                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Confidence: <strong>{q.confidence}</strong></span>
                  <span>Communication: <strong>{q.communication}</strong></span>
                  <span>Correctness: <strong>{q.correctness}</strong></span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 pb-10"
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-2xl border border-gray-200 
              text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            🏠 Go Home
          </button>
          <button
            onClick={handleRetake}
            disabled={retaking}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r 
              from-emerald-600 to-teal-500 text-white font-semibold 
              hover:opacity-90 transition shadow-lg"
          >
           {
            retaking ?
            <ClipLoader size={20} color="#fff"/>
            : " 🔄 Retake Interview"
           }
          </button>
        </motion.div>

      </div>
    </div>
  );
}

export default Step3Report;