import Numeral from 'numeral';

export function convertNgkToNgn(koboAmount) {
  return Numeral(koboAmount).value() * 0.01
}

export function convertNgnToNgk(ngnAmount) {
  return Numeral(ngnAmount).value() * 100
}
