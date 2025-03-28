const express = require('express');
const RequestRouter = express.Router();

const { UserAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectRequest = require('../models/connectionRequest');
const connectRequestSend = require('../utils/helper');

RequestRouter.post('/request/send/:status/:userId',UserAuth ,async (req, res) => {
  try{
     const fromUserId = req.user._id;
     const toUserId = req.params.userId;
     const status = req.params.status; 


     if(!fromUserId || !toUserId){
        throw new Error('user ids to connect does not exist');
     }

     const newRequest = new ConnectRequest({
        fromUserId,
        toUserId,
        status,
     });

     const data = newRequest.save();
     res.status(201).json({ message: 'Connection request sent successfully', data: newRequest });
     
  }catch(e){
     res.status(500).json({ messagae: 'soemthing went wrong while connecting', details : e.message});
  }
});

module.exports = RequestRouter; 