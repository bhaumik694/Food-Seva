import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx'
import ContactUs from './pages/ContactUs.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DonateForm from './pages/DonateForm.jsx';
import Dashboard from './pages/Dashboard.jsx'
import LiveTracking from './components/LiveTracking.jsx';
import NgoRequest from './pages/NgoRequest.jsx';
import NgoClaim from './pages/NgoClaim.jsx';

const AllRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Donor-upload-Food-Form" element={<DonateForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/maps-testing" element={<LiveTracking />} />
      <Route path="/ngo-request" element={<NgoRequest />} />
      <Route path="/ngo-claim" element={<NgoClaim />} />
    </Routes>
  )
}

export default AllRoutes
