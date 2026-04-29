import React from 'react'
import {BsRobot} from "react-icons/bs"
import { IoSparklesSharp } from "react-icons/io5";
import {motion} from "motion/react";
import { FcGoogle } from "react-icons/fc";
import {GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import { auth } from '../firebase';
function Auth() {
    const googleAuth = async()=>{
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth,provider)
    }
  return (
    <div className='flex w-full min-h-screen bg-[#f3f3f3] items-center
     justify-center px-6 py-20 '>
        <motion.div 
          initial={{opacity:0,y:-60}}
          animate={{opacity:1,y:0}}
          transition={{duration:1}}
        className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl
           border border-gray-200'>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                   <BsRobot size={18}/>
                </div>
                <h2 className='font-semibold text-lg'>Levio.AI</h2>
                </div>
                <h1 className='text-2xl md:text-3xl font-semibold text-center
                 leading-snug mb-4 px-3'>
                    Continue with
                    <span className='bg-green-100 text-green-600 px-3 py-0.5
                     rounded-full inline-flex items-center gap-2'>
                        <IoSparklesSharp size={16} />AI Smart Interview
                     </span>
                 </h1>
                 <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                        Sign in to start AI-powered mock interviews,
                        track your progress,and unlock detailed performance insights.
                 </p>
                 <motion.button
                 whileHover={{opacity:0.9,scale:1.05}}
                 whileTap={{opacity:1,scale:1.0}}
                 className='w-full bg-black flex items-center justify-center gap-3 py-3 rounded-full shadow-md text-white'
                  onClick={googleAuth}
                 >
                    <FcGoogle size={20}/>
                    Continue with Google
                 </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth;