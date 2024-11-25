const EMPTY_AMOUNT = 0;
const defaultWalletProps = {
  transactionWalletBalance: EMPTY_AMOUNT, 
  commissionWalletBalance: EMPTY_AMOUNT,
}

export default class WalletSerializer {
  constructor(props=defaultWalletProps) {
    console.log({defaultWalletProps})
    this.current_balance = (props.transactionWalletBalance || EMPTY_AMOUNT) / 100;
    this.ledger_balance = (props.ledgerBalance || EMPTY_AMOUNT) / 100;
    this.commissions_earned = (props.commissionWalletBalance || EMPTY_AMOUNT) / 100;
    this.float_balance = (props.float_balance || EMPTY_AMOUNT);
    this.unsettled_balance = (props.unsettledCommission || EMPTY_AMOUNT) / 100;
    
    this.settlementBalanceTimestamp = props.settlementBalanceTimestamp;
    this.walletBalanceTimestamp = props.walletBalanceTimestamp;
  }

  asJson() {
    return {
      current_balance: this.current_balance || EMPTY_AMOUNT,
      commissions_earned: this.commissions_earned || EMPTY_AMOUNT,
      float_balance: this.float_balance || EMPTY_AMOUNT,
      ledger_balance: this.ledger_balance || EMPTY_AMOUNT,
      unsettled_balance: this.unsettled_balance || EMPTY_AMOUNT,
      settlementBalanceTimestamp: this.settlementBalanceTimestamp,
      walletBalanceTimestamp: this.walletBalanceTimestamp,
    };
  }
}
