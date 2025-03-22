const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
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
        validate : {
            validator : function(value){
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message : 'Invalid email format!!!'
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
        type:   Number
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
    phoneNumber : {
        type : Number
    },
    about : {
        type : String ,
        default : "Hey there! I am  a fellow developer , lets connect",
    },
    skills : {
        type : [String],

    }
},{
    timestamps : true
});

const User = mongoose.model('User', userSchema);

module.exports = User;