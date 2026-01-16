const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema({
    /*doctor_id: { 
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    patient_id: { 
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },*/
    date: { 
        type: Date,
        required: true
    },
    time: { 
        type: String,
        required: true,
        validate: {
            validator: function (v) {
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
            },
            message: props => `${props.value} is not a valid time (HH:mm)`
        }
    },
    duration: {
        type: Number,
        required: false,
        default: 30,
        validate: {
            validator: d => (d % 30 === 0 && d <= 120),
            message: props => `${props.value} is not a valid duration`
        }
    },
    title: { 
        type: String,
        required: true
    },
    patient: { 
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        required: false
    },
    paid: {
        type: Boolean,
        default: false
    },
    file: {
        data: Buffer,         
        contentType: String  
    }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);