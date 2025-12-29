const mongoose = require("mongoose");


const AvailabilitySchema = new mongoose.Schema({
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
    },
    times: {
        type: [{from: String, to: String}],
        required: true
    },
    day_mask: { 
        type: [Number],
        required: false,
        default: []
    }
});

module.exports = mongoose.model("Availability", AvailabilitySchema);