import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllRoutes from './Routes';
import ChatAI from './components/ChatBot';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router >
      <div className="flex flex-col overflow-x-hidden">
        <Navbar />

        <div className="flex-1 overflow-auto pt-[64px] bg-[#eeecdd]">  
          <AllRoutes />
        </div>

        {/* <ChatAI /> */}
        <Footer/>
      </div>
    </Router>
  )
}

export default App