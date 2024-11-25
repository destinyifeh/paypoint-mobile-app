import numeral from 'numeral';
import symbols from '../constants/symbols';


export default function amountField(currency, amount) {
  let amount_ = amount;
  if (typeof amount_ === 'number') {
    amount_ = JSON.stringify(amount_);
  } else {
    amount_ = JSON.stringify(
        numeral(amount_).value(),
    );
  }

  const currencySymbol = symbols[currency];
  return (
    `${amount_.startsWith('-') ? '-' : ''}` +
    `${currencySymbol}${numeral(Math.abs(amount_)).format('0,0.00')}`
  );
}
