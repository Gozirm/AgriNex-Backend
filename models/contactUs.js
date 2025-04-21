import mongoose from 'mongoose';
const contactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

export default ContactUs;