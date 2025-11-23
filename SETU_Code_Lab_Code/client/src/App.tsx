import { useState } from 'react'
import Problems from './problems'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>SETU Code Lab</h1>
        <Problems />
    </>
  )
}

export default App
