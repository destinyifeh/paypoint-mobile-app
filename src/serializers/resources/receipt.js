import moment from "moment";

import {
  PENDING_TRANSACTION_STATUS_CODE,
  TRANSACTION_STATUS_LABELS,
} from "../../constants";
import { ENVIRONMENT, IKEDC_CODES } from "../../constants/api-resources";
import { NGN } from "../../constants/currencies";
import AllNetworkPaymentCodes from "../../fixtures/network-payments-code";
import AllNetworkPaymentCodesEpin from "../../fixtures/network-payments-code-epin.json";
import amountField from "../../fragments/amount-field";
import { convertNgkToNgn } from "../../utils/converters/currencies";

const NetworkPaymentCodes = AllNetworkPaymentCodes[ENVIRONMENT];
const NetworkPaymentCodesEPin = AllNetworkPaymentCodesEpin[ENVIRONMENT];

function processPins(pins, paymentCode) {
  console.log({ paymentCode });
  if (IKEDC_CODES.includes(paymentCode)) {
    if (pins?.length > 25) {
      const splitPins = pins.split(";");

      const fields = {};
      splitPins[0] ? (fields["Activation Token 1"] = splitPins[0]) : "";
      splitPins[1] ? (fields["Activation Token 2"] = splitPins[1]) : "";
      splitPins[2] ? (fields["Credit Token"] = splitPins[2]) : "";
      return fields;
    } else {
      return { Token: pins };
    }
  } else {
    return { PIN: pins };
  }
}

export function formatReceiptFieldsAsString(fields) {
  let result = "";

  fields.map((section) => {
    Object.keys(section).length &&
      Object.keys(section).map((key) => {
        const value = section[key];
        result += `${key.toUpperCase()}: ${value}\n`;
      }, (result += "-------------------------------\n"));
  });

  return result;
}

/** Receipt Serializer for Reporting Transaction History. */
export class TransactionHistoryReceiptSerializer {
  getBillsReceiptFields(data) {
    const address = data.customerAddress;
    const customerId = data.customerId;
    let customerIdField = "Customer ID";
    try {
      customerIdField =
        data.paymentItemCode === "051727101" ||
        data.paymentItemCode === "04393801"
          ? "Account Number"
          : data.paymentItemCode === "051722602" ||
            data.paymentItemCode === "04393701"
          ? "Meter Number"
          : "Customer ID";
    } catch {}
    const customerName = `${data.customerFirstName} ${data.customerLastName}`;
    const phone = data.customerMsisdn;
    const pin = data.pin;
    const productName = data.narration;
    const serviceOption = data.serviceOptionName;

    return [
      {
        "Customer Name": customerName,
        "Phone Number": phone,
        ...(Boolean(address) && { Address: address }),
      },
      {
        "Biller Name": productName,
        ...(Boolean(serviceOption) && { "Service Option": serviceOption }),
        [customerIdField]: customerId,
        ...(Boolean(pin) && { ...processPins(pin, data.paymentItemCode) }),
        // IKEJA ELECTRIC fields conditionally comes in here
        // just like PIN and Address
      },
    ];
  }

  getCashInReceiptFields(data) {
    const address = data.customerAddress;
    const customerIdField = "Customer ID";
    const customerId = data.customerId;
    const phone = data.customerMsisdn;
    const pin = data.pin;

    return [
      {
        "Phone Number": phone,
        ...(Boolean(address) && { Address: address }),
      },
      {
        [customerIdField]: customerId,
        PIN: pin,
      },
    ];
  }

  getDistributeReceiptFields(data) {
    const beneficiaryEmail = data.customerEmail;
    const customerId = data.customerId;
    const pin = data.pin;

    return [
      {
        "Phone Number": customerId,
        ...(Boolean(beneficiaryEmail) && { Email: beneficiaryEmail }),
        ...(Boolean(pin) && { PIN: pin }),
      },
    ];
  }

  getFundReceiptFields(data) {
    const address = data.customerAddress;
    const customerId = data.customerId;
    const customerIdField = "Customer ID";
    const customerName = data.customerFirstName || data.agentName;
    const email = data.beneficiaryEmail;
    const phone = data.customerMsisdn;
    const productName = data.narration;

    return [
      {
        "Customer Name": customerName,
        "Phone Number": phone,
        ...(Boolean(email) && { Email: email }),
        "Biller Name": productName,
        ...(Boolean(address) && { Address: address }),
      },
      {
        [customerIdField]: customerId,
      },
    ];
  }

