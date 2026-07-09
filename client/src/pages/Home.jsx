import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsPersonWorkspace,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import AuthModel from "../components/AuthModel";
import { useNavigate } from "react-router-dom";
// import evalImg from "../assets/ai-ans.png";
import hrImg from "../assets/Hr.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";
function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const [userPopUp, setUserPopUp] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 py-1">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="flex items center gap-2  text-gray-700 text-sm px-4 py-2 rounded-full "
            >
              <HiSparkles color="green" size={16} className="bg-green-100" /> Ai
              Powered Smart Interview Platform
            </motion.div>
          </div>
          <div className="text-center mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              // whileInView={{}}
              transition={{ duration: 0.8 }}
              viewport={{once:false,amount:0.8}}
              className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto"
            >
              Practice Interviews with
              <span className="relative inline-block py-3">
                <span className="bg-green-50 text-green-600 px-3 py-2 rounded-full">
                  AI Inteligence
                </span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg"
            >
              Role Based mock interview with smart follow-ups, adaptive
              difficulty adn real-time perormance evalution.
            </motion.p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                //  initial={{opacity:0,y:-30}}
                //  animate={{opactiy:1,y:0}}
                transition={{ duration: 0.98 }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="bg-black text-white px-10 py-4 rounded-full hover:opacity-90 transition shadow-md"
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                  setUserPopUp(true);
                }}
              >
                Start Interview
              </motion.button>
              <motion.button
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="border border-gray-300 text-black px-10 py-4 rounded-full hover:bg-gray-300 transition"
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview-history");

                  setUserPopUp(true);
                }}
              >
                View History
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficultys based on selected job role",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Selection",
                desc: "Dynamic follow-up questions based on your answer",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking",
              },
            ].map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                key={index}
                className={`relative bg-gray-50 rounded-3xl border-2 border-green-100 hover:border-green-500
            p-10 w-80 max-w-[90%] shadow:md hover:shadow-2xl transition-all duration-300
            ${index === 0 ? "rotate-[-4deg]" : ""}
            ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
          ${index === 2 ? "rotate-[-3deg]" : ""}
            `}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-100 border-2 border-green-500 text-green-600 w-16 h-16 rounded-2xl flex justify-center shadow-lg">
                  {item.icon}
                </div>
                <div className="pt-10 text-center ">
                  <div className="text-xs text-green-600 font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-3 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              duration={{ transition: 0.8 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Advanced AI <span className="text-green-600">Capablities</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evalution",
                  desc: "Scores communication, technical accuracy and cnfindence",
                },
                {
                  image: resumeImg,
                  icon: <BsPersonWorkspace size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project-specified questions based on uploade resume.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downlable PDF Report",
                  desc: "Detailded strengths, weakness and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History and Analytics",
                  desc: "Track progress with performance graphs and topics analysis",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 md:flex-row justify-center ">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h2 className="font-semibold mb-3 text-xl">
                        {item.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  {/* </div> */}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              duration={{ transition: 0.8 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Multiple Interview <span className="text-green-600">Modes</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and Communication based evalution.",
                },
                {
                  image: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questions based on selected role.",
                },
                {
                  image: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },
                {
                  image: creditImg,
                  title: "Credit System",
                  desc: "Unlock premium interview sessions.",
                },
              ].map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="w-1/2">
                      <h3 className="font-semibold text-xl mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="w-1/2 flex justify-end">
                      <img src={item.image} alt={item.title}
                      className="w-28 h-28 object-contain"
                      />
                    </div>
                  </div>
                  {/* </div> */}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
       <Footer/>
    </div>
  );
}

export default Home;
