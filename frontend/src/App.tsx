import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CalendarView from './Views/CalendarView'
import AppointmentProvider from './Providers/AppointmentProvider'
import AvailabilityProvider from './Providers/AvailabilityProvider'
import ConsultationList from './Consultations/ConsultationList'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Views/Layout'

function App() {
  return (
    <>
    <AppointmentProvider>
      <AvailabilityProvider>
      
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<CalendarView/>}/>
              <Route path="/consultation_list" element={<ConsultationList/>}/>
            </Route>
          </Routes>
        </BrowserRouter>

      </AvailabilityProvider>
    </AppointmentProvider>
    </>
  )
}

export default App
