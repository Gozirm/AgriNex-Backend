import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const signInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
}, { timestamps: true });


const SignIn = mongoose.model('SignIn', signInSchema);

export default SignIn;