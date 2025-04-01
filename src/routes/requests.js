const express = require('express');
const RequestRouter = express.Router();
const mongoose = require('mongoose');

const { UserAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectRequest = require('../models/connectionRequest');


RequestRouter.post('/request/send/:status/:touserId', UserAuth, async (req, res) => {
  try {
     const fromUserId = req.user._id;
     const toUserId = req.params.touserId;
     const status = req.params.status; 
     
     if (!fromUserId || !toUserId) {
        throw new Error('User IDs to connect do not exist');
     }
     
     const allowedStatus = ['ignored', 'interested'];
     if(!allowedStatus.includes(status)){
        return res.status(400).json({message:'invalid status type'})
     }


     const existingConnectionRequest = await ConnectRequest.findOne({
      $or:[
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId},
      ],
     });

     if(existingConnectionRequest){
      return res.status(400).json({messgae: 'cant connect connection request more than once'})
     }

     const newRequest = new ConnectRequest({
        fromUserId,
        toUserId,
        status,
     });

     const data = await newRequest.save();
     res.status(201).json({ message: 'Connection request sent successfully', data });

  } catch (e) {
     res.status(500).json({ message: 'Something went wrong while connecting', details: e.message });
  }
});

RequestRouter.post('/request/review/:status/:requestId', UserAuth, async(req, res) => {
   try{
      const loggedInUser = req.user;
      const allowedStatus = ['accepted', 'rejected'];
      const {status, requestId } = req.params;
      if(!allowedStatus.includes(status)){
         return res.status(400).json({message:'invalid status type'})
      }

      const connectionRequest = await ConnectRequest.findOne({
         _id: requestId,
         toUserId: loggedInUser._id,
         status: "interested",
      })

      if(!connectionRequest){
         return res.status(404).json({message:'connection request not found or already reviewed'})
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.status(200).json({message: 'connection request reviewed successfully', data});
   }catch(e){
      res.status(500).json({message:'something went wrong while reviewing connection request', details: e.message});
   }
})

module.exports = RequestRouter;