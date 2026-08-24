import React from 'react'

function Step2Interview({interviewData,onFinish}) {
  return (
    <div>
      {/* workflow after getting question from ai
      
      Mount 
      ↓
      Load Voice 
      ↓
      Intro Speak
      ↓
      Questions Speak
      ↓
      Mic ON
      ↓
      Timer Running
      ↓
      Submit
      ↓
      Feedback SpeakMount
  → load interviewData (questions, role, userName)
  ↓
Intro Speak (Text to Speech)
  → "Hello [name], welcome to your [role] interview"
  → "I will ask you 5 questions. Take your time."
  ↓
Question Speak (Text to Speech)
  → speaks question[currentIndex]
  ↓
Mic ON (Speech Recognition)
  → user speaks answer
  → transcript shown on screen in real time
  ↓
Timer Running
  → countdown from question.timeLimit (60/90/120 seconds)
  → auto submit when timer hits 0
  ↓
Submit Answer
  → POST /api/interview/submit-answer
  → { interviewId, questionIndex, answer, timeTaken }
  ↓
Feedback Speak (Text to Speech)
  → AI speaks feedback
  → show score on screen
  ↓
Next Question
  → currentIndex + 1
  → repeat from Question Speak
  ↓
Finish (when all questions done)
  → POST /api/interview/finish
  → onFinish(report) → Step3Report */}
    </div>
  )
}

export default Step2Interview