const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  countercd: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
});

const Counter = mongoose.model("counters", CounterSchema);

module.exports = Counter;
