import { Dimensions } from "react-native";
import { COLOUR_GREEN, COLOUR_ORANGE, COLOUR_RED } from "./styles";

export const ACCESS_TOKEN = "access_token";
export const AGENT = "agent";
export const AGENT_TYPE_ID = 4;
export const APP_NAME = 'Quickteller Paypoint';
export const APPLICANT = 'applicant';
export const APPLICATION = 'application';
export const APPLICATION_ASSISTED = 'application';
export const APPROVED = 'APPROVED';
export const AUTO_LOGIN_FAILED_MESSAGE = 'You already have an Interswitch account. Login with existing credentials!';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_DOMAIN_CODE = "APP";
export const HAS_USER_RATED_APP_ON_THE_STORE =
  "HAS_USER_RATED_APP_ON_THE_STORE";
export const LOGIN_CREDENTIALS = "LOGIN_CREDENTIALS";
export const USER_PROFILES = "USER_PROFILES";
export const SUPER_AGENT = "super agent";
export const USER = "user";
export const BVN_STATUS = "bvn_status";

export const COPIED_TO_CLIPBOARD = "Copied to clipboard!";

export const EMPTY_AMOUNT = "0.00";

export const FILE_UPLOAD_LIMIT = 1000000;
export const FILE_UPLOAD_LIMIT_MESSAGE =
  "The file you uploaded exceeds the file limit of 4MB.";

export const AWAITING_VALIDATION_APPLICATION_STATUS = "0";
export const AWAITING_APPROVAL_APPLICATION_STATUS = "1";
export const APPROVED_APPLICATION_STATUS = "2";
export const DECLINED_APPLICATION_STATUS = "3";

export const SHOW_STATUS_BAR = "SHOW_STATUS_BAR";
export const CANNOT_ACCESS_DASHBOARD =
  "You are not authorized to access this dashboard.";
export const IFIS_K3 = "ifis-k3";

export const EXPIRED_SESSION_MESSAGE =
  "Your session has expired. Please, re-login.";
export const LOGIN_DETAILS = "login_details";
export const INVALID_FORM_MESSAGE =
  "There are some errors in the form. Please, scroll through the form, resolve all invalid fields and re-submit.";

export const TRANSACTION_CURRENCY = "NGN";
export const TRANSACTION_FILTERS = "Transaction Filters";
export const TRANSFER_PAYMENT_ITEM_CODE = "10428";

export const DRAFT = "draft";

export const MOBILE = "mobile";
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const MONTHS_NUMBERS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const NIGERIA = "Nigeria";
export const NIGERIA_SHORT_CODE = "NG";
export const MAX_SELECT_BOX_RECORDS = 300;
export const OTP_SUCCESSFULLY_SENT = "OTP has been successfully sent";
export const SENDING = "Sending";
export const SUCCESS = "Success";

export const AIRTIME_AND_DATA = "airtime-and-data";
export const BILLS = "bills";
export const CASH_IN = "cash-in";
export const CASH_OUT = "cash_out";
export const MMO = "mmo";
export const PAY_A_BILL = "pay-a-bill";
export const RECHARGE = "recharge";
export const SEND_MONEY = "send-money";
export const TRANSFER = "transfer";
export const FUND_TRANSFER_UNIFIED = "FUND_TRANSFER_UNIFIED";
export const CASHIN = "TRANSFER_CASH_IN";
export const TRANSFER_TO_ACCOUNT = "transfer-to-account";
export const TRANSFER_TO_AGENT = "transfer-to-agent";
export const WITHDRAW = "withdraw";
export const PAYCODE = "paycode";
export const USSD = "ussd";
export const WITHDRAW_VIA_PAYCODE = "withdraw_via_paycode";
export const WITHDRAW_VIA_USSD = "withdraw_via_ussd";

export const PENDING_SCENE_AFTER_APPLICATION_SUBMISSION =
  "PENDING_SCENE_AFTER_APPLICATION_SUBMISSION";
export const PENDING_SIGNUP = "pending-signup";

export const SHARE_RECEIPT_MESSAGE = "Quickteller Paypoint Transaction Receipt";
export const SHARE_RECEIPT_TITLE = "Quickteller Paypoint";

export const TRANSACTION_NARRATION_MAX_LENGTH = 20;

export const WALLET = "wallet";

export const CONTACT_US_EMAIL = "ifiscustomercare@interswitchgroup.com";
export const CONTACT_US_WEBPAGE = "https://help.interswitchgroup.com/";
export const CONTACT_US_PHONE = "07009065000";

export const PENDING_FUND_WALLET_MESSAGE =
  "Your transaction is currently being processed. Check your transaction history report for the latest status of the transaction.";
export const SUCCESSFUL_FUND_WALLET_MESSAGE =
  "Your wallet has been funded successfully!";
export const SUCCESSFUL_CARD_LINKING_MESSAGE = "Card was linked successfully!";

export const TRANSACTION_ERROR = "Transaction Error";

export const TRANSACTION_STATUS_CODE_COLORS = {
  Successful: COLOUR_GREEN,
  Failed: COLOUR_RED,
  Pending: COLOUR_ORANGE,
};

export const PENDING_TRANSACTION_STATUS_CODE = "02";

export const TRANSACTION_STATUS_COLORS = {
  "00": COLOUR_GREEN,
  "01": COLOUR_RED,
  "02": COLOUR_ORANGE,
  "03": COLOUR_RED,
  "04": COLOUR_RED,
};

export const TRANSACTION_STATUS_LABELS = {
  "00": "Successful",
  "01": "Failed",
  "02": "Pending",
  "03": "Duplicate",
  "04": "Not Found",
};

export const BUY_AIRTIME = "Buy Airtime";
export const PAY_A_BILL_NORMALIZED = "Pay a Bill";

export const NO_AUTH_SCREENS = [
  "GuestLogin",
  "Login",
  "Logout",
  "ResetPassword",
  "Signup",
  "Welcome",
  "Landing",
  "VerifyPhone",
];

export const MIME_TYPE_CSV = "text/csv";

export const SEEN_FEATURES = "SEEN_FEATURES";

export const WINDOW_WIDTH = Dimensions.get("window").width;
