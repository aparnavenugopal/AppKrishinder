const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        index: true,
        required : true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        unique: true,
        required : true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format!!!'
        }     
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength : 3,
        validate : {
            validator : function(value){
                return /[0-9]/.test(value); 
            },
            message : 'password should contain atleast one number'
        }
    },
    age:{
        type:   Number,
        trim: true,
    },
    gender:{
        type: String,
        required: true ,
        set: v => v.trim().toLowerCase(),
        validate : {
            validator : function(value){
                return ['male', 'female','others'].includes(value);
            },
            message: 'gender must be male, female or others'
        }

    },
    cellNumber : {
        type : Number,
        required: true,
        trim: true,
        maxlength : 10,
    },
    about : {
        type : String ,
        default : "Hey there! I am  a fellow developer , lets connect",
    },
    skills : {
        type : [String],
        minlength : 1,
        maxlength: 10,

    },
    photoUrl : {
        type :  String ,
        default :  "https://as1.ftcdn.net/v2/jpg/10/35/96/52/1000_F_1035965234_Ae06GEzXhX03TGY8JO2MNYkcPa8CMrck.jpg"

    }
},{
    timestamps : true
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id }, 'KRISHNA_PUPPY', { expiresIn: '1h' } );
    return token;
}

userSchema.methods.passwordVerification = async function(passwordByUser){
    const user = this;
    const passwordHashed = user.password;

    const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHashed);

    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = User;