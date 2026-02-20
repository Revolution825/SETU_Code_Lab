import { Routes, Route } from 'react-router-dom'
import './App.scss'
import Login from './loginSignup/login.component'
import SignUp from './loginSignup/signup.component'
import Problems from './viewProblems/problemList.component'
import RequireAuth from './requireAuth'
import Problem from './solveProblem/problem.component'
import ManageProblems from './viewProblems/manageProblems.component'
import CreateProblem from './createProblem/createProblem.component'
import { Toaster } from "react-hot-toast";
import ManageClasses from './createClass/manageClasses.component'
import CreateClass from './createClass/createClasses.component'
import ViewResults from './viewResults/viewResults.component'
import ViewResult from './viewResults/viewResult.component'
import ViewProfile from './viewProfile/viewProfile.component'

export default function App() {

  return (
    <><Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#363636",
          color: "#fff",
        },
      }} /><Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/problems" element={<RequireAuth>
          <Problems />
        </RequireAuth>} />
        <Route path="/problem" element={<RequireAuth>
          <Problem />
        </RequireAuth>} />
        <Route path="/manageProblems" element={<RequireAuth>
          <ManageProblems />
        </RequireAuth>} />
        <Route path="/createProblem" element={<RequireAuth>
          <CreateProblem />
        </RequireAuth>} />
        <Route path="/manageClasses" element={<RequireAuth>
          <ManageClasses />
        </RequireAuth>} />
        <Route path="/createClass" element={<RequireAuth>
          <CreateClass />
        </RequireAuth>} />
        <Route path="/viewResults" element={<RequireAuth>
          <ViewResults />
        </RequireAuth>} />
        <Route path="/viewResult" element={<RequireAuth>
          <ViewResult />
        </RequireAuth>} />
        <Route path="/profile" element={<RequireAuth>
          <ViewProfile />
        </RequireAuth>} />
      </Routes></>
  )
}
