import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom"
import Register from "../src/pages/Register";
import Login from "../src/pages/Login";
import Chats from "../src/pages/Chats";



export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={ <Register /> }/>
      <Route path='/login' element={ <Login /> }/>
      <Route path='/' element={ <Chats/> }/>
      {/* <Route path='/video-call' element={<Video/>}/> */}
    </Routes>
    </BrowserRouter>
    
  )
}
