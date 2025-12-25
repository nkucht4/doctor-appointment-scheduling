import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeeklyCalendar from './Calendar/WeeklyCalendar'
import AvailabilityForm from './Availability/AvailabilityForm'
import AbsenceForm from './Availability/AbsenceForm'
import ConsultationForm from './Consultations/ConsultationForm'
import AppointmentProvider from './Providers/AppointmentProvider'

function App() {
  return (
    <>
    <AppointmentProvider>
      {<WeeklyCalendar initialDate={new Date()}/>}
      {/*<AvailabilityForm />*/}
      {/*<AbsenceForm/>*/}
    </AppointmentProvider>
    </>
  )
}

export default App
