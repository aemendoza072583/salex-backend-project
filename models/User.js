const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  mobileno: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String
  },
  job: {
    type: String,
    required: true
  },
  income: {
    type: String,
    required: true
  },
  poe: {
    type: String,
    required: true
  },
  foe: {
    type: String,
    required: true
  },
  frcurr: {
    type: String,
    required: true
  },
  frbank: {
    type: String,
    required: true
  },
  fracctno: {
    type: String,
    required: true
  },
  fracctname: {
    type: String,
    required: true
  },
  tocurr: {
    type: String,
    required: true
  },
  tobank: {
    type: String,
    required: true
  },
  toacctno: {
    type: String,
    required: true
  },
  toacctname: {
    type: String,
    required: true
  },
  torelationship: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  modstatus: {
    type: String
  },
  transfee: {
    type: Number
  },
  translimit: {
    type: Number
  },
  avatar: {
    type: String
  },
  createdate: {
    type: Date,
    default: Date.now
  },
  lastmoddate: {
    type: Date
  }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
