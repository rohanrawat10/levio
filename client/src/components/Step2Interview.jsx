import React, { useRef, useState, useEffect } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../utils/config";
import { useNavigate } from "react-router-dom";

function Step2Interview({ interviewData, onFinish }) {
  const navigate = useNavigate();

  // Redux
  const { userData } = useSelector((state) => state.user || {});

  // Interview data
  const {
    interviewId,
    questions = [],
    userName,
    role,
  } = interviewData || {};

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // State
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");

  // Refs
  const videoRef = useRef(null);
  const introStartedRef = useRef(false);
  const mountedRef = useRef(true);

  // Current question
  const currentQuestion = questions[currentIndex];

  

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      SpeechRecognition.stopListening();
      window.speechSynthesis?.cancel();

      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  
  useEffect(() => {
    if (!window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      // Prefer female voices
      const femaleVoice = voices.find((voice) => {
        const name = voice.name.toLowerCase();

        return (
          name.includes("zira") ||
          name.includes("samantha") ||
          name.includes("female")
        );
      });

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Otherwise prefer male voices
      const maleVoice = voices.find((voice) => {
        const name = voice.name.toLowerCase();

        return (
          name.includes("david") ||
          name.includes("mark") ||
          name.includes("male")
        );
      });

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback
      setSelectedVoice(voices[0]);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  
  useEffect(() => {
    if (!selectedVoice) return;
    if (introStartedRef.current) return;
    if (!questions.length) return;

    introStartedRef.current = true;

    startIntro();
  }, [selectedVoice, questions.length]);

  
  const videoSource =
    voiceGender === "male" ? maleVideo : femaleVideo;

  
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (
        !window.speechSynthesis ||
        !selectedVoice ||
        !text
      ) {
        resolve();
        return;
      }

      // Stop previous speech
      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ....")
        .replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(
        humanText
      );

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        if (!mountedRef.current) return;

        setIsAIPlaying(true);

        if (videoRef.current) {
          videoRef.current
            .play()
            .catch(() => {});
        }
      };

      utterance.onend = () => {
        if (!mountedRef.current) {
          resolve();
          return;
        }

        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        setIsAIPlaying(false);

        resolve();
      };

      utterance.onerror = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        if (mountedRef.current) {
          setIsAIPlaying(false);
        }

        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  
  const startIntro = async () => {
    if (!questions.length) return;

    setIsIntroPhase(true);

    const introText = `
      Hello ${userName || userData?.name || "there"}!
      Welcome to your ${role || interviewData?.role || ""} interview on Livio AI.
      I will be your interviewer today.
      We have ${questions.length} questions for you.
      Take a deep breath.
      Stay calm.
      You have got this.
      Let us begin!
    `;

    await speakText(introText);

    if (!mountedRef.current) return;

    setIsIntroPhase(false);

    await speakQuestion(0);
  };

 

  const speakQuestion = async (index) => {
    const question = questions[index];

    if (!question) return;

    // Make sure mic is stopped before AI speaks
    SpeechRecognition.stopListening();
    setIsMicOn(false);

    resetTranscript();
    setAnswer("");

    const questionText = `Question ${
      index + 1
    }. ${question.question}`;

    await speakText(questionText);

    if (!mountedRef.current) return;

    // Start timer
    setTimeLeft(question.timeLimit || 60);

    // Start listening after AI finishes speaking
    startListening();
  };

  
  const startListening = () => {
    if (isAIPlaying || isIntroPhase || isSubmitting) {
      return;
    }

    if (!browserSupportsSpeechRecognition) {
      console.log(
        "Browser does not support speech recognition."
      );
      return;
    }

    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

    setIsMicOn(true);
  };

  
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsMicOn(false);
  };

  

  useEffect(() => {
    if (!listening && isMicOn && !isSubmitting) {
      setIsMicOn(false);
    }
  }, [listening, isMicOn, isSubmitting]);

  

  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  
  useEffect(() => {
    if (isIntroPhase) return;
    if (isAIPlaying) return;
    if (isSubmitting) return;
    if (!currentQuestion) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    timeLeft,
    isIntroPhase,
    isAIPlaying,
    isSubmitting,
    currentQuestion,
  ]);

  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!interviewId) {
      console.log("Interview ID is missing.");
      return;
    }

    setIsSubmitting(true);

    // Stop microphone
    SpeechRecognition.stopListening();
    setIsMicOn(false);

    // Stop AI speech if currently speaking
    window.speechSynthesis?.cancel();

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          interviewIndex: currentIndex,
          answer: answer || "",
          timeTaken:
            (currentQuestion?.timeLimit || 60) -
            timeLeft,
        },
        {
          withCredentials: true,
        }
      );

      if (!mountedRef.current) return;

      setFeedback(data?.feedback || "");

      // AI speaks feedback
      if (data?.feedback) {
        await speakText(
          `Here is my feedback. ${data.feedback}`
        );
      }

      if (!mountedRef.current) return;

      
      if (currentIndex + 1 >= questions.length) {
        await handleFinish();
        return;
      }

      const nextIndex = currentIndex + 1;

      setCurrentIndex(nextIndex);
      setAnswer("");
      setFeedback("");

      
      await speakQuestion(nextIndex);

      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.log(
        "Submit error:",
        err.response?.data || err.message
      );

      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

 const handleFinish = async () => {
  try {
    console.log("handleFinish called ✅")
    SpeechRecognition.stopListening();
    setIsMicOn(false);

    await speakText(
      "Great job! You have completed the interview. Generating your performance report now."
    );

    const { data } = await axios.post(
      `${serverUrl}/api/interview/finish-interview`,
      { interviewId },
      { withCredentials: true }
    );

    console.log("FINISH DATA:", data);

    if (!mountedRef.current) return;

    if (onFinish) {
      onFinish(data); // ✅ this triggers setStep(3)
    }

   

  } catch (err) {
    console.log("Finish error:", err.response?.data || err.message);
    if (mountedRef.current) {
      setIsSubmitting(false);
    }
  }
};

 
  if (!interviewData || !questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Interview data not available
          </h2>

          <p className="text-gray-400 mt-2">
            Please restart the interview.
          </p>
        </div>
      </div>
    );
  }

  

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-red-500 mb-3">
            Speech Recognition Not Supported
          </h2>

          <p className="text-gray-500">
            Your browser does not support speech
            recognition. Please use Google Chrome or another
            supported browser.
          </p>
        </div>
      </div>
    );
  }



  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100
      flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="w-full max-w-7xl min-h-screen bg-white rounded-3xl shadow-2xl
        border border-gray-200 flex flex-col lg:flex-row overflow-hidden relative"
      >
        {/* Intro Overlay */}
        {isIntroPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm
              flex flex-col items-center justify-center z-10 rounded-3xl"
          >
            <div className="text-center px-8">
              <h2 className="text-3xl font-bold text-emerald-600 mb-3">
                Welcome,{" "}
                {userName || userData?.name || "there"}! 👋
              </h2>

              <p className="text-gray-500 text-sm mb-2">
                Your{" "}
                <span className="font-semibold text-gray-700">
                  {role || interviewData?.role}
                </span>{" "}
                interview is about to begin.
              </p>

              <p className="text-gray-400 text-sm mb-6">
                {questions.length} questions · AI powered
                evaluation
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

            <div
              className="w-full bg-white border border-gray-200
              rounded-2xl shadow-md p-6 space-y-5 mt-4"
            >
              {/* Interview Status */}
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
                    : isSubmitting
                    ? "Submitting..."
                    : "Paused"}
                </span>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Timer */}
              <div className="flex justify-center">
                <Timer
                  timeLeft={timeLeft}
                  totalTime={
                    currentQuestion?.timeLimit || 60
                  }
                />
              </div>

              <div className="h-px bg-gray-200" />

              {/* Question Counter */}
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {currentIndex + 1}
                  </p>

                  <p className="text-xs text-gray-400">
                    Current Question
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {questions.length}
                  </p>

                  <p className="text-xs text-gray-400">
                    Total Questions
                  </p>
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

          {/* Question */}
          <div
            className="relative mb-6 bg-gray-50 p-4 sm:p-6
            rounded-2xl border border-gray-200 shadow-sm"
          >
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Question {currentIndex + 1} of{" "}
              {questions.length}
            </p>

            <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
              {currentQuestion?.question}
            </p>
          </div>

          {/* Answer */}
          <textarea
            placeholder="Type your answer here or speak using the mic..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting || isIntroPhase}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl
              resize-none outline-none border border-gray-200
              focus:ring-2 focus:ring-emerald-500 transition
              text-gray-800 disabled:opacity-60"
          />

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-6">
            {/* Mic Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={
                isSubmitting ||
                isIntroPhase ||
                isAIPlaying
              }
              onClick={() => {
                if (isMicOn) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={`w-12 h-12 sm:w-14 sm:h-14
                flex items-center justify-center rounded-full
                shadow-lg text-white disabled:opacity-50
                disabled:cursor-not-allowed
                ${
                  isMicOn
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-black"
                }`}
            >
              {isMicOn ? (
                <FaMicrophone size={20} />
              ) : (
                <FaMicrophoneSlash size={20} />
              )}
            </motion.button>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                isIntroPhase ||
                isAIPlaying
              }
              className="flex-1 bg-gradient-to-r from-emerald-600
                to-teal-500 text-white py-3 sm:py-4 rounded-2xl
                shadow-lg hover:opacity-90 transition font-semibold
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Answer"}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;

