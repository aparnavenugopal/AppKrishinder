const bcrypt = require('bcrypt');

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

const connectionRequestSend = () => {

}

module.exports = {
    SignUpValidation,
    UpdateValidation,
    encryptPassword,
    connectionRequestSend,
}
