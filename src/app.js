const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
require('./config/database');

const app = express();

app.post('/signup',async (req, res) => {
    const user = new User({
        firstName : 'Kitty',
        lastName: "uday",
        emailId: 'kitty33@gmail.com',
        password: 'uday333',
        age: 23,
        gender: 'male'
    });
    await user.save().then(() => {
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