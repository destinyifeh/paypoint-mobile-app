import Numeral from "numeral";

import { NIGERIA_SHORT_CODE } from "../constants";

export function formatNumber(number) {
  return Numeral(number).format("0,0");
}

export function formatNgnAmount(ngnAmount) {
  return `₦${Numeral(ngnAmount).format("0,0.00")}`;
}

export function formatPhoneNumberToReadable(phoneNumber) {
  return `0${phoneNumber.slice(-10)}`;
}

export function formatPhoneNumber(countryShortCode, phoneNumber) {
  if (countryShortCode === NIGERIA_SHORT_CODE) {
    return `234${phoneNumber.slice(-10)}`
  }
}

export function formatDateTime2(inputDate) {
  const date = new Date(inputDate);
  return `${("0" + date.getDate()).slice(-2)}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}

function formatAMPM(date) {
  let hours = '' + date.getHours();
  let minutes = '' + date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + '' + ampm;
  return strTime;
}

export function formatDateTime3(date) {
  const newDate = new Date(date)
    let month = "" + (newDate.getMonth() + 1)
    let day = "" + newDate.getDate()
   const year = newDate.getFullYear();

  const strTime = formatAMPM(newDate);

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year, strTime].join("-");
}

export function formatDateTime(inputDate) {
  const date = new Date(inputDate.replace(/\s/, "T"));
  return `${("0" + date.getDate()).slice(-2)}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${(
    "0" + date.getMinutes()
  ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
}

export function formatDate(inputDate) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const date = new Date(inputDate);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = daysOfWeek[date.getDay()];

  // Function to add 'th', 'st', 'nd', or 'rd' to the day
  function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) {
      return day + "th";
    }
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  }

  const formattedDate = `${dayOfWeek} ${getDayWithSuffix(day)}, ${year}`;
  return formattedDate;
}

const inputDate = "2023-10-11 12:59:11";
const formattedDate = formatDate(inputDate);
console.log(formattedDate); 

