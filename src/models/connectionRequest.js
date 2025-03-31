const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
   fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   status: {
      type: String,
      required: true,
      enum: {
         values: ["ignored", "interested", "accepted", "rejected"],
         message: `{VALUE} is incorrect status type`
      }
   },
}, {
   timestamps: true
});

const ConnectionRequest = new mongoose.model('ConnectionRequest', ConnectionRequestSchema);

module.exports = ConnectionRequest;