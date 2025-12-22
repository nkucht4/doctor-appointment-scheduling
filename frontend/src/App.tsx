import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeeklyCalendar from './Calendar/WeeklyCalendar'

function App() {
  return (
    <>
      <WeeklyCalendar initialDate={new Date()}/>
    </>
  )
}

export default App
