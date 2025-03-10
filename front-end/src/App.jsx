import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ToastContainer } from 'react-toastify';
import BookingForm from './components/BookingForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Booking Form</h1>
        <BookingForm />
        <ToastContainer />
      </div>
    </>
  )
}

export default App
