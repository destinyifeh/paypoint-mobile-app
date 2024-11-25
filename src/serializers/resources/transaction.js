import moment from "moment";

import { NGN } from "../../constants/currencies";
import Banks from "../../fixtures/banks";
import amountField from "../../fragments/amount-field";
import { convertNgkToNgn } from "../../utils/converters/currencies";

const LINKED_REVERSAL_TRANSACTION_STATUSES = ["Failed"];
const REQUERY_TRANSACTION_STATUSES = ["Pending"];
const TRANSACTION_TYPES_WITHOUT_REVERSAL = ["FUND", "PAYPOINT_FUND"];

export default class TransactionSerializer {
  normalizeStatusCode(statusCode) {
    switch (statusCode) {
      case "INITIATED":
        return "Initiated";
      case "PENDING_VALUE_PROVISIONING":
        return "Pending";
      case "CLOSED_BUT_FAILED":
        return "Failed";
      case "CLOSED_AND_SUCCESSFUL":
        return "Successful";
      default:
        return statusCode;
    }
  }

  serializeExtraFieldsFixed(data) {
    const extraData = data.extraInfoList;

    const orderedData = {};
    const refinedData = {};

    extraData.map(({ name, value }) => {
      refinedData[name] = value;
    });

    if (Object.keys(refinedData).length > 0) {
      Object.keys(refinedData).map(
        (value) => (orderedData[value] = refinedData[value])
      );
      /*
      refinedData["Vat"]? orderedData["Vat"] = refinedData["Vat"]:''
      refinedData["Deduction"]? orderedData["Deduction"] = refinedData["Deduction"]:''
      refinedData["Credit Val"]? orderedData["Credit Val"] = refinedData["Credit Val"]:''
      orderedData["Tariff Band"] = data.customerType;
      refinedData["Tariff"]? orderedData["Tariff"] = refinedData["Tariff"]:''
      refinedData["Units Purchased"]? orderedData["Units Purchased"] = refinedData["Units Purchased"]:''
      refinedData["Receipt No"]? orderedData["Receipt No"] = refinedData["Receipt No"]:''
      refinedData["Client ID"]? orderedData["Client ID"] = refinedData["Client ID"]:''
      refinedData["Terminal ID"]? orderedData["Terminal ID"] = refinedData["Terminal ID"]:''
      */
    }

    return [orderedData];
  }

  serializeExtraFields(extraData) {
    const refinedData = {};

    try {
      extraData.map(({ name, value }) => {
        refinedData[name] = value;
      });
    } catch {
      console.log("Unable to parse", extraData);
    }

    return [refinedData];
  }

  getCustomerId(data) {
    let _customerId = data.customerId;

    if (data.transactionType === "FUND_TRANSFER_UNIFIED") {
      _customerId = data.beneficiaryAccountNumber || data.customerId;
    }

    return _customerId;
  }

  get toHide() {
    return this.statusCode === "INITIATED";
  }

  getNarration(data) {
    let _narration = data.narration;

    if (data.esbRef) {
      return data.transactionType;
    }

    switch (data.transactionType) {
      case "TRANSFER_CASH_IN":
      case "FUND_TRANSFER_UNIFIED":
        if (data.bankCode) {
          _narration = (
            Banks.find((value) => value.cbnCode == data.bankCode) || {}
          ).bankName;
        } else {
          _narration = "Transfer to Agent";
        }
        break;
      default:
        break;
    }

    return _narration;
  }

  getSummaryContent({
    amount,
    availableBalance,
    extra,
    gmppRef,
    fee,
    shouldShowFee,
    transactionRef,
    agentName,
    agentSA,
    agentSP,
    bankName,
    businessName,
    consumerSP,
    creator,
    customerId,
    customerMsisdn,
    destination,
    firstName,
    lastName,
    paymentMethod,
    esbRef,
    serviceOptionName,
    source,
    transactionType,
    pin,
    maskedPan,
  }) {
    if (Boolean(transactionType)) {
      transactionType =
        transactionType == "TRANSFER_CASH_IN" ? "CASH_IN" : transactionType;
    }
    return {
      Summary: {
        "Transaction Amount": amount,
        Fee: shouldShowFee ? fee : undefined,
        "Balance After": Boolean(availableBalance)
          ? availableBalance
          : undefined,
        "Transaction Ref": Boolean(transactionRef) ? transactionRef : undefined,
        "GMPP Ref": Boolean(gmppRef) ? gmppRef : undefined,
      },
      "Transaction Details": {
        "Service Option": Boolean(serviceOptionName)
          ? serviceOptionName
          : undefined,
        "Transaction Type": transactionType ? transactionType : undefined,
        "Card Pan": Boolean(maskedPan) ? maskedPan : "N/A",
        "Customer Name":
          Boolean(firstName) || Boolean(lastName)
            ? `${firstName} ${lastName && lastName}`
            : undefined,
        "Agent SA": Boolean(agentSA) ? agentSA : undefined,
        "Agent SP": Boolean(agentSP) ? agentSP : undefined,
        "Bank Name": Boolean(bankName) ? bankName : undefined,
        "Biller Number": Boolean(customerId) ? customerId : undefined,
        "Agent Name": Boolean(creator) ? creator : undefined,
        "Customer Phone": Boolean(customerMsisdn) ? customerMsisdn : undefined,
        "Consumer SP": Boolean(consumerSP) ? consumerSP : undefined,
        "Agent Name": Boolean(agentName) ? agentName : undefined,
        "Business Name": Boolean(businessName) ? businessName : undefined,
        Destination: Boolean(destination) ? destination : undefined,
        Source: Boolean(source) ? source : undefined,
        "ESB Ref": Boolean(esbRef) ? esbRef : undefined,
        "Payment Method": Boolean(paymentMethod) ? paymentMethod : undefined,
        PIN: Boolean(pin) ? pin : undefined,
      },
    };
  }

