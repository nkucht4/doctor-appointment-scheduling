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
import DoctorList from './User/DoctorList'
import MainPage from './Views/MainPage'
import AdminPanel from './Admin/AdminPanel'
import DoctorCalendarRoute from './DoctorCalendarRoute'
import DoctorCommentsList from './Comments/DoctorCommentsList'

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
            <Route path="/doctors" element={<DoctorList/>}/>
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}/>}>
            <Route element={<Layout />}>
              <Route path="/" element={<MainPage/>}/>
              <Route element={<DoctorCalendarRoute/>}>
                <Route path="/calendar/doctor/:doctorId" element={<CalendarView />} />
                <Route path="/doctor/:doctorId/reviews" element={<DoctorCommentsList/>}/>
              </Route>
            </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["PATIENT", "ADMIN"]} />}>
            <Route element={<Layout />}>
              <Route path="/consultation_list" element={<ConsultationList/>}/>
              <Route path="/doctors_harmonogram" element={<DoctorList/>}/>
            </Route>
            </Route>


            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<Layout />}>
              <Route path="/admin_panel" element={<AdminPanel />} />
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
