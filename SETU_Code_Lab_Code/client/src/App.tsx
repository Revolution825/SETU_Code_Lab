import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Login from './loginSignup/login.component'
import SignUp from './loginSignup/signup.component'
import Problems from './viewProblems/problemList.component'
import RequireAuth from './requireAuth'
import Problem from './solveProblem/problem.component'
import ManageProblems from './viewProblems/manageProblems.component'
import CreateProblem from './createProblem/createProblem.component'

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
      <Route path="/problem" element={
        <RequireAuth>
          <Problem />
        </RequireAuth>
      } />
      <Route path="/manageProblems" element={
        <RequireAuth>
          <ManageProblems />
        </RequireAuth>
      } />
      <Route path="/createProblem" element={
        <RequireAuth>
          <CreateProblem />
        </RequireAuth>
      } />
    </Routes>
  )
}