  serializeApiData(data) {
    const isFeeCustomerBorne =
      data.borneBy && data.borneBy.toUpperCase() === "CUSTOMER";

    const shouldShowFee = isFeeCustomerBorne;
    const statusCode = this.normalizeStatusCode(data.statusCode);

    if (data.transactionType === undefined) {
      if (data.transactionTypeInt === 3) {
        data.transactionType = "RECHARGE";
      }
    }

    if (data.customerMsisdn === undefined) {
      data.customerMsisdn = data.mobileNo;
    }

    if (data.customerFirstName === undefined) {
      data.customerFirstName = "";
    }

    if (data.customerLastName === undefined) {
      data.customerLastName = "";
    }

    if (data.customerOtherName === undefined) {
      data.customerOtherName = "";
    }

    if (data.availableBalance && !isNaN(data.availableBalance)) {
      data.availableBalance = amountField(
        NGN,
        JSON.stringify(convertNgkToNgn(data.availableBalance))
      );
    }

    if (data.ledgerBalance && !isNaN(data.ledgerBalance)) {
      data.ledgerBalance = amountField(
        NGN,
        JSON.stringify(convertNgkToNgn(data.ledgerBalance))
      );
    }

    const hasExtraData = Boolean(data.extra);
    delete data.extra;

    return {
      ...data,
      amount: amountField(
        NGN,
        JSON.stringify(convertNgkToNgn(data.transactionAmount))
      ),
      canHaveReversal:
        LINKED_REVERSAL_TRANSACTION_STATUSES.includes(statusCode) &&
        !TRANSACTION_TYPES_WITHOUT_REVERSAL.includes(data.transactionType),
      customerId: this.getCustomerId(data),
      bankName: data.bankName,
      canBeRequeried: REQUERY_TRANSACTION_STATUSES.includes(statusCode),
      fee: amountField(NGN, JSON.stringify(convertNgkToNgn(data.fee))),
      firstName: data.customerFirstName
        ? data.customerFirstName
        : data.firstName,
      formattedDate: moment(data.dateCreated).format("dddd, MMMM Do YYYY"),
      formattedDateTime: moment(data.dateCreated).format("DD/MM/YYYY h:mm a"),
      lastName: data.customerLastName ? data.customerLastName : data.lastName,
      statusCode,
      total_amount: amountField(
        NGN,
        JSON.stringify(convertNgkToNgn(data.transactionAmount + data.fee))
      ),
      narration: this.getNarration(data),
      shouldShowFee,
      hasExtraData,
    };
  }

  serializeRequeriedTransaction(data) {
    return {
      "Date Created": moment(data.dateModified).format("DD/MM/YYYY h:mm a"),
      Status: data.statusCode,
      "Reversal Ref": data.reverseTransRef,
      "Amount Reversed": amountField(
        NGN,
        JSON.stringify(convertNgkToNgn(data.reverseTransAmount))
      ),
    };
  }

  serializeHistoricalData(data) {
    const dateCreated = moment(data.dateCreated).format("dddd, MMMM Do YYYY");
    const dateTimeCreated = moment(data.dateCreated).format(
      "DD/MM/YYYY h:mm a"
    );

    let statusCode = data.status;
    if (statusCode === "Fail") {
      statusCode = "Failed";
    }

    return {
      ...data,
      amount: amountField(NGN, data.cashAmount),
      formattedDate: dateCreated,
      formattedDateTime: dateTimeCreated,
      gmppRef: data.referenceId,
      narration: this.getNarration(data),
      paymentMethod: data.tokenType,
      statusCode,
      // formattedDate: `${DAYS[dateCreated.getDay()]}, ${MONTHS[dateCreated.getMonth()]} ${dateCreated.getDate()} ${dateCreated.getFullYear()}`,
    };
  }

  serializeStatementOfAccountData(data) {
    const dateCreated = moment(data.journalEntryDate).format(
      "dddd, MMMM Do YYYY"
    );
    const dateTimeCreated = moment(data.journalEntryDate).format(
      "DD/MM/YYYY h:mm a"
    );

    let statusCode = data.status;
    if (statusCode === "Fail") {
      statusCode = "Failed";
    }

    return {
      ...data,
      amount: data.creditAmount
        ? amountField(NGN, convertNgkToNgn(data.creditAmount))
        : amountField(NGN, convertNgkToNgn(data.debitAmount)),
      creditAmount: amountField(NGN, convertNgkToNgn(data.creditAmount)),
      debitAmount: amountField(NGN, convertNgkToNgn(data.debitAmount)),
      availableBalance: amountField(NGN, convertNgkToNgn(data.balance)),
      formattedDate: dateCreated,
      formattedDateTime: dateTimeCreated,
      journalDescription: data.journalDescription,
      transactionType: data.creditAmount ? "CREDIT" : "DEBIT",
      ledgerBalance: amountField(NGN, convertNgkToNgn(data.remainingBalance)),
      narration: data.narration,
      statusCode,
      maskedPan: data.maskedPan,
    };
  }
}
