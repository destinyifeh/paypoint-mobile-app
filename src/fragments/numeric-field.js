import Numeral from 'numeral'


export default function NumericField (number) {
  return `${Numeral(Math.abs(number)).format('0,0')}`
}