  getRechargeReceiptFields(data) {
    const network = data.narration;
    const phone = data.customerMsisdn;
    const pin = data.pin;
    const serviceOption = data.serviceOptionName;

    return [
      {
        Network: network,
        ...(Boolean(serviceOption) && { "Service Option": serviceOption }),
        "Phone Number": phone,
        ...(Boolean(pin) && { PIN: pin }),
      },
    ];
  }

  getTransferToAccountReceiptFields(data) {
    const accountNumber = data.beneficiaryAccountNumber;
    const bankName = data.bankName;
    const beneficiaryName = data.beneficiaryName;
    const beneficiaryPhone = data.beneficiaryMobileNumber;
    const narration = data.narration;

    return [
      {
        Bank: bankName,
        "Account Number": accountNumber,
        "Beneficiary Name": beneficiaryName,
        "Beneficiary Phone": beneficiaryPhone,
        Remark: narration,
      },
    ];
  }

  getNipTransferToAccountReceiptFields(data) {
    const formData = data;

    const beneficiaryFullName = `${formData?.beneficiaryFirstName} ${
      formData?.beneficiaryLastName
    }`;

    const accountNumber = formData.beneficiaryAccountNumber;
    const bankName = formData.bankName;
    const beneficiaryName = beneficiaryFullName;
    const beneficiaryPhone = formData.beneficiaryMobileNumber;

    return [
      {
        Bank: bankName,
        "Account Number": accountNumber,
        "Beneficiary Name": beneficiaryName,
        "Beneficiary Phone": beneficiaryPhone,
      },
    ];
  }

  getTransferToAgentReceiptFields(data) {
    const beneficiaryEmail = data.beneficiaryEmail;
    const beneficiaryFirstName = data.beneficiaryFirstName;
    const beneficiaryLastName = data.beneficiaryLastName;
    const beneficiaryName = data.beneficiaryName;
    const beneficiaryPhone = data.beneficiaryPhone;
    const pin = data.pin;

    return [
      {
        "Beneficiary Name": `${beneficiaryFirstName} ${beneficiaryLastName}`,
        "Beneficiary Business Name": beneficiaryName,
        "Phone Number": beneficiaryPhone,
        ...(Boolean(beneficiaryEmail) && { Email: beneficiaryEmail }),
        ...(Boolean(pin) && { PIN: pin }),
      },
    ];
  }

  getReceiptFields(data) {
    const amount = data.amount;

    let transactionTypeFields = null;
    switch (data.transactionType) {
      case "BILLS":
        transactionTypeFields = this.getBillsReceiptFields(data);
        break;
      case "CASH_IN":
        transactionTypeFields = this.getCashInReceiptFields(data);
        break;
      case "DISTRIBUTE":
        transactionTypeFields = this.getDistributeReceiptFields(data);
        break;
      case "FUND":
        transactionTypeFields = this.getFundReceiptFields(data);
        break;
      case "RECHARGE":
        transactionTypeFields = this.getRechargeReceiptFields(data);
        break;
      case "TRANSFER_CASH_IN":
        transactionTypeFields = this.getTransferToAccountReceiptFields(data);
        data["transactionType"] = "CASH_IN";
        break;
      case "FUND_TRANSFER_UNIFIED":
        transactionTypeFields = data.bankName
          ? this.getTransferToAccountReceiptFields(data)
          : this.getTransferToAgentReceiptFields(data);
        break;
      case "NIP":
        transactionTypeFields = this.getNipTransferToAccountReceiptFields(data);
        break;
    }

    return [
      ...(Boolean(transactionTypeFields) ? transactionTypeFields : []),
      {
        "Transaction Date": data.formattedDateTime,
        "Transaction Type": data.transactionType,
        "Transaction Ref": data.transactionRef,
        ...(Boolean(data.parentReference) && {
          "Parent Ref": data.parentReference,
        }),
        "Transaction Status": data.statusCode,
      },
      {
        Amount: amount,
      },
      {
        // "extra" will already have been parsed by transaction serializer
        ...(Boolean(data.extra) ? data.extra : {}),
      },
    ];
  }
}

