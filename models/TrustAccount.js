const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrustAccountSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  transtype: {
    type: String
  },
  amount: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  },
  refno: {
    type: String,
    default: ""
  },
  transdate: {
    type: Date,
    default: Date.now
  }
});

const TrustAccount = mongoose.model("trustaccounts", TrustAccountSchema);

module.exports = TrustAccount;
