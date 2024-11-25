import { AirtimeAndData } from './airtime-and-data';
import { Bills } from './bills';
import { CashIn } from './cash-in';
import {
  BILLS,
  CASH_IN,
  MMO,
  RECHARGE,
  SEND_MONEY,
  WITHDRAW,
} from '../../../../../constants';
import { MMO as MMOServiceType } from './mmo';
import { SendMoney } from './send-money';
import { Withdraw } from './withdraw';


export default {
  [BILLS]: Bills,
  [CASH_IN]: CashIn,
  [MMO]: MMOServiceType,
  [RECHARGE]: AirtimeAndData,
  [SEND_MONEY]: SendMoney,
  [WITHDRAW]: Withdraw,
};
