const mongoose = require("mongoose");

const AbsenceSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    specialization: { 
        type: [String],
        required: true
    }
});

module.exports = mongoose.model("Absence", AbsenceSchema);