import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';



function App() {


  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {/* Protected routes */}

        <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>} />
        <Route path="/update-profile" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/delete-account" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
