const mongoose = require("mongoose");

const AbsenceSchema = new mongoose.Schema({
    doctor_id: { 
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    date_from: { 
        type: Date,
        required: true
    },
    date_to: { 
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Absence", AbsenceSchema);