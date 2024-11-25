import React from "react";
import { StyleSheet, View } from "react-native";
import FormInput from "../../../../../../../components/form-controls/form-input";

export const ComplaintFormForTransfer = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("Transferrr");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.statusCode}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Status"
        propagateError={propagateError}
        text="Transaction Status"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(maskedPan) => {
          updateFormField({ maskedPan });
        }}
        defaultValue={transaction?.maskedPan ? transaction.maskedPan : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Card Pan"
        propagateError={propagateError}
        text="Card Pan"
        validators={{
          required: true,
        }}
        disabled={true}
      />
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(rrn) => {
          updateFormField({ rrn });
        }}
        defaultValue={transaction?.rrn ? transaction.rrn : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="RRN"
        propagateError={propagateError}
        text="RRN"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(beneficiaryAccountNumber) => {
          updateFormField({ beneficiaryAccountNumber });
        }}
        defaultValue={transaction?.beneficiaryAccountNumber}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Beneficiary Account Number"
        propagateError={propagateError}
        text="Beneficiary Account Number"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(agentPhone) => {
          updateFormField({ agentPhone });
        }}
        defaultValue={transaction?.mobileNo}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Agent Phone Number"
        propagateError={propagateError}
        text="Agent Phone Number"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

export const ComplaintFormForCashout = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("CASHOUTTT");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.statusCode}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Status"
        propagateError={propagateError}
        text="Transaction Status"
        validators={{
          required: true,
        }}
        disabled={true}
      />
      {transaction?.paymentMethod !== "USSD" && (
        <>
          <FormInput
            autoCapitalize="none"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(maskedPan) => {
              updateFormField({ maskedPan });
            }}
            defaultValue={
              transaction?.maskedPan ? transaction.maskedPan : "N/A"
            }
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="Card Pan"
            propagateError={propagateError}
            text="Card Pan"
            validators={{
              required: true,
            }}
            disabled={true}
          />

          <FormInput
            autoCapitalize="none"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(rrn) => {
              updateFormField({ rrn });
            }}
            defaultValue={transaction?.rrn ? transaction.rrn : "N/A"}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="RRN"
            propagateError={propagateError}
            text="RRN"
            validators={{
              required: true,
            }}
            disabled={true}
          />

          <FormInput
            autoCapitalize="none"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(agentPhone) => {
              updateFormField({ agentPhone });
            }}
            defaultValue={transaction?.mobileNo}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="Agent Phone Number"
            propagateError={propagateError}
            text="Agent Phone Number"
            validators={{
              required: true,
            }}
            disabled={true}
          />
        </>
      )}
      {transaction?.paymentMethod === "USSD" && (
        <FormInput
          autoCapitalize="none"
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(beneficiaryPhone) => {
            updateFormField({ beneficiaryPhone });
          }}
          defaultValue={transaction?.customerMsisdn}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Beneficiary Phone Number"
          propagateError={propagateError}
          text="Beneficiary Phone Number"
          validators={{
            required: true,
          }}
          disabled={true}
        />
      )}

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

export const ComplaintFormForFunding = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("Funding");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.statusCode}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Status"
        propagateError={propagateError}
        text="Transaction Status"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(maskedPan) => {
          updateFormField({ maskedPan });
        }}
        defaultValue={transaction?.maskedPan ? transaction.maskedPan : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Card Pan"
        propagateError={propagateError}
        text="Card Pan"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

export const ComplaintFormForRecharge = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("Recharge");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        textInputRef={(input) => (transactionRef = input)}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.statusCode}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Status"
        propagateError={propagateError}
        text="Transaction Status"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(maskedPan) => {
          updateFormField({ maskedPan });
        }}
        defaultValue={transaction?.maskedPan ? transaction.maskedPan : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Card Pan"
        propagateError={propagateError}
        text="Card Pan"
        validators={{
          required: true,
        }}
        disabled={true}
      />
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(rrn) => {
          updateFormField({ rrn });
        }}
        defaultValue={transaction?.rrn ? transaction.rrn : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="RRN"
        propagateError={propagateError}
        text="RRN"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.customerMsisdn}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Customer Phone Number"
        propagateError={propagateError}
        text="Customer Phone Number"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

export const ComplaintFormForBills = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("Bills");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.statusCode}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Status"
        propagateError={propagateError}
        text="Transaction Status"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(maskedPan) => {
          updateFormField({ maskedPan });
        }}
        defaultValue={transaction?.maskedPan ? transaction.maskedPan : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Card Pan"
        propagateError={propagateError}
        text="Card Pan"
        validators={{
          required: true,
        }}
        disabled={true}
      />
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(rrn) => {
          updateFormField({ rrn });
        }}
        defaultValue={transaction?.rrn ? transaction.rrn : "N/A"}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="RRN"
        propagateError={propagateError}
        text="RRN"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionStatus) => {
          updateFormField({ transactionStatus });
        }}
        defaultValue={transaction?.customerMsisdn}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Customer Phone Number"
        propagateError={propagateError}
        text="Customer Phone Number"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

export const ComplaintNormalForm = ({
  updateFormField,
  propagateError,
  progressRatio,
  transaction,
  commentRef,
}) => {
  console.log("Normallllll");
  return (
    <View>
      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionRef) => {
          updateFormField({ transactionRef });
        }}
        defaultValue={transaction?.transactionRef}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Reference"
        propagateError={propagateError}
        text="Transaction Reference"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionAmount) => {
          updateFormField({ transactionAmount });
        }}
        defaultValue={transaction?.amount}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Amount"
        propagateError={propagateError}
        text="Transaction Amount"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionDate) => {
          updateFormField({ transactionDate });
        }}
        defaultValue={transaction?.formattedDateTime}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Date"
        propagateError={propagateError}
        text="Transaction Date"
        rightIconName={"today"}
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(transactionType) => {
          updateFormField({ transactionType });
        }}
        defaultValue={transaction?.transactionType}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Transaction Type"
        propagateError={propagateError}
        text="Transaction Type"
        validators={{
          required: true,
        }}
        disabled={true}
      />

      <FormInput
        autoCapitalize="none"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(comment) => {
          updateFormField({ comment });
        }}
        //defaultValue={this.state.form?.identificationNumber}
        multiline={true}
        maxLength={75}
        showMultiline={true}
        textAlignVertical="top"
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="Add Comments"
        propagateError={propagateError}
        text="Comments"
        textInputRef={(input) => (commentRef.current = input)}
        rightText={progressRatio}
        rightTextExist={true}
        validators={{
          required: true,
        }}
        textInputWidth="95%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
  formInputInnerContainerStyle: {
    marginTop: 0,
  },
});
