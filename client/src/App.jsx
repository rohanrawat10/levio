import React, { useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth"
import axios from 'axios';
import {useDispatch} from "react-redux";
import { serverUrl } from './utils/config';
import { setUserData } from './redux/userSlice';

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
        const getUser = async()=>{
          try{
          const result = await axios.get(`${serverUrl}/api/user/get-user`,{
            withCredentials:true
          })
          dispatch(setUserData(result.data));
        }
          catch(err){
              console.log("get user error:",err.message);
              dispatch(setUserData(null));
      }
      }
      getUser();

  },[])
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;