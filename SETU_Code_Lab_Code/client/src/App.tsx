import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Login from './loginSignup/login.component'
import SignUp from './loginSignup/signup.component'
import Problems from './solveProblems/problems.component'
import RequireAuth from './requireAuth'

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/problems" element={
        <RequireAuth>
          <Problems />
        </RequireAuth>
        } />
    </Routes>
  )
}
