import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './assets/Home';
import Auth from './assets/Auth';

function App() {
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