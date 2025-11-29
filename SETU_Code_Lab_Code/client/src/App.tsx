import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Login from './loginSignup/login.component'
import SignUp from './loginSignup/signup.component'
import Problems from './solveProblems/problems.component'

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/problems" element={<Problems />} />
    </Routes>
  )
}
