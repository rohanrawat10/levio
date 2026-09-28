import React, { useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Auth from "./pages/Auth"
import axios from 'axios';
import {useDispatch} from "react-redux";
import { serverUrl } from './utils/config';
import { setUserData } from './redux/userSlice';
import InterviewPage from './pages/InterviewPage';
import HistoryPage from './pages/HistoryPage';
import Step3Report from './components/Step3Report';
import PricingPage from './pages/PricingPage';
function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
        const getUser = async()=>{
          try{
          const result = await axios.get(`${serverUrl}/api/user/get-user`,{
            withCredentials:true
          })
          console.log("result data app.jsx",result.data)
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
      <Route path='/interview' element={<InterviewPage/>}/>
      <Route path="/report/:id" element={<Step3Report/>}/>
       <Route path='/interview-history' element={<HistoryPage/>} />
       <Route path='/top-up'  element={<PricingPage/>}/>
       
    </Routes>
    </BrowserRouter>
  )
}

export default App;