import { NIGERIA_SHORT_CODE } from "../../constants";

function _sanitizeNigerianPhoneNumber(phoneNumber) {
  return `234${phoneNumber.slice(-10)}`;
}

export default function sanitizePhoneNumber(phoneNumber, country=NIGERIA_SHORT_CODE) {
  switch (country) {
    case NIGERIA_SHORT_CODE:
      return _sanitizeNigerianPhoneNumber(phoneNumber)
    default:
      return phoneNumber;
  }
}
