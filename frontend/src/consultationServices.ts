const APPOINTMENTS_URL = "http://localhost:3000/appointments";
const AVAILABILITY_URL = "http://localhost:3000/availability";
const ABSENCES_URL = "http://localhost:3000/absences";

export async function getAppointments() {
  const res = await fetch(APPOINTMENTS_URL);
  if (!res.ok) throw new Error("Failed to load appointments");
  return res.json();
}

export async function getAvailability() {
  const res = await fetch(AVAILABILITY_URL);
  if (!res.ok) throw new Error("Failed to load availability");
  return res.json();
}

export async function saveAvailability(payload) {
  return fetch(AVAILABILITY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function saveAbsence(payload) {
  return fetch(ABSENCES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function saveAppointment(payload) {
  return fetch(APPOINTMENTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}


