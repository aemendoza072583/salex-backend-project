const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = {
  validateAdminInput: function(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.username)) {
      errors.username = "Username is required";
    }

    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
      errors.password = "Password must have at least 8 chars";
    }

    if (Validator.isEmpty(data.password)) {
      errors.password = "Password is required";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },

  validateTrustAcctInput: function(data) {
    let errors = {};
    data.transtype = !isEmpty(data.transtype) ? data.transtype : "";
    data.amount = !isEmpty(data.amount) ? data.amount : "";

    if (Validator.isEmpty(data.transtype)) {
      errors.transtype = "Transaction Type is required";
    }

    if (Validator.isEmpty(data.amount) || parseFloat(data.amount) < 0) {
      errors.amount = "Amount must be greater than 0";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};
