const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  ticketno: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  fullname: {
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
  transfee: {
    type: Number,
    required: true
  },
  phptomyrrate: {
    type: Number,
    required: true
  },
  myrtophprate: {
    type: Number,
    required: true
  },
  phpamount: {
    type: Number,
    required: true
  },
  myramount: {
    type: Number,
    required: true
  },
  totamount: {
    type: Number,
    required: true
  },
  taavailableamt: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String
  },
  orderdate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;
