import React from 'react'
import { useSelector } from 'react-redux'
import {motion} from "motion/react";
function Navbar() {
    const {userData} = useSelector((state)=>state.user)
  return (
    <div className='bg-[] flex justify-center px-4 pt-6'>
        <motion.div 
        initial={{opacity:0,y:-40}}
        animate={{opacity:1,y:0}}
        transition={{duration:1}}
        className='w-full max-w-3xl px-8 py-4 flex justify-between shadow-md border
           border-gray-200 bg-white rounded-[24px] items-center'
          >
        navbar
        </motion.div>
    </div>
  )
}

export default Navbar