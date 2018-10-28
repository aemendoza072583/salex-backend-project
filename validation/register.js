const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.fullname = !isEmpty(data.fullname) ? data.fullname : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.mobileno = !isEmpty(data.mobileno) ? data.mobileno : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_confirm = !isEmpty(data.password_confirm)
    ? data.password_confirm
    : "";
  data.job = !isEmpty(data.job) ? data.job : "";
  data.income = !isEmpty(data.income) ? data.income : "";
  data.poe = !isEmpty(data.poe) ? data.poe : "";
  data.foe = !isEmpty(data.foe) ? data.foe : "";
  data.frcurr = !isEmpty(data.frcurr) ? data.frcurr : "";
  data.frbank = !isEmpty(data.frbank) ? data.frbank : "";
  data.fracctno = !isEmpty(data.fracctno) ? data.fracctno : "";
  data.fracctname = !isEmpty(data.fracctname) ? data.fracctname : "";
  data.tocurr = !isEmpty(data.tocurr) ? data.tocurr : "";
  data.tobank = !isEmpty(data.tobank) ? data.tobank : "";
  data.toacctno = !isEmpty(data.toacctno) ? data.toacctno : "";
  data.toacctname = !isEmpty(data.toacctname) ? data.toacctname : "";
  data.torelationship = !isEmpty(data.torelationship)
    ? data.torelationship
    : "";
  data.confirm = !isEmpty(data.confirm) ? data.confirm : false;
  
  if (!Validator.isLength(data.fullname, { min: 2, max: 40 })) {
    errors.fullname = "Full Name must be between 2 to 40 chars";
  }

  if (Validator.isEmpty(data.fullname)) {
    errors.fullname = "Full Name field is required";
  }

  if (!Validator.isLength(data.username, { min: 2, max: 15 })) {
    errors.username = "Username must be between 2 to 15 chars";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmpty(data.mobileno)) {
    errors.mobileno = "Mobile Number field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password must have at least 8 chars";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!Validator.equals(data.password, data.password_confirm)) {
    errors.password_confirm = "Password and Confirm Password must match";
  }

  if (Validator.isEmpty(data.password_confirm)) {
    errors.password_confirm = "Confirm Password is required";
  }

  if (Validator.isEmpty(data.job)) {
    errors.job = "Please provide your job";
  }

  if (Validator.isEmpty(data.income)) {
    errors.income = "Please select the range of your income";
  }

  if (Validator.isEmpty(data.poe)) {
    errors.poe = "Please provide purpose of exchange";
  }

  if (Validator.isEmpty(data.foe)) {
    errors.foe = "Please select you frequency of excahnge";
  }

  if (Validator.isEmpty(data.frcurr)) {
    errors.frcurr = "Please select from what currency to exchange";
  }

  if (Validator.isEmpty(data.frbank)) {
    errors.frbank = "Please select from what bank to exchange";
  }

  if (Validator.isEmpty(data.fracctno)) {
    errors.fracctno = "Please provide the account number";
  }

  if (Validator.isEmpty(data.fracctname)) {
    errors.fracctname = "Please provide the account name";
  }

  if (Validator.isEmpty(data.tocurr)) {
    errors.tocurr = "Please select to what currency to exchange";
  }

  if (Validator.equals(data.tocurr, data.frcurr)) {
    errors.tocurr =
      "From account currency and To account currency should not be the same";
  }

  if (Validator.isEmpty(data.tobank)) {
    errors.tobank = "Please select to what bank to exchange";
  }

  if (Validator.isEmpty(data.toacctno)) {
    errors.toacctno = "Please provide the account number";
  }

  if (Validator.isEmpty(data.toacctname)) {
    errors.toacctname = "Please provide the account name";
  }

  if (Validator.isEmpty(data.torelationship)) {
    errors.torelationship = "Please provide your relationship";
  }

  if (!data.confirm) {
    errors.confirm = "Please confirm that you have read the Term & Conditions";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
