const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const dateFormat = require("dateformat");
const {
  validateAdminInput,
  validateTrustAcctInput
} = require("../validation/admin");

const User = require("../models/User");
const TrustAccount = require("../models/TrustAccount");
const Order = require("../models/Order");

router.post("/login", (req, res) => {
  const { errors, isValid } = validateAdminInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;
  const usertype = "admin";

  User.findOne({ username, usertype }, function(err, user) {
    if (err) {
      return res.status(500).json(err);
    } else if (!user) {
      errors.username = "Admin not yet registered";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user._id,
          userid: user.userid,
          fullname: user.fullname,
          username: user.username,
          mobileno: user.mobileno,
          email: user.email,
          usertype: user.usertype
          //avatar: user.avatar
        };
        jwt.sign(
          payload,
          "SalExSecretKey",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) res.status(400).json(err);
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
        return res.status(400).json(error);
      }
    });
  });
});

router.post(
  "/getallmembers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.find({ usertype: "member", status: req.body.memstatus }, function(
      err,
      users
    ) {
      if (err) {
        return res.status(500).json(err);
      } else if (!users) {
        return res.status(404).json("No record found");
      } else {
        const data = [];

        users.forEach(user => {
          data.push({
            id: user._id,
            userid: user.userid,
            fullname: user.fullname,
            username: user.username,
            mobileno: user.mobileno,
            email: user.email,
            password: user.password,
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
            translimit: user.translimit,
            createdate: dateFormat(user.createdate, "m/d/yyyy h:MM:ss TT")
          });
        });

        return res.json(data);
      }
    });
  }
);

router.post(
  "/createtrustacct",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    const { errors, isValid } = validateTrustAcctInput(req.body);
    if (!isValid) {
      console.log(errors);
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
            const newTrustAccount = new TrustAccount({
              userid: req.body.userid,
              transtype: req.body.transtype,
              amount:
                req.body.transtype == ["WITHDRAW", "EXPIRED"]
                  ? (parseFloat(req.body.amount) * -1).toFixed(2)
                  : parseFloat(req.body.amount).toFixed(2),
              balance: parseFloat(req.body.balance).toFixed(2),
              refno: req.body.refno
            });

            newTrustAccount.save().then(trustaccount => {
              let newvalues = {
                $set: {
                  translimit: parseFloat(req.body.balance).toFixed(2)
                }
              };

              User.updateOne({ userid: req.body.userid }, newvalues, function(
                err,
                res
              ) {});

              res.json(trustaccount);
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

router.put(
  "/updatemember/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json("Not a valid ObjectId");
    }
    User.findById(req.params.id, function(err, user) {
      if (err) {
        return res.status(500).json(err);
      } else if (!user) {
        return res
          .status(404)
          .json("The member with the given ID was not found");
      } else {
        // const { errors, isValid } = validateRegisterInput(req.body);
        // if (!isValid) {
        //   return res.status(400).json(errors);
        // }

        let status =
          user.status === req.body.status ? user.status : req.body.status;
        let modstatus =
          user.modstatus === req.body.modstatus
            ? user.modstatus
            : req.body.modstatus;
        let transfee =
          user.transfee === req.body.transfee
            ? user.transfee
            : req.body.transfee;

        if (req.body.status === "APPROVED" && user.modstatus === "")
          modstatus = "ORIGINAL";
        if (req.body.status === "APPROVED" && user.transfee === null)
          transfee = "0.1";

        let newvalues = {
          $set: {
            status,
            modstatus,
            transfee,
            lasmoddate: Date.now
          }
        };

        User.updateOne({ _id: user._id }, newvalues, function(err, res) {
          if (err) throw err;
        });

        res.send("OK");
      }
    });
  }
);

router.put(
  "/updatememberorder/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json("Not a valid ObjectId");
    }
    Order.findById(req.params.id, function(err, order) {
      if (err) {
        return res.status(500).json(err);
      } else if (!order) {
        return res
          .status(404)
          .json("The order with the given ID was not found");
      } else {
        const userid = req.body.userid;
        const refno = req.body.ticketno;
        const transtype = "EXPIRED";

        TrustAccount.findOne({ userid, refno, transtype }, function(
          err,
          trustaccount
        ) {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          } else {
            if (!trustaccount) {
              let status =
                order.status === req.body.status
                  ? order.status
                  : req.body.status;

              let newvalues = {
                $set: {
                  status
                }
              };

              Order.updateOne({ _id: order._id }, newvalues, function(
                err,
                res
              ) {
                if (err) throw err;
              });

              if (req.body.status == "EXPIRED") {
                const newTrustAccount = new TrustAccount({
                  userid: req.body.userid,
                  transtype: "EXPIRED",
                  amount: req.body.totamount,
                  balance:
                    parseFloat(req.body.taavailableamt) +
                    parseFloat(req.body.totamount),
                  refno: req.body.ticketno
                });

                newTrustAccount.save();

                let newvalues = {
                  $set: {
                    translimit: (
                      parseFloat(req.body.taavailableamt) +
                      parseFloat(req.body.totamount)
                    ).toFixed(2)
                  }
                };

                User.updateOne({ userid: req.body.userid }, newvalues, function(
                  err,
                  res
                ) {});
              }

              return res.json({ status: "OK", message: "Success." });
            } else {
              return res.json({
                status: "EXPIRED",
                message: "Oreder already expired."
              });
            }
          }
        });
      }
    });
  }
);

router.get(
  "/getmemberinfo/:userid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const userid = req.params.userid;

      User.findOne({ userid }, function(err, user) {
        if (err) {
          return res.status(500).json(err);
        } else if (!user) {
          return res.status(404).json("Member not exists");
        } else {
          const data = {
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

          return res.json(data);
        }
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/getmemberstrustacct/:userid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      const userid = req.params.userid;

      TrustAccount.find({ userid }, function(err, trustaccounts) {
        if (err) {
          return res.status(500).json(err);
        } else if (!trustaccounts) {
          return res.status(404).json("No record found");
        } else {
          const data = [];

          trustaccounts.forEach(trustaccount => {
            data.push({
              userid: trustaccount.userid,
              transdate: dateFormat(
                trustaccount.transdate,
                "m/d/yyyy h:MM:ss TT"
              ),
              transtype: trustaccount.transtype,
              inamount:
                trustaccount.amount > 0 ? trustaccount.amount.toFixed(2) : "",
              outamount:
                trustaccount.amount < 0
                  ? (trustaccount.amount * -1).toFixed(2)
                  : "",
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
  "/getallmembersorder",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      Order.find({}, function(err, orders) {
        if (err) {
          return res.status(500).json(err);
        } else if (!orders) {
          return res.status(404).json("No record found");
        } else {
          const data = [];

          orders.forEach(order => {
            data.push({
              id: order._id,
              ticketno: order.ticketno,
              userid: order.userid,
              fullname: order.fullname,
              frcurr: order.frcurr,
              frbank: order.frbank,
              fracctno: order.fracctno,
              fracctname: order.fracctname,
              tocurr: order.tocurr,
              tobank: order.tobank,
              toacctno: order.toacctno,
              toacctname: order.toacctname,
              phptomyrrate: order.phptomyrrate.toFixed(4),
              phpamount: order.phpamount.toFixed(2),
              orderdate: dateFormat(order.orderdate, "m/d/yyyy h:MM:ss TT"),
              currtaavailableamt:
                order.frcurr + " " + order.taavailableamt.toFixed(2).toString(),
              status: order.status,
              totamount: order.totamount,
              taavailableamt: order.taavailableamt
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
  "/me/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id).then(user => {
      if (!user) {
        return res.status(404).json("Member not exists");
      } else {
        const payload = {
          id: user._id,
          userid: user.userid,
          fullname: user.fullname,
          username: user.username,
          mobileno: user.mobileno,
          email: user.email,
          usertype: user.usertype
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
