import { ENVIRONMENT } from "../../constants/api-resources";
import { NGN } from "../../constants/currencies";
import AccountTypes from "../../fixtures/account_types";
import AllNetworkPaymentCodes from "../../fixtures/network-payments-code";
import AllNetworkPaymentCodesEpin from "../../fixtures/network-payments-code-epin.json";
import NipAccountTypes from "../../fixtures/nip_account_types";
import amountField from "../../fragments/amount-field";
import { convertNgkToNgn } from "../../utils/converters/currencies";

const NetworkPaymentCodes = AllNetworkPaymentCodes[ENVIRONMENT];
const NetworkPaymentCodesEpin = AllNetworkPaymentCodesEpin[ENVIRONMENT];

export class TransactionConfirmationSerializer {
  getBillsConfirmationFields(data) {
    const address = data.payment.billsPaymentRequest.address
      ? data.payment.billsPaymentRequest.address
      : data.form.address;
    const agentCommission = amountField(
      NGN,
      JSON.stringify(
        convertNgkToNgn(data.payment.billsPaymentRequest.agentCommissionDue)
      )
    );
    const amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.billsPaymentRequest.amount))
    );
    const billerOption = data.meta.selectedBillerOption.name;
    const customerId = data.form.customerId;
    const customerIdField = data.meta.selectedBillerOption.customerIdField;
    const customerName = data.payment.billsPaymentRequest.customerName;
    const fee = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.billsPaymentRequest.fee))
    );
    const phone = data.form.phone;
    const productName = data.meta.selectedBillerOption.serviceName;
    const toShowFee = Boolean(data.payment.billsPaymentRequest.borneBy)
      ? data.payment.billsPaymentRequest.borneBy.toUpperCase() === "CUSTOMER"
      : true;

    return [
      {
        "Biller Name": productName,
        ...(Boolean(billerOption) && { "Service Option": billerOption }),
        [customerIdField]: customerId,
        ...(Boolean(data.selectedSubOption)
          ? { [data.subOptionsName]: data.selectedSubOption }
          : {}),
        // "Customer Name": customerName,
        ...(customerName && { "Customer Name": customerName }),
        "Phone Number": phone,
        Address: address,
        // IKEJA ELECTRIC fields conditionally comes in here
        // just like billerOption
      },
      {
        "Commission Due": agentCommission,
        Amount: amount,
        ...(Boolean(toShowFee) && { Fee: fee }),
      },
    ];
  }

  getRechargeConfirmationFields(data) {
    const { selectedBillerOption } = data.meta;

    console.log("RechargeConfirmationFields:", JSON.stringify(data.payment));

    const amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.rechargeRequest.amount))
    );
    const agentCommission = amountField(
      NGN,
      JSON.stringify(
        convertNgkToNgn(data.payment.rechargeRequest.agentCommissionDue)
      )
    );
    const phone = data.form.phone;
    const paymentCode = data.form.paymentItemCode;
    const isData = Boolean(selectedBillerOption.name);

    let networkName = "";
    try {
      networkName =
        selectedBillerOption && selectedBillerOption.name
          ? selectedBillerOption.name
          : NetworkPaymentCodes.find(
              (value) => parseInt(value.payment_code) === parseInt(paymentCode)
            ).name;
    } catch (e) {
      networkName = NetworkPaymentCodesEpin.find(
        (value) => parseInt(value.payment_code) === parseInt(paymentCode)
      ).name;
    }

    return [
      {
        [isData ? "Data Plan" : "Network"]: networkName,
        "Phone Number": phone,
      },
      {
        "Commission Due": agentCommission,
        Amount: amount,
      },
    ];
  }

  getPaycodeWithdrawalConfirmationFields(data) {
    const amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.amount))
    );
    const agentCommission = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.agentCommissionDue))
    );
    const customerEmail = data.payment.customerEmail;
    const customerFirstName = data.payment.customerFirstName;
    const customerLastName = data.payment.customerLastName;
    const customerPhoneNumber = data.payment.customerPhoneNo;
    const payCode = data.payment.payCode;
    const subscriberId = data.payment.subscriberId;

    return [
      {
        Email: customerEmail,
        "First Name": customerFirstName,
        "Last Name": customerLastName,
        "Phone Number": customerPhoneNumber,
        Paycode: payCode,
        "Subscriber ID": subscriberId,
      },
      {
        "Commission Due": agentCommission,
        Amount: amount,
      },
    ];
  }

  getTransferToAccountConfirmationFields(data) {
    const formData = data.form;
    const transferRequest = data.payment.transferRequest
      ? data.payment.transferRequest
      : data.payment.nipTransferRequest;
    accountNumber = formData.accountNumber;
    accountType = formData.accountType;
    amount = amountField(NGN, JSON.stringify(data.form.amount));
    agentCommission = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(transferRequest.agentCommissionDue))
    );
    bankCode = formData.bankCode;
    bankName = formData.bankName;
    beneficiaryName = formData.beneficiaryName;
    beneficiaryPhone = formData.beneficiaryPhone;
    fee = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(transferRequest.fee))
    );
    remark = formData.remark;
    const toShowFee = Boolean(transferRequest.borneBy)
      ? transferRequest.borneBy.toUpperCase() === "CUSTOMER"
      : true;

    return [
      {
        Bank: bankName,
        "Account Type": AccountTypes.find(
          (value) => parseInt(value.code) === parseInt(accountType)
        ).bankName,
        "Account Number": accountNumber,
        "Beneficiary Name": beneficiaryName,
        "Beneficiary Phone": beneficiaryPhone,
        Remark: remark,
      },
      {
        "Commission Due": agentCommission,
        Amount: amount,
        ...(toShowFee && { Fee: fee }),
      },
    ];
  }

  getNipTransferToAccountConfirmationFields(data) {
    const formData = data.form;

    accountNumber = formData.accountNumber;
    accountType = formData.accountType;
    amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.nipTransferRequest.amount))
    );
    bankCode = formData.bankCode;
    beneficiaryName =
      data.payment.nipTransferRequest.nipBeneficiary.accountName;
    beneficiaryPhone = formData.beneficiaryPhone;
    fee = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.nipTransferRequest.fee))
    );
    remark = formData.remark;

    const toShowFee = Boolean(data.payment.nipTransferRequest.borneBy)
      ? data.payment.nipTransferRequest.borneBy.toUpperCase() === "CUSTOMER"
      : true;

    return [
      {
        Bank: formData.bankName,
        "Account Type": NipAccountTypes.find(
          (value) => value.code === accountType
        ).name,
        "Account Number": accountNumber,
        "Beneficiary Name": beneficiaryName,
        "Beneficiary Phone": beneficiaryPhone,
        Remark: remark,
      },
      {
        Amount: amount,
        ...(toShowFee && { Fee: fee }),
      },
    ];
  }

  // getTransferToAgentConfirmationFields(data) {
  //   console.log(data, "data")
  //   const numberOfRecipients = data.payment.w2WRequestList[0]?.length;

  //   const amount = amountField(
  //     NGN,
  //     JSON.stringify(
  //       convertNgkToNgn(
  //         data?.payment?.w2WRequestList[0]?.amount ||
  //           data.payment.totalAmount ||
  //           data?.payment?.amount
  //       )
  //     )
  //   );
  //   const beneficiaryEmail = !numberOfRecipients
  //     ? data.payment.w2WRequestList[0]?.beneficiaryEmail ||
  //       data.payment.beneficiaryEmail
  //     : numberOfRecipients === 1
  //     ? data.payment.w2WRequestList[0]?.beneficiaryEmail
  //     : `Multiple Recipients (${numberOfRecipients})`;
  //   const beneficiaryName = !numberOfRecipients
  //     ? data.payment.w2WRequestList[0]?.beneficiaryName ||
  //       data.payment.beneficiaryName
  //     : numberOfRecipients === 1
  //     ? data.payment.w2WRequestList[0].beneficiaryName
  //     : `Multiple Recipients (${numberOfRecipients})`;
  //   const beneficiaryPhone = !numberOfRecipients
  //     ? data.payment.w2WRequestList[0]?.beneficiaryPhone ||
  //       data.payment?.beneficiaryPhone
  //     : numberOfRecipients === 1
  //     ? data.payment.w2WRequestList[0]?.beneficiaryPhone
  //     : `Multiple Recipients (${numberOfRecipients})`;
  //   const fee = amountField(
  //     NGN,
  //     JSON.stringify(convertNgkToNgn(data.payment.w2WRequestList[0]?.fee))
  //   );
  //   const toShowFee = Boolean(data.payment.w2WRequestList[0]?.borneBy)
  //     ? data.payment.w2WRequestList[0]?.borneBy.toUpperCase() === "CUSTOMER"
  //     : true;

  //   return [
  //     {
  //       "Beneficiary Name": beneficiaryName,
  //       "Phone Number": beneficiaryPhone,
  //       Email: beneficiaryEmail,
  //     },
  //     {
  //       Amount: amount,
  //       ...(Boolean(toShowFee) && { Fee: fee }),
  //     },
  //   ];
  // }

  getTransferToAgentConfirmationFields(data) {
    
    const numberOfRecipients = data.payment.w2WRequest?.w2WRequestList?.length;
    const amount = amountField(
      NGN,
      JSON.stringify(
        convertNgkToNgn(
          data?.payment?.w2WRequest?.amount ||
            data.payment.w2WRequest?.totalAmount ||
            data?.payment?.amount
        )
      )
    );

    const theFirstName = data.payment?.beneficiaryFirstName;
      const thelastName = data.payment?.beneficiaryLastName;
    const beneficiaryEmail = !numberOfRecipients
      ? data.payment.w2WRequest?.beneficiaryEmail ||
        data.payment.beneficiaryEmail
      : numberOfRecipients === 1
      ? data.payment.w2WRequest.w2WRequestList[0]?.beneficiaryEmail
      : `Multiple Recipients (${numberOfRecipients})`;
    const beneficiaryName = !numberOfRecipients
      ? data.payment.w2WRequest?.beneficiaryName || theFirstName + " " + thelastName
      : numberOfRecipients === 1
      ? data.payment.w2WRequest.w2WRequestList[0].beneficiaryName
      : `Multiple Recipients (${numberOfRecipients})`;
    const beneficiaryPhone = !numberOfRecipients
      ? data.payment.w2WRequest?.beneficiaryPhone ||
        data.payment?.beneficiaryPhone
      : numberOfRecipients === 1
      ? data.payment.w2WRequest.w2WRequestList[0]?.beneficiaryPhone
      : `Multiple Recipients (${numberOfRecipients})`;
    const fee = amountField(
      NGN,
      JSON.stringify(
        convertNgkToNgn(data.payment.w2WRequest?.fee || data.payment?.fee)
      )
    );
    const toShowFee = Boolean(data.payment.w2WRequest?.borneBy)
      ? data.payment.w2WRequest?.borneBy.toUpperCase() === "CUSTOMER"
      : true;
    return [
      {
        "Beneficiary Name": beneficiaryName,
        "Phone Number": beneficiaryPhone,
        ...(beneficiaryEmail && { Email: beneficiaryEmail }),
      },
      {
        Amount: amount,
        ...(Boolean(toShowFee) && { Fee: fee }),
      },
    ];
  }

  getUSSDWithdrawalConfirmationFields(data) {
    const amount = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.amount))
    );

    agentCommission = amountField(
      NGN,
      JSON.stringify(convertNgkToNgn(data.payment.agentCommissionDue))
    );
    return {
      amount,
      Commission: agentCommission,
      "USSD SHORT CODE": data.payment.ussdCode,
    };
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

  getConfirmationFields(data) {
    const transactionType = this.getTransactionType(data);
    let transactionTypeFields = null;

    switch (transactionType) {
      case "BILLS":
        transactionTypeFields = this.getBillsConfirmationFields(data);
        break;
      case "CASH_IN":
        transactionTypeFields = this.getBillsConfirmationFields(data);
        break;
      case "DISTRIBUTE":
        transactionTypeFields = this.getTransferToAgentConfirmationFields(data);
        break;
      case "TRANSFER":
        transactionTypeFields = this.getTransferToAgentConfirmationFields(data);
        break;
      case "RECHARGE":
        transactionTypeFields = this.getRechargeConfirmationFields(data);
        break;
      case "TRANSFER_CASH_IN":
        transactionTypeFields = this.getTransferToAccountConfirmationFields(
          data
        );
        break;
      case "FUND_TRANSFER_UNIFIED":
        transactionTypeFields = data.form.bankName
          ? this.getTransferToAccountConfirmationFields(data)
          : this.getTransferToAgentConfirmationFields(data);
        break;
      case "NIP":
        transactionTypeFields = this.getNipTransferToAccountConfirmationFields(
          data
        );
        break;
      case "CASH_OUT":
        transactionTypeFields =
          data.subCategory.name === "Via USSD"
            ? this.getUSSDWithdrawalConfirmationFields(data)
            : this.getPaycodeWithdrawalConfirmationFields(data);
        break;
    }

    return transactionTypeFields;
  }
}
