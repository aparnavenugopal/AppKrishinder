const bcrypt = require('bcrypt');
const User = require('../models/user');

const encryptPassword = async (password) => {
    console.log('Before hashing:', password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('After hashing:', hashedPassword);
    return hashedPassword;
};

const SignUpValidation = (user) => {
    if (user.skills !== undefined) {  
        if (!Array.isArray(user.skills)) {
            throw new Error('Skills must be an array.');
        }
        user.skills = [...new Set(user.skills)];
        if (user.skills.length > 15) {
            throw new Error('Skills cannot exceed 15 unique items.');
        }
    }
    if (user.firstName !== undefined && (user.firstName.length < 3 || user.firstName.length > 150)) {
        throw new Error('First name should be between 3 and 150 characters.');
    }
    if (user.emailId !== undefined && user.emailId === '') {
        throw new Error('Email is required.');
    }
    if (user.firstName !== undefined && user.firstName === '') {
        throw new Error('First name is required.');
    }
    if (user.password !== undefined && user.password === '') {
        throw new Error('Password is required.');
    }
    if (user.gender !== undefined && !['male', 'female', 'others'].includes(user.gender.toLowerCase())) {
        throw new Error('Gender must be male, female, or others.');
    }
    if (user.CellNumber !== undefined && user.CellNumber === '') {
        throw new Error('Cell number is required.');
    }
};

const UpdateValidation = (user) => {
    const UPDATE_FIELDS = [
        'lastName',
        'about',
        'age',
        'skills',
        'cellNumber',
    ];
    const updates = Object.keys(user);
    const isValidUpdate = updates.every(field => UPDATE_FIELDS.includes(field));
    if (!isValidUpdate) {
        throw new Error('Invalid updates! Only specific fields can be updated.');
    }
    if (user.skills) {
        SignUpValidation({ skills: user.skills }); 
    }
}

const connectionRequestSend = async ({ fromUserId, toUserId, status }) => {
    if (!status || !['ignored', 'interested'].includes(status)) {
        throw new Error('Status must be either "ignored" or "interested".');
    }
    if (fromUserId === toUserId) {
        throw new Error('Sender cannot send a connection request to themselves.');
    }

    const [isValidUser, isValidConnect, existingConnection] = await Promise.all([
        User.findById(fromUserId),
        User.findById(toUserId),
        User.findOne({ fromUserId, toUserId })
    ]);

    if (!isValidUser || !isValidConnect) {
        throw new Error('Invalid sender or recipient ID.');
    }
    if (existingConnection) {
        throw new Error('A connection request already exists between these users.');
    }
};

module.exports = {
    SignUpValidation,
    UpdateValidation,
    encryptPassword,
    connectionRequestSend,
}
