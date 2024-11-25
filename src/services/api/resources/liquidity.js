import {
  ENVIRONMENT_IS_TEST,
  LIQUIDITY_API_BASE_URL
} from '../../../constants/api-resources';
import Requester from '../finch-requester';


let API_BASE_URL = LIQUIDITY_API_BASE_URL;
if (ENVIRONMENT_IS_TEST) {
  API_BASE_URL = (
    'http://finch.qa.interswitchng.com/liquidity-service/api'
    // 'https://finch-liquidity-service.k8.isw.la/liquidity-service/api'
  );
}


export default class Liquidity {
  constructor(props) {
    this.apiRequester = props ? props.apiRequester || new Requester({
      apiBaseUrl: API_BASE_URL
    }) : new Requester({
      apiBaseUrl: API_BASE_URL
    });
  }

  fetchCashOutBanks() {
    return this.apiRequester.get({
      endpoint: 'v1/cash-out/banks',
    });
  }

  initiatePaycodeCashOut(
      amount, paycode, subscriberId, customerFirstName,
      customerLastName, customerEmail, customerPhoneNo,
      customerGender, checksum, deviceUuid,
  ) {
    return this.apiRequester.post({
      endpoint: 'v1/cash-out/pay-code/initialize',
      body: {
        amount,
        checksum,
        payCode: paycode,
        subscriberId,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNo,
        customerGender,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  initiateUssdCashOut(
      amount, bankCode, checksum, phone, deviceUuid, paymentItemCode,
  ) {
    return this.apiRequester.post({
      endpoint: 'v1/cash-out/initialize',
      body: {
        amount,
        bankCode,
        checksum,
        customerId: phone,
        paymentItemCode,
      },
      headers: {
        deviceUuid,
      },
    });
  }

  initializeWebPay(amount, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/webpay/initialize',
      body: {
        amount,
        checksum
      },
      headers: {
        deviceUuid
      }
    });
  }

  proceedWebPay(body, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/webpay/proceed',
      body,
      headers: {
        deviceUuid
      }
    });
  }

  initializeUssdFund(
    amount, bankCode, checksum, phone, deviceUuid, paymentItemCode,
  ) {
    return this.apiRequester.post({
      endpoint: 'v2/webpay/ussd/initialize',
      body: {
        amount,
        bankCode,
        checksum,
        customerId: phone,
        paymentItemCode,
      },
      headers: {
        deviceUuid,
      },
    });
  }
  
  proceedUssdFund(body, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v2/webpay/ussd/proceed',
      body,
      headers: {
        deviceUuid
      }
    });
  }

  initiateDistribute(transferRequestList, deviceUuid) {
    
    return this.apiRequester.post({
      endpoint: 'v1/wallet/funds/distribute',
      body: {
        w2WRequestList: transferRequestList,
        narration: transferRequestList[0].narration,
        terminalId: transferRequestList[0].terminalId,
        paymentItemCode: transferRequestList[0].paymentItemCode,
        totalAmount: transferRequestList[0].amount
      },
      headers: {
        deviceUuid
      }
    });
  }

  processDistribute(transferRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/wallet/funds/distribute',
      body: {
        ...transferRequest
      },
      headers: {
        deviceUuid
      }
    });
  }

  initiateTransferToAgent(transferRequest, checksum, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/wallet/funds/transfer',
      body: {
        ...transferRequest,
        checksum
      },
      headers: {
        deviceUuid
      }
    });
  }

  processTransferToAgent(transferRequest, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/wallet/funds/transfer',
      body: {
        ...transferRequest
      },
      headers: {
        deviceUuid
      }
    });
  }

  processUssdCashOut(cashOutData, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/cash-out/proceed',
      body: cashOutData,
      headers: {
        deviceUuid,
      },
    });
  }

  processPaycodeCashOut(cashOutData, deviceUuid) {
    return this.apiRequester.post({
      endpoint: 'v1/cash-out/pay-code/proceed',
      body: cashOutData,
      headers: {
        deviceUuid,
      },
    });
  }
}
