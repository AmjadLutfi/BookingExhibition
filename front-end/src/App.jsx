import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import {Routes, Route, Router} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import BookingForm from './components/BookingForm';
import HomePage from './components/HomePage';
import ConfirmatioBooking from './components/ConfirmationBooking'
import StatusBooking from './components/StatusBooking'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/booking' element={<BookingForm />}/>
        <Route path='/confirmbooking' element={<ConfirmatioBooking />}/>
        <Route path='/statusbooking' element={<StatusBooking />}/>
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
