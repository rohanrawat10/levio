import React, { useEffect } from 'react'
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Auth from "../pages/Auth";
function AuthModel({onClose}) {
    const {userData} = useSelector((state)=>state.user);
    useEffect(()=>{
        if(userData?.user){
            onClose();
        }
    },[userData]);
  return (
    <div onClick={onClose} className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
            <div className='relative w-full max-w-md' onClick={(e)=>e.stopPropagation()}>
                <button onClick={onClose} className='absolute top-9 right-5 text-gray-800 hover:text-black text-xl cursor-pointer z-10 '>
                    <IoClose size={20}/>
                </button>
            <Auth isModal = {true}/>
            </div>          
    </div>
  )
}

export default AuthModel;   