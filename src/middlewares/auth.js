const jwt = require('jsonwebtoken');
const User = require('../models/user');

const AdminAuth = (req, res, next) => {
    console.log('you are in admin auth');
    const isAdmin = 'xyz';
    const token = 'xyz' === isAdmin;
    if (token) {
        next();
    } else {
        res.send('You are not authorized to access this route');
    }
}

const UserAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error('invalid token');
        }

        const decodedObj = await jwt.verify(token, 'KRISHNA_PUPPY');
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        req.user = user;
        next();
    }catch(e){
        res.status(500).send({ error: 'error authenticating profile', details: e.message })
    }
}

module.exports = {
    AdminAuth ,
    UserAuth,
};