const Availability = require('../models/AvailabilityModel'); 
const Appointment = require('../models/AppointmentModel'); 
const notificationService = require('../services/notificationService')

async function adjustOverlappingAvailabilities(doctor_id, newDateFrom, newDateTo) {
  const overlaps = await Availability.find({
    doctor_id,
    $or: [
      { date_from: { $lte: newDateTo }, date_to: { $gte: newDateFrom } }
    ]
  });

  for (const avail of overlaps) {
    const oldFrom = avail.date_from;
    const oldTo = avail.date_to;

    if (newDateFrom <= oldFrom && newDateTo >= oldTo) {
      await Availability.deleteOne({ _id: avail._id });
      continue;
    }

    if (oldFrom < newDateFrom && oldTo >= newDateFrom && oldTo <= newDateTo) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      avail.date_to = new Date(newDateFrom.getTime() - oneDayMs);
      await avail.save();
      continue;
    }

    if (oldFrom >= newDateFrom && oldFrom <= newDateTo && oldTo > newDateTo) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      avail.date_from = new Date(newDateTo.getTime() + oneDayMs);
      await avail.save();
      continue;
    }

    if (oldFrom < newDateFrom && oldTo > newDateTo) {
      const oneDayMs = 24 * 60 * 60 * 1000;
      const before = new Availability({
        doctor_id,
        date_from: oldFrom,
        date_to: new Date(newDateFrom.getTime() - oneDayMs),
        times: avail.times,
        day_mask: avail.day_mask,
      });

      avail.date_from = new Date(newDateTo.getTime() + oneDayMs);
      await avail.save();

      await before.save();
      continue;
    }
  }
}

async function removeAppointmentsDuringAbsence(doctorId, dateFrom, dateTo) {
  const from = new Date(dateFrom);
  const to = new Date(dateTo);

  const appointmentsToRemove = await Appointment.find({
    doctor_id: doctorId,
    date: { $gte: from, $lte: to }
  });

  const result = await Appointment.deleteMany({
    doctor_id: doctorId,
    date: { $gte: from, $lte: to }
  });

  console.log(appointmentsToRemove);

  for (const appointment of appointmentsToRemove) {
    const notification = {
      userId: appointment.patient_id,
      message: `Twoja wizyta u lekarza została odwołana: ${appointment.date.toLocaleString()}`,
      date: new Date(),
    };

    try {
      const savedNotification = await notificationService.createNotification(notification);
      notificationService.broadcastNotification(savedNotification);
    } catch (err) {
      console.error("Błąd podczas tworzenia lub wysyłania powiadomienia:", err);
    }
  }

  return result.deletedCount; 
}

module.exports = {
  adjustOverlappingAvailabilities,
  removeAppointmentsDuringAbsence
};