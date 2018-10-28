var nodemailer = require("nodemailer");

const Counter = require("../models/Counter");

module.exports = {
  getCounter: function(counterCd, callback) {
    var tmpCount = 0;

    Counter.findOne({ countercd: counterCd }).then(counter => {
      if (!counter) {
        tmpCount = 1;

        const newCounter = new Counter({
          countercd: counterCd,
          count: tmpCount
        });
        newCounter.save();
        return callback(tmpCount);
      } else {
        tmpCount = counter.count + 1;

        let newvalues = { $set: { count: tmpCount } };
        Counter.updateOne({ countercd: counterCd }, newvalues, function(
          err,
          res
        ) {
          if (err) throw err;
        });
        return callback(tmpCount);
      }
    });
  },
  sendMail: function(mailOptions) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ariel.mendoza0725",
        pass: "4ri3ll3J@n3"
      }
    });

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
