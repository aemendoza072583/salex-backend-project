const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const dateFormat = require("dateformat");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateOrderInput = require("../validation/order");
const common = require("../classes/common");

const User = require("../models/User");
const TrustAccount = require("../models/TrustAccount");
const Order = require("../models/Order");

router.post("/register", function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) {
        return res.status(500).json(err);
      } else if (user) {
        return res.status(400).json({
          email: "Email already exists"
        });
      } else {
        common.getCounter("users", function(newCount) {
          // const avatar =
          //   req.body.avatar === ""
          //     ? gravatar.url(req.body.email, {
          //         s: "200",
          //         r: "pg",
          //         d: "mm"
          //       })
          //     : req.body.avatar;

          let newUserID =
            (req.body.frcurr === "MYR" ? "R" : "P") +
            (req.body.tocurr === "MYR" ? "R" : "P") +
            String(newCount).padStart(5, "0");

          const avatar = req.body.avatar;

          const newUser = new User({
            userid: newUserID,
            fullname: req.body.fullname,
            username: req.body.username,
            mobileno: req.body.mobileno,
            email: req.body.email,
            password: req.body.password,
            usertype: "member",
            job: req.body.job,
            income: req.body.income,
            poe: req.body.poe,
            foe: req.body.foe,
            frcurr: req.body.frcurr,
            frbank: req.body.frbank,
            fracctno: req.body.fracctno,
            fracctname: req.body.fracctname,
            tocurr: req.body.tocurr,
            tobank: req.body.tobank,
            toacctno: req.body.toacctno,
            toacctname: req.body.toacctname,
            torelationship: req.body.torelationship,
            status: "QUEUE",
            modstatus: "",
            transfee: "",
            translimit: 0,
            avatar,
            lastmoddate: null
          });

          const newTrustAccount = new TrustAccount({
            userid: newUserID,
            transtype: "OPEN ACCOUNT",
            amount: 0,
            balance: 0
          });

          bcrypt.genSalt(10, (err, salt) => {
            if (err) res.status(400).json(err);
            else {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) res.status(400).json(err);
                else {
                  newUser.password = hash;
                  newUser.save().then(user => {
                    newTrustAccount.save();
                    res.json(user);
                  });

                  // const mailOptions = {
                  //   from: "ariel.mendoza0725@gmail.com",
                  //   to: "ariel.mendoza0725@yahoo.com.ph",
                  //   subject: "Salex Members Approval",
                  //   text: "New member registration pending for approval."
                  // };
                  // common.sendMail(mailOptions);
                }
              });
            }
          });
        });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const usertype = "member";

  User.findOne({ email, usertype }, function(err, user) {
    if (err) {
      return res.status(500).json(err);
    } else if (!user) {
      errors.email = "Member not yet registered";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        if (user.status != "APPROVED") {
          errors.email = "Member's account is still pending for admin approval";
          return res.status(404).json(errors);
        }

        if (user.modstatus == "QUEUE") {
          errors.email =
            "Member's account is still pending for change password admin approval";
          return res.status(404).json(errors);
        }

        const payload = {
          id: user._id,
          userid: user.userid,
          fullname: user.fullname,
          username: user.username,
          mobileno: user.mobileno,
          email: user.email,
          usertype: user.usertype,
          job: user.job,
          income: user.income,
          poe: user.poe,
          foe: user.foe,
          frcurr: user.frcurr,
          frbank: user.frbank,
          fracctno: user.fracctno,
          fracctname: user.fracctname,
          tocurr: user.tocurr,
          tobank: user.tobank,
          toacctno: user.toacctno,
          toacctname: user.toacctname,
          torelationship: user.torelationship,
          status: user.status,
          modstatus: user.modstatus,
          transfee: user.transfee,
          translimit: user.translimit
          //avatar: user.avatar
        };

        jwt.sign(
          payload,
          "SalExSecretKey",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) return res.status(400).json(err);
            else {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          }
        );
      } else {
        errors.password = "Incorrect Password";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post(
  "/createorder",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    const { errors, isValid } = validateOrderInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    User.findOne(
      {
        userid: req.body.userid
      },
      function(err, user) {
        if (err) {
          return res.status(500).json(err);
        } else if (!user) {
          return res.status(404).json("Member not exists");
        } else {
          try {
            const today = new Date();
            const newTicketNo =
              dateFormat(today, "mmddyyHHMM") +
              "_" +
              req.body.userid +
              "_" +
              req.body.phpamount.toString() +
              "_" +
              req.body.phptomyrrate.toString();

            const newOrder = new Order({
              ticketno: newTicketNo,
              userid: req.body.userid,
              fullname: req.body.fullname,
              frcurr: req.body.frcurr,
              frbank: req.body.frbank,
              fracctno: req.body.fracctno,
              fracctname: req.body.fracctname,
              tocurr: req.body.tocurr,
              tobank: req.body.tobank,
              toacctno: req.body.toacctno,
              toacctname: req.body.toacctname,
              transfee: req.body.transfee,
              phptomyrrate: req.body.phptomyrrate,
              myrtophprate: req.body.myrtophprate,
              phpamount: req.body.phpamount,
              myramount: req.body.myramount,
              totamount: req.body.totamount,
              taavailableamt: req.body.taavailableamt,
              status: "QUEUE"
            });

            const newTrustAccount = new TrustAccount({
              userid: req.body.userid,
              transtype: "QUEUE",
              amount: req.body.totamount * -1,
              balance: req.body.taavailableamt,
              refno: newTicketNo
            });

            newOrder.save().then(order => {
              newTrustAccount.save();

              let newvalues = {
                $set: {
                  translimit: req.body.taavailableamt
                }
              };

              User.updateOne({ _id: user._id }, newvalues, function(err, res) {
                if (err) throw err;
              });

              res.json(order);
            });
          } catch (error) {
            console.log(error);
            res.status(400).json(error);
          }
        }
      }
    );
  }
);

router.get(
  "/orderhistory/:userid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const userid = req.params.userid;

      Order.find({ userid }, function(err, orders) {
        if (err) {
          return res.status(500).json(err);
        } else if (!orders) {
          return res.status(404).json("No record found.");
        } else {
          const data = [];

          orders.forEach(order => {
            data.push({
              orderdate: dateFormat(order.orderdate, "m/d/yyyy h:MM:ss TT"),
              amount:
                userid.substr(0, 2) === "RP"
                  ? order.myramount.toFixed(2)
                  : order.phpamount.toFixed(2),
              rate:
                userid.substr(0, 2) === "RP"
                  ? order.myrtophprate.toFixed(4)
                  : order.phptomyrrate.toFixed(4),
              totamount: order.totamount.toFixed(2),
              status: order.status
            });
          });

          return res.json(data);
        }
      }).sort({ orderdate: -1 });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/trustaccount/:userid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const userid = req.params.userid;

      TrustAccount.find({ userid }, function(err, trustaccounts) {
        if (err) {
          return res.status(500).json(err);
        } else if (!trustaccounts) {
          return res.status(404).json("No record found.");
        } else {
          const data = [];

          trustaccounts.forEach(trustaccount => {
            data.push({
              userid: trustaccount.userid,
              transdate: dateFormat(trustaccount.transdate, "m/d/yyyy h:MM:ss TT"),
              transtype: trustaccount.transtype,
              inamount: trustaccount.amount > 0 ? trustaccount.amount.toFixed(2) : "",
              outamount: trustaccount.amount < 0 ? (trustaccount.amount * -1).toFixed(2) : "",
              balance: trustaccount.balance.toFixed(2),
              refno: trustaccount.refno
            });
          });

          return res.json(data);
        }
      }).sort({ transdate: 0 });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/me/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        return res.status(500).json(err);
      } else if (!user) {
        return res.status(404).json("Member not exists");
      } else {
        const payload = {
          id: user._id,
          userid: user.userid,
          fullname: user.fullname,
          username: user.username,
          mobileno: user.mobileno,
          email: user.email,
          usertype: user.usertype,
          job: user.job,
          income: user.income,
          poe: user.poe,
          foe: user.foe,
          frcurr: user.frcurr,
          frbank: user.frbank,
          fracctno: user.fracctno,
          fracctname: user.fracctname,
          tocurr: user.tocurr,
          tobank: user.tobank,
          toacctno: user.toacctno,
          toacctname: user.toacctname,
          torelationship: user.torelationship,
          status: user.status,
          modstatus: user.modstatus,
          transfee: user.transfee,
          translimit: user.translimit
          //avatar: user.avatar
        };

        jwt.sign(
          payload,
          "SalExSecretKey",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) return res.status(400).json(err);
            else {
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          }
        );
      }
    });
  }
);

module.exports = router;
