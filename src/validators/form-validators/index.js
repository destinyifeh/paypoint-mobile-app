import { MIN_NIGERIA_PHONE_LENGTH } from "../../constants/fields";

export function validateEmail(value) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value.toLowerCase());
}

export function validateFieldLength(value, minLength, maxLength, length) {
  let fieldIsValid = true;

  if (length) {
    if (Array.isArray(length)) {
      return Boolean(
        length.find(thisLength => thisLength === value.length)
      );
    }

    return value.length == length;
  }

  if (minLength && !maxLength) {
    fieldIsValid = value.length >= minLength;
  }

  if (maxLength && !minLength) {
    fieldIsValid = value.length <= maxLength;
  }

  if (maxLength && minLength) {
    fieldIsValid = maxLength >= value.length <= minLength
  }

  return fieldIsValid;
}

export function validatePassword(value) {
  return value.length >= 4;

  var re = /[a-z]/;
  var re2 = /[A-Z]/;
  var re3 = /[0-9]/;
  
  return re.test(String(value)) && re2.test(String(value)) && re3.test(String(value)) && String(value).length >= 8
}

export function validateName(value) {
  return /^[a-zA-Z\-]+$/.test(value);
}

export function validatePhone(value) {
  return value.length >= MIN_NIGERIA_PHONE_LENGTH
}
