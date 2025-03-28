const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
   fromUserId :{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
   },
   status : {
    type: String,
    require: true,
    enum: {
        values: [ "ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`
    }
   },
},
{
    timestamps: true
   }
);

const ConnectionRequest = new mongoose.model('ConnectionRequest', ConnectionRequestSchema);

module.exports = ConnectionRequest;