const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
require('./config/database');

const app = express();

app.post('/signup',(req, res) => {
    const user = new User({
        firstName : 'Krishna',
        lastName: "bujji",
        emailId: 'krishna33@gmail.com',
        password: 'krishna333',
        age: 3,
        gender: 'male'
    });
    user.save().then(() => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
    })
})



connectDB().then(() => {
    console.log('Database connected.....');
}).catch((err) => {
    console.log(err);
})

app.listen(8010, () => {
    console.log('Server is running on port 8010');
});