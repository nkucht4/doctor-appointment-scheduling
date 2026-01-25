const Availability = require('../models/AvailabilityModel'); 
const Appointment = require('../models/AppointmentModel'); 

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

  const result = await Appointment.deleteMany({
    doctor_id: doctorId,
    date: { $gte: from, $lte: to }
  });

  return result.deletedCount; 
}

module.exports = {
  adjustOverlappingAvailabilities,
  removeAppointmentsDuringAbsence
};