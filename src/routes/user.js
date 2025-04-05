const express = require('express');
const UserRouter = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

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

UserRouter.get('/feed', UserAuth, async(req, res) => {
    try{
      const loggedInUser = req.user;
      const page = parseInt(req.query.page)|| 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 100 ? 100 : limit;
      const skip = (page - 1) * limit;
      const connectionRequests = await ConnectionRequest.find({
        $or: [
            { fromUserId: loggedInUser._id},
            { toUserId: loggedInUser._id}
        ]
      }).select('fromUserId toUserId status');
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
          hideUsersFromFeed.add(req.fromUserId.toString());
          hideUsersFromFeed.add(req.toUserId.toString());
      });
      const users = await User.find({
        $and:[
            { _id: { $ne: loggedInUser._id } },
            { _id: { $nin: Array.from(hideUsersFromFeed) } }
        ]
      }).select('firstName lastName').skip(skip).limit(limit);
      res.json({ message: 'feed fetched successfully', users });
    }catch(e){
        res.status(500).json({ message: 'cant fetch your feed', details: e.message });
    }
})


module.exports = UserRouter;