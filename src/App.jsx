import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import LoginPage from "./page/LoginPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<div>Signup Page</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
      </Routes>
    </Router>
  )
}

export default App