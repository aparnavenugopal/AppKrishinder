const express = require('express');
const UserRouter = express.Router();
const mongoose = require('mongoose');

const { UserAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');


UserRouter.get('/user/requests/received', UserAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId',[ 'firstName', 'lastName', 'skills', "gender"]);
        
        res.json({ message: 'connection requests fetched successfully', connectionRequests });
    }catch(e){
        res.status(500).json({ message: 'cant fetch your connection requests', details: e.message });
    }
});

UserRouter.get('/user/connections', UserAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate('fromUserId', ['firstName', 'lastName'])
          .populate('toUserId', ['firstName', 'lastName']);

        const data = connectionRequests.map((row) =>
            row.fromUserId._id.equals(loggedInUser._id) ? row.toUserId : row.fromUserId
        );

        res.json({ data });

    } catch (e) {
        res.status(500).json({ message: 'cant fetch your connections', details: e.message });
    }
});


module.exports = UserRouter;