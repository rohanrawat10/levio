import React, { useRef, useState, useEffect } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
// Step2Interview.jsx — add axios import at top
import axios from "axios";
import { serverUrl } from "../utils/config";
import {  useNavigate } from "react-router-dom";
function Step2Interview({ interviewData, onFinish }) {
  const { userData } = useSelector((state) => state.user);
  const { interviewId, questions, userName } = interviewData;
  const navigate = useNavigate();
  const {transcript,listening,resetTranscript,browserSupportsSpeechRecognition} = useSpeechRecognition();
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  // ✅ Step 1 — Load voices on mount
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // ✅ Step 2 — Start intro when voice is ready
  useEffect(() => {
    if (selectedVoice) {
      startIntro();
    }
  }, [selectedVoice]);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // ✅ Text to Speech
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ....")
        .replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        resolve();
      };

      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  // ✅ Intro before interview starts
  const startIntro = async () => {
    setIsIntroPhase(true);

    const introText = `
      Hello ${userName}! Welcome to your ${interviewData.role} interview on Livio AI.
      I will be your interviewer today.
      We have ${questions.length} questions for you.
      Take a deep breath. Stay calm. You have got this.
      Let us begin!
    `;

    await speakText(introText);
    setIsIntroPhase(false);
    await speakQuestion(0); // speak first question
  };

  // ✅ Speak question by index
 const speakQuestion = async (index) => {
  const question = questions[index];
  if (!question) return;
  const questionText = `Question ${index + 1}. ${question.question}`;
  await speakText(questionText);
  resetTranscript();              // ✅ clear previous answer
  startListening();               // ✅ actually starts mic
  setTimeLeft(question.timeLimit || 60);

     
 }


const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  setIsMicOn(false);
  window.speechSynthesis.cancel();

  try {
    const { data } = await axios.post(
      `${serverUrl}/api/interview/submit-answer`,
      {
        interviewId,
        interviewIndex: currentIndex,
        answer: answer || "",
        timeTaken: (currentQuestion?.timeLimit || 60) - timeLeft,
      },
      { withCredentials: true }
    );

    setFeedback(data.feedback);

    // AI speaks feedback
    await speakText(`Here is my feedback. ${data.feedback}`);

    // move to next question or finish
    if (currentIndex + 1 >= questions.length) {
      await handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setFeedback("");
      setIsSubmitting(false);
      await speakQuestion(currentIndex + 1);
    }

  } catch (err) {
    console.log("Submit error:", err.message);
    setIsSubmitting(false);
  }
};
 

const handleFinish = async () => {
  try {
    await speakText("Great job! You have completed the interview. Generating your performance report now.");

    const { data } = await axios.post(
      `${serverUrl}/api/interview/finish`,
      { interviewId },
      { withCredentials: true }
    );

    onFinish(data); // → moves to Step3Report

        navigate("/report")
    

  } catch (err) {
    console.log("Finish error:", err.message);
  }
};
  
useEffect(()=>{
  if(transcript){
    setAnswer(transcript);
  }
},[transcript])

const startListening = ()=>{
  resetTranscript();
  SpeechRecognition.startListening({continuous:true});
  setIsMicOn(true);
}

const stopListening = ()=>{
  SpeechRecognition.stopListening();
  setIsMicOn(false);
}

useEffect(() => {
  // don't run during intro, AI speaking, or mic off
  if (isIntroPhase || isAIPlaying ) return;

  // auto submit when time runs out
  if (timeLeft <= 0) {
    handleSubmit();
    return;
  }

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  // cleanup on unmount or dependency change
  return () => clearInterval(interval);

}, [timeLeft, isIntroPhase, isAIPlaying]);

     
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100
      flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="w-full max-w-7xl min-h-screen bg-white rounded-3xl shadow-2xl
        border border-gray-200 flex flex-col lg:flex-row overflow-hidden relative"
      >

        {/* ✅ Intro Overlay */}
        {isIntroPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm
              flex flex-col items-center justify-center z-10 rounded-3xl"
          >
            <div className="text-center px-8">
              <h2 className="text-3xl font-bold text-emerald-600 mb-3">
                Welcome, {userName}! 👋
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Your <span className="font-semibold text-gray-700">
                  {interviewData?.role}
                </span> interview is about to begin.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {questions.length} questions · AI powered evaluation
              </p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
              </div>
              <p className="text-xs text-gray-400">
                AI is preparing your interview...
              </p>
            </div>
          </motion.div>
        )}

        {/* Video Section */}
        <div
          className="w-full lg:w-[35%] bg-white flex flex-col items-center
          p-6 border-r border-gray-200"
        >
          <div className="w-full max-w-md rounded-2xl overflow-hidden">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />

            <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500">
                  Interview Status:
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  {isIntroPhase
                    ? "Preparing..."
                    : isAIPlaying
                    ? "AI Speaking"
                    : isMicOn
                    ? "Listening..."
                    : "Paused"}
                </span>
              </div>

              <div className="h-px bg-gray-200" />

              <div className="flex justify-center">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={currentQuestion?.timeLimit || 60}
                />
              </div>

              <div className="h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {currentIndex + 1}
                  </p>
                  <p className="text-xs text-gray-400">Current Question</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {questions.length}
                  </p>
                  <p className="text-xs text-gray-400">Total Questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          <div
            className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl
            border border-gray-200 shadow-sm"
          >
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQuestion?.question}
            </p>
          </div>

          <textarea
            placeholder="Type your answer here or speak using the mic..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none
              border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800"
          />

          <div className="flex items-center gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>{ if(isMicOn){
                stopListening();
              }else{
                startLitening()
              }
            }}
              className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center
                rounded-full shadow-lg text-white
                ${isMicOn ? "bg-emerald-500 animate-pulse" : "bg-black"}`}
            >
              {isMicOn ? (
                <FaMicrophone size={20} />
              ) : (
                <FaMicrophoneSlash size={20} />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting || isIntroPhase}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500
                text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90
                transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;