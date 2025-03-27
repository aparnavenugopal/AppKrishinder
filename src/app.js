const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { UpdateValidation, encryptPassword  } = require('./utils/helper');
const cookieParser = require("cookie-parser");
const AuthRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile');
const RequestRouter = require('./routes/requests');
require('./config/database');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', AuthRouter);
app.use('/', ProfileRouter);
app.use('/', RequestRouter);


app.patch('/update/:userId', async (req, res) => {
    try {
        await UpdateValidation(req.body);
        if (req.body.password) {
            req.body.password = await encryptPassword(req.body.password); 
        }
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User cannot be updated as no record was found with this ID.');
        }
        res.status(200).send({ message: 'User successfully updated', updatedUser: user });
    } catch (e) {
        res.status(400).send({ error: 'Error while updating user', details: e.message });
    }
})

app.get('/user', async (req, res) => {
    try {
        const firstName = await User.findOne({ firstName: req.body.firstName });
        if (!firstName) {
            res.status(404).send('user not found');
        }
        res.status(200).send(firstName);
    } catch (e) {
        res.status(400).send({ error: 'Error while getting user', details: e.message });
    }
})

app.get('/feed', async (req, res) => {
   try {
        const user = await User.find();
        if (!user) {
            res.status(404).send('user not found');
        }
        res.status(200).send(user);
   } catch (e) {
        res.status(400).send({ error: 'Error while getting user', details: e.message });
   }
})

app.delete('/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body._id);
        if (!user) {
            res.status(404).send('user not found');
        }
        res.status(200).send('user successfully deleted!');
    } catch (e) {
        res.status(400).send({ error: 'Error while deleting the user', details: e.message });
    }
})

connectDB().then(() => {
    console.log('Database connected.....');
}).catch((err) => {
    console.log(err);
})

app.listen(8010, () => {
    console.log('Server is running on port 8010');
});