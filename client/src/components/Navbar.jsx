import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {motion} from "motion/react";
import { BsRobot } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { IoIosLogOut, IoMdAddCircleOutline } from "react-icons/io";
import { serverUrl } from '../utils/config';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
// import { IoIosLogOut } from "react-icons/io";
function Navbar() {
    const {userData} = useSelector((state)=>state.user);
    const navigate = useNavigate();
    const [userPopUp,setUserPopUp] = useState(false);
    const [creditPopUp,setCreditPopUp] = useState(false);
    const dispatch = useDispatch();
    const userRef = useRef(null);
    const creditRef = useRef(null);
    const [showAuth,setShowAuth] = useState(false);
    console.log("user from store:",userData)
    const firstLetter = userData?.user?.name?.charAt(0).toUpperCase();
        //  console.log(firstLetter)
           console.log("userdata"+ userData)
         const handleLogOut = async()=>{
          try{
             const result = await axios.get(`${serverUrl}/api/auth/signOut`,{withCredentials:true})
                 dispatch(setUserData(null))
                //  navigate("/auth")
            }
          catch(err){
            console.log("Handle logout Error:",err.message)
          }
         }

         useEffect(()=>{
          const handleClickOutSide = (e)=>{
                if(userRef.current && !userRef.current.contains(e.target)){
                  setUserPopUp(false)

                }
                if(creditRef.current && !creditRef.current.contains(e.target)){
                  setCreditPopUp(false)
                }
          }
          document.addEventListener("mousedown",handleClickOutSide);
          return()=>{
            document.removeEventListener("mousedown",handleClickOutSide)
          }
         },[])
    return (
    <div className='bg-[] flex justify-center px-4 pt-6'>
        <motion.div 
        initial={{opacity:0,y:-40}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.8}}
        className='w-full max-w-3xl px-8 py-4 flex justify-between shadow-md border
           border-gray-200 bg-white rounded-3xl items-center'
          >
           <div className='flex items-center  gap-3 cursor-pointer' onClick={()=>navigate("/")}>
              <div className='bg-black text-white p-2 rounded-lg'>
               <BsRobot size={16} />
              </div>
              <h1 className='text-lg font-semibold' >Livio.Ai</h1>
           </div>
           <div className='flex items-center gap-5 relative'>
            <div className='relative' ref={creditRef}>
              <button className='flex items-center gap-2 px-4 py-2 text-md rounded-full bg-gray-100 
                    font-semibold hover:bg-gray-200 transition-all duration-200 cursor-pointer
              '
              onClick={()=>{
                if(!userData){
                       setShowAuth(true)
                       return
                  }
                setCreditPopUp(!creditPopUp)}}
              >
                <FaCoins size={18}/>
            {userData?.user?.credit || 0}
              </button>
              {
                creditPopUp && (
                  <motion.div 
                  initial={{opacity:0,y:-40}}
                  animate={{opacity:1,y:0}}
                  transition={{duration:0.5}}
                   className=' absolute top-[75px] right-[-60px] bg-white shadow-xl rounded-xl p-3 w-64 items-center
                          
                   '>
                       <p className='font-semibold text-gray-800 mb-4'>Fuel your journey with Credits</p>
                                    <button onClick={()=>navigate("/payment")} className='w-full bg-[#023020] text-white py-2 rounded-lg text-sm hover:-translate-y-0.5 active:translate-y-0.5'>Add Credit</button>
           
                    </motion.div>
                )
              }
            </div>
             <div className='relative' ref={userRef}>
              <button className='flex items-center justify-center w-10 h-10 text-md rounded-full bg-black 
                    font-semibold text-white  cursor-pointer
              ' onClick={()=>{
                  if(!userData){
                       setShowAuth(true)
                       return
                  }
              setUserPopUp(!userPopUp)}}>
                 {firstLetter || <FaUserAstronaut size={18} />}
              </button>
              {
                userPopUp && (
                  <motion.div
                    initial={{opacity:0,y:-40}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.5}}
                  className='  absolute top-[75px] right-[-40px] bg-white shadow-xl rounded-xl p-3 w-64 items-center shadow-3xl'>
                   <h1 className='text-lg font-semibold text-blue-500'>
                    {userData?.user?.name}
                   </h1>
                   <button className='w-full text-left text-md py-1 hover:text-black text-gray-900 cursor-pointer'>Interviews</button>
                   <button onClick={handleLogOut}className='flex text-sm font-semibold cursor-pointer text-red-500  rounded-lg py-0.5 px-2 mt-5'>
                   <IoIosLogOut size={15} /> Log out
                   </button>
                  </motion.div>
                )
              }
            </div>
           </div>
        </motion.div>
        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
    </div>
  )
}

export default Navbar