const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateOrderInput(data) {
  let errors = {};

  data.userid = !isEmpty(data.userid) ? data.userid : "";
  data.fullname = !isEmpty(data.fullname) ? data.fullname : "";
  data.frcurr = !isEmpty(data.frcurr) ? data.frcurr : "";
  data.frbank = !isEmpty(data.frbank) ? data.frbank : "";
  data.fracctno = !isEmpty(data.fracctno) ? data.fracctno : "";
  data.fracctname = !isEmpty(data.fracctname) ? data.fracctname : "";
  data.tocurr = !isEmpty(data.tocurr) ? data.tocurr : "";
  data.tobank = !isEmpty(data.tobank) ? data.tobank : "";
  data.toacctno = !isEmpty(data.toacctno) ? data.toacctno : "";
  data.toacctname = !isEmpty(data.toacctname) ? data.toacctname : "";
  data.transfee = !isEmpty(data.transfee) ? data.transfee : 0;
  data.phptomyrrate = !isEmpty(data.phptomyrrate) ? data.phptomyrrate : 0;
  data.myrtophprate = !isEmpty(data.myrtophprate) ? data.myrtophprate : 0;
  data.phpamount = !isEmpty(data.phpamount) ? data.phpamount : 0;
  data.myramount = !isEmpty(data.myramount) ? data.myramount : 0;
  data.totamount = !isEmpty(data.totamount) ? data.totamount : 0;
  data.taavailableamt = !isEmpty(data.taavailableamt)
    ? data.taavailableamt
    : 0;
  data.status = !isEmpty(data.status) ? data.status : "QUEUE";

  if (Validator.isEmpty(data.userid)) {
    errors.userid = "Member ID is required";
  }

  if (Validator.isEmpty(data.fullname)) {
    errors.fullname = "Member Full Name is required";
  }

  if (Validator.isEmpty(data.frcurr)) {
    errors.frcurr = "From Currency is required";
  }

  if (Validator.isEmpty(data.frbank)) {
    errors.frbank = "From Bank is required";
  }

  if (Validator.isEmpty(data.fracctno)) {
    errors.fracctno = "From Account Number is required";
  }

  if (Validator.isEmpty(data.fracctname)) {
    errors.fracctname = "From Account Name is required";
  }

  if (Validator.isEmpty(data.tocurr)) {
    errors.tocurr = "To Currency is required";
  }

  if (Validator.isEmpty(data.tobank)) {
    errors.tobank = "To Bank is required";
  }

  if (Validator.isEmpty(data.toacctno)) {
    errors.toacctno = "To Account Number is required";
  }

  if (Validator.isEmpty(data.toacctname)) {
    errors.toacctname = "To Account Name is required";
  }

  if (Validator.isEmpty(data.transfee.toString())) {
    errors.transfee = "Transaction Fee is required";
  }

  if (Validator.isEmpty(data.phptomyrrate.toString())) {
    errors.phptomyrrate = "PHP to MYR Rate is required";
  }

  if (Validator.isEmpty(data.myrtophprate.toString())) {
    errors.myrtophprate = "MYR to PHP Rate is required";
  }

  if (Validator.isEmpty(data.phpamount.toString())) {
    errors.phpamount = "PHP Amount is required";
  }

  if (Validator.isEmpty(data.myramount.toString())) {
    errors.myramount = "MYR Amount is required";
  }

  if (Validator.isEmpty(data.totamount.toString())) {
    errors.totamount = "Total Amount is required";
  }


  if (Validator.isEmpty(data.taavailableamt.toString())) {
    errors.taavailableamt = "Available in Trust Account is required";
  }

  if (!Validator.isNumeric(data.transfee.toString())) {
    errors.transfee = "Not a valid Transaction Fee";
  }

  if (!Validator.isNumeric(data.phptomyrrate.toString())) {
    errors.phptomyrrate = "Not a valid PHP to MYR Rate";
  }

  if (!Validator.isNumeric(data.myrtophprate.toString())) {
    errors.myrtophprate = "Not a valid MYR to PHP Rate";
  }

  if (!Validator.isNumeric(data.phpamount.toString())) {
    errors.phpamount = "Not a valid PHP Amount";
  }

  if (!Validator.isNumeric(data.myramount.toString())) {
    errors.myramount = "Not a valid MYR Amount";
  }

  if (!Validator.isNumeric(data.totamount.toString())) {
    errors.totamount = "Not a valid Total Amount";
  }

  if (!Validator.isNumeric(data.taavailableamt.toString())) {
    errors.taavailableamt = "Not a valid Available in Trust Account Amount";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
