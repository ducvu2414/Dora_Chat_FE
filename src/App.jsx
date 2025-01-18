import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import LoginPage from "./page/LoginPage"
import SignUpPage from "./page/SignUpStep1Page"
import HomePage from "./page/HomePage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App