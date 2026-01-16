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
import RegisterForm from './User/RegisterForm'
import LoginForm from './User/LoginForm'
import AuthProvider from './Providers/AuthProvider'
import PublicLayout from './Views/PublicLayout'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <>
    <AuthProvider>
    <AppointmentProvider>
      <AvailabilityProvider>
      
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<CalendarView/>}/>
              <Route path="/consultation_list" element={<ConsultationList/>}/>
              <Route path="/register" element={<RegisterForm/>}/>
              <Route path="/login" element={<LoginForm/>}/>
            </Route>
            </Route>
          </Routes>
        </BrowserRouter>

      </AvailabilityProvider>
    </AppointmentProvider>
    </AuthProvider>
    </>
  )
}

export default App
