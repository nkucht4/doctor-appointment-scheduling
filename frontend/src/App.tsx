import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeeklyCalendar from './Calendar/WeeklyCalendar'
import AvailabilityForm from './Availability/AvailabilityForm'
import AbsenceForm from './Availability/AbsenceForm'
import ConsultationForm from './Consultations/ConsultationForm'
import AppointmentProvider from './Providers/AppointmentProvider'
import AvailabilityProvider from './Providers/AvailabilityProvider'
import ConsultationList from './Consultations/ConsultationList'

function App() {
  return (
    <>
    <AppointmentProvider>
      <AvailabilityProvider>
      {<WeeklyCalendar initialDate={new Date()}/>}
      {/*<ConsultationList/>*/}
      {/*<AvailabilityForm />*/}
      {/*<AbsenceForm/>*/}
      </AvailabilityProvider>
    </AppointmentProvider>
    </>
  )
}

export default App
