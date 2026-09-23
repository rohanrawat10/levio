import React from 'react'
import { motion } from 'motion/react'

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;

  const color =
    percentage > 60 ? "#10b981" :  // green
    percentage > 30 ? "#f59e0b" :  // yellow
    "#ef4444";                      // red

  return (
    <div className="flex flex-col items-center gap-2 w-full">

      {/* Circle Timer */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        {/* Time text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg font-bold"
            style={{ color }}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress bar below */}
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <motion.div
          className="h-1.5 rounded-full transition-all duration-1000"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>

      <p className="text-xs text-gray-400">Time Remaining</p>
    </div>
  )
}

export default Timer;