/** Receipt Serializer for receipts issued after a transaction. */
export class TransactionReceiptSerializer {
  getBillsReceiptFields(data) {
    const address = data.payment.billsPaymentRequest.address
      ? data.payment.billsPaymentRequest.address
      : data.form.address;
    const selectedSubOption = data.selectedSubOption;
    const subOptionsName = data.subOptionsName;
    const customerIdField = data.meta.selectedBillerOption.customerIdField;
    const pin = data.processPaymentResponse.pin;
    const customerName = data.payment.billsPaymentRequest.customerName;
    return [
      {
        ...(Boolean(customerName) && {
          "Customer Name": data.payment.billsPaymentRequest.customerName,
        }),
        "Phone Number": data.form.phone,
        ...(Boolean(address) && { Address: address }),
      },
      {
        "Biller Name": data.meta.selectedBillerOption.serviceName,
        "Service Option": data.meta.selectedBillerOption.name,
        [customerIdField]: data.form.customerId,
        ...(Boolean(selectedSubOption)
          ? { [subOptionsName]: selectedSubOption }
          : {}),
        ...(Boolean(pin)
          ? { ...processPins(pin, data.form.paymentItemCode.paymentCode) }
          : {}),
        // IKEJA ELECTRIC fields conditionally comes in here
        // just like PIN and Address
      },
    ];
  }

  getRechargeReceiptFields(data) {
    const { selectedBillerOption } = data.meta;

    const isData = Boolean(selectedBillerOption.name);
    const paymentCode = data.form.paymentItemCode;
    const pin = data.processPaymentResponse.pin;

    let networkName = "";
    try {
      networkName =
        selectedBillerOption && selectedBillerOption.name
          ? selectedBillerOption.name
          : NetworkPaymentCodes.find(
              (value) => parseInt(value.payment_code) === parseInt(paymentCode)
            ).name;
    } catch (e) {
      networkName = NetworkPaymentCodesEPin.find(
        (value) => parseInt(value.payment_code) === parseInt(paymentCode)
      ).name;
    }

    return [
      {
        [isData ? "Data Plan" : "Network"]: networkName,
        "Phone Number": data.form.phone,
        ...(Boolean(pin) && { PIN: pin }),
      },
    ];
  }

  getCashInReceiptFields(data) {
    const address = data.payment.billsPaymentRequest.address;
    const customerId = data.form.customerId;
    const customerIdField = data.meta.selectedBillerOption.customerIdField;
    const pin = data.processPaymentResponse.pin;

    return [
      {
        "Phone Number": data.form.phone,
        ...(Boolean(address) && { Address: address }),
      },
      {
        [customerIdField]: customerId,
        ...(Boolean(pin) && { PIN: pin }),
      },
    ];
  }

  getNipTransferToAccountReceiptFields(data) {
    const formData = data.form;

    const accountNumber = formData.accountNumber;
    const bankName = formData.bankName;
    const beneficiaryName = formData.beneficiaryName;
    const beneficiaryPhone = formData.beneficiaryPhone;
    const remark = formData.remark;
    data.processPaymentResponse.requestReference =
      data.processPaymentResponse.transactionRef;

    return [
      {
        Bank: bankName,
        "Account Number": accountNumber,
        "Beneficiary Name": beneficiaryName,
        "Beneficiary Phone": beneficiaryPhone,
        Remark: remark,
      },
    ];
  }

  getTransferToAccountReceiptFields(data) {
    return [
      {
        Bank: data.form.bankName,
        "Account Number": data.form.accountNumber,
        "Beneficiary Name": data.form.beneficiaryName,
        "Beneficiary Phone": data.form.beneficiaryPhone,
        Remark: data.form.remark,
      },
    ];
  }

  getTransferToAgentReceiptFields(data) {
    const numberOfRecipients =
      data.processPaymentResponse?.w2WRequestList?.length;

    return [
      {
        "Beneficiary Name": !numberOfRecipients
          ? data.processPaymentResponse.beneficiaryName
          : numberOfRecipients === 1
          ? data.processPaymentResponse.w2WRequestList[0].beneficiaryName
          : `Multiple Recipients (${numberOfRecipients})`,
        "Phone Number": !numberOfRecipients
          ? data.processPaymentResponse.beneficiaryPhone
          : numberOfRecipients === 1
          ? data.processPaymentResponse.w2WRequestList[0].beneficiaryPhone
          : `Multiple Recipients (${numberOfRecipients})`,
      },
    ];
  }

