import React from 'react'
import { useNavigate } from "react-router-dom"
import { BsRobot } from "react-icons/bs"
import { IoSparklesSharp } from "react-icons/io5"
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from '../utils/firebase'
import { serverUrl } from "../utils/config"
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import toast from 'react-hot-toast'

function Auth({ isModal = false }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const googleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        name: result.user.displayName,
        email: result.user.email,
      }, { withCredentials: true })
      console.log("FULL LOGIN RESPONSE:", data);
console.log("USER FROM API:", data.user);

dispatch(setUserData(data.user));
    navigate("/")
    toast.success("Logged In")
       
      // if(isModal && onClose){
      //   onClose();
      // }
      // else{
      //   navigate("/")
      // }
    } catch (err) {
      console.log(err.message)
      dispatch(setUserData(null))
      toast.error("Something went wrong!")
    }
  }

  return (
    <div
      className="relative flex w-full min-h-[100vh] items-center justify-center px-4 sm:px-6 lg:px-8 sm:py-16 overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient background blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(99,153,34,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(29,158,117,0.06) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm sm:max-w-md rounded-3xl border border-gray-200 bg-white px-8 py-10 shadow-sm"
      >
        {/* Subtle dot pattern accent */}
        <svg
          className="pointer-events-none absolute -top-3 -right-3 w-20 h-20 opacity-[0.06]"
          viewBox="0 0 80 80"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="80" height="80" fill="url(#dots)" />
        </svg>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="flex items-center justify-center gap-2.5 mb-8"
        >
          <div className="flex items-center justify-center w-8 h-8 sm:h-9 rounded-[9px] bg-black text-white">
            <BsRobot size={16} />
          </div>
          <span
            className="text-base sm:text-[18px] text-gray-900 tracking-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Levio.AI
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          className="text-2xl sm:text-[26px] md:text-3xl leading-tight tracking-tight text-center text-gray-900 mb-3"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Ace your next interview
          <br />
          with{" "}
          <em className="not-italic" style={{ color: "#1D9E75" }}>
            AI precision
          </em>
        </h1>

        {/* Subtext */}
        <p
          className="text-sm sm:text-sm text-gray-500 text-center leading-relaxed font-light mb-8 sm:mb-8"
        >
          Sign in to unlock{" "}
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[13px] font-medium px-2.5 py-0.5 rounded-full align-middle">
            <IoSparklesSharp size={12} />
            smart mock interviews
          </span>
          , track your growth, and unlock detailed performance insights.
        </p>

        {/* Divider */}
        <div
          className="flex items-center gap-2.5 mb-6"
        >
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 whitespace-nowrap">continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          whileHover={{ scale: 1.025, backgroundColor: "#2e2e2e" }}
          whileTap={{ scale: 0.99, y: -2 }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-black text-white text-[15px] tracking-[0.1px] transition-colors cursor-pointer"
          onClick={googleAuth}
        >
          <FcGoogle size={18} />
          Continue with Google
        </motion.button>

        {/* Footnote */}
        <p
          className="mt-5 text-center text-[12px] text-gray-400 leading-relaxed"
        >
          By continuing, you agree to our Terms of Service
          <br />
          and acknowledge our Privacy Policy.
        </p>
      </motion.div>
    </div>
  )
}

export default Auth