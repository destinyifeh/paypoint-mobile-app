import { 
  ACCESS_TOKEN,
  AGENT,
  APP_NAME,
  APPLICATION,
  APPROVED,
  AUTO_LOGIN_FAILED_MESSAGE,
  DEFAULT_PAGE_SIZE,
  USER,
  IFIS_K3,
  TRANSACTION_FILTERS,
  TRANSFER_PAYMENT_ITEM_CODE,
  DRAFT,
  MOBILE,
  NIGERIA,
  OTP_SUCCESSFULLY_SENT,
  SENDING,
  SHARE_RECEIPT_MESSAGE,
  SHARE_RECEIPT_TITLE,
  SUCCESS,
  PAY_A_BILL,
  TRANSACTION_NARRATION_MAX_LENGTH,
  WALLET,
  NIGERIA_SHORT_CODE,
  LOGIN_DETAILS,
  EXPIRED_SESSION_MESSAGE
} from './index';

test(
  'ACCESS_TOKEN', () => {
    expect(ACCESS_TOKEN).toBe('access_token')
  }
)

test(
  'AGENT', () => {
    expect(AGENT).toBe('agent')
  }
)

test(
  'APP_NAME', () => {
    expect(APP_NAME).toBe('Quickteller Paypoint')
  }
)

test(
  'APPLICATION', () => {
    expect(APPLICATION).toBe('application')
  }
)

test(
  'APPROVED', () => {
    expect(APPROVED).toBe('APPROVED')
  }
)

test(
  'AUTO_LOGIN_FAILED_MESSAGE', () => {
    expect(AUTO_LOGIN_FAILED_MESSAGE).toBe('You already have an Interswitch account. Login with existing credentials!')
  }
)

test(
  'DEFAULT_PAGE_SIZE', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(10)
  }
)

test(
  'USER', () => {
    expect(USER).toBe('user')
  }
)

test(
  'IFIS_K3', () => {
    expect(IFIS_K3).toBe('ifis-k3')
  }
)

test(
  'EXPIRED_SESSION_MESSAGE', () => {
    expect(EXPIRED_SESSION_MESSAGE).toBe('Your session has expired. Please, re-login.')
  }
)

test(
  'LOGIN_DETAILS', () => {
    expect(LOGIN_DETAILS).toBe('login_details')
  }
)

test(
  'TRANSACTION_FILTERS', () => {
    expect(TRANSACTION_FILTERS).toBe('Transaction Filters')
  }
)

test(
  'TRANSFER_PAYMENT_ITEM_CODE', () => {
    expect(TRANSFER_PAYMENT_ITEM_CODE).toBe('10428')
  }
)

test(
  'DRAFT', () => {
    expect(DRAFT).toBe('draft')
  }
)

test(
  'MOBILE', () => {
    expect(MOBILE).toBe('mobile')
  }
)

test(
  'NIGERIA', () => {
    expect(NIGERIA).toBe('Nigeria')
  }
)

test(
  'NIGERIA_SHORT_CODE', () => {
    expect(NIGERIA_SHORT_CODE).toBe('NG')
  }
)

test(
  'OTP_SUCCESSFULLY_SENT', () => {
    expect(OTP_SUCCESSFULLY_SENT).toBe('OTP has been successfully sent')
  }
)

test(
  'SENDING', () => {
    expect(SENDING).toBe('Sending')
  }
)

test(
  'SUCCESS', () => {
    expect(SUCCESS).toBe('Success')
  }
)

test(
  'PAY_A_BILL', () => {
    expect(PAY_A_BILL).toBe('pay-a-bill')
  }
)

test(
  'SHARE_RECEIPT_MESSAGE', () => {
    expect(SHARE_RECEIPT_MESSAGE).toBe('Quickteller Paypoint Transaction Receipt')
  }
)

test(
  'SHARE_RECEIPT_TITLE', () => {
    expect(SHARE_RECEIPT_TITLE).toBe('Quickteller Paypoint')
  }
)

test(
  'TRANSACTION_NARRATION_MAX_LENGTH', () => {
    expect(TRANSACTION_NARRATION_MAX_LENGTH).toBe(20)
  }
)

test(
  'WALLET', () => {
    expect(WALLET).toBe('wallet')
  }
)