  getTransactionType(data) {
    switch (data.category) {
      case "Pay a Bill":
        return "BILLS";
      case "Airtime & Data":
        return "RECHARGE";
      case "Send Money":
        return data.subCategory.name === "Distribute"
          ? "DISTRIBUTE"
          : "FUND_TRANSFER_UNIFIED";
      case "Cash In":
        return "CASH IN";
      default:
        return data.category.toUpperCase();
    }
  }

  getPaycodeWithdrawReceiptFields(data) {
    return [
      {
        "Customer Name": data.form.customerName,
        "Customer Phone": data.form.customerPhoneNo,
        "Customer Email": data.form.customerEmail,
        "Subscriber ID": data.form.subscriberId,
      },
    ];
  }

  getUSSDWithdrawReceiptFields(data) {
    return [
      {
        "Phone Number": data.form.phone,
        "Bank Name": data.form.bankName,
      },
    ];
  }

  getReceiptFields(data) {
    const responseCode =
      data.processPaymentResponse.code || PENDING_TRANSACTION_STATUS_CODE;

    let transactionType = this.getTransactionType(data);
    const resolvedTransactionType =
      (data.payment.transactionType === "NIP" && "NIP") ||
      (data.payment.transactionType === "TRANSFER" && "TRANSFER");

    const extra = {};
    try {
      const processedExtra = data.processPaymentResponse.pinExtras
        ? this.serializeExtraData(
            JSON.parse(data.processPaymentResponse.pinExtras)
          )
        : {};

      if (Object.keys(processedExtra).length > 0) {
        Object.keys(processedExtra).map(
          (value) => (extra[value] = processedExtra[value])
        );
      }
    } catch (e) {}

    let transactionTypeFields = null;

    switch (transactionType) {
      case "BILLS":
        transactionTypeFields = this.getBillsReceiptFields(data);
        break;
      case "CASH_IN":
        transactionTypeFields = this.getCashInReceiptFields(data);
        break;
      case "DISTRIBUTE":
        transactionTypeFields = this.getTransferToAgentReceiptFields(data);
        break;
      case "RECHARGE":
        transactionTypeFields = this.getRechargeReceiptFields(data);
        break;
      case "TRANSFER_CASH_IN":
        transactionTypeFields = this.getTransferToAccountReceiptFields(data);
        transactionType = "CASH_IN";
        break;
      case "FUND_TRANSFER_UNIFIED":
        transactionTypeFields = data.form.bankName
          ? this.getTransferToAccountReceiptFields(data)
          : this.getTransferToAgentReceiptFields(data);
        break;
      case "NIP":
        transactionTypeFields = this.getNipTransferToAccountReceiptFields(data);
        break;
      case "CASH_OUT":
        transactionTypeFields =
          data.subCategory.name === "Via USSD"
            ? this.getUSSDWithdrawReceiptFields(data)
            : this.getPaycodeWithdrawReceiptFields(data);
        break;
    }

    return [
      ...(Boolean(transactionTypeFields) ? transactionTypeFields : []),
      {
        "Transaction Date": moment().format("DD/MM/YYYY h:mm a"),
        "Transaction Type": resolvedTransactionType || transactionType,
        "Transaction Ref":
          data.payment.transactionReference ||
          data.payment.transactionRef ||
          data.processPaymentResponse.requestReference ||
          "N/A",
        "Transaction Status": TRANSACTION_STATUS_LABELS[responseCode],
      },
      {
        Amount: amountField(
          NGN,
          JSON.stringify(
            convertNgkToNgn(
              data.processPaymentResponse.totalAmount ||
                data.processPaymentResponse.amount ||
                data.payment.amount ||
                data.form.amount * 100
            )
          )
        ),
      },
      { ...extra },
    ];
  }

  serializeExtraData(rawExtraData) {
    const refinedExtraData = {};

    rawExtraData.map((obj) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];

      refinedExtraData[key] = value;
    });

    return refinedExtraData;
  }
}
