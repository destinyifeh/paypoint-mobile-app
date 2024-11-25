import React from "react";

import LottieView from "lottie-react-native";
import { InteractionManager, StyleSheet, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";

import { stopwatch } from "../../../../../../App";
import ActivityIndicator from "../../../../../components/activity-indicator";
import BaseForm from "../../../../../components/base-form";
import Button from "../../../../../components/button";
import FormCheckbox from "../../../../../components/form-controls/form-checkbox";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import { NIGERIA_SHORT_CODE } from "../../../../../constants";
import {
  ACCOUNT_VALIDATION_CLICK,
  ACCOUNT_VALIDATION_FAILURE,
  ACCOUNT_VALIDATION_SUCCESS,
} from "../../../../../constants/analytics";
import { ERROR_STATUS } from "../../../../../constants/api";
import { FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT } from "../../../../../constants/api-resources";
import { BLOCKER } from "../../../../../constants/dialog-priorities";
import {
  MIN_ACCOUNT_NUMBER_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from "../../../../../constants/fields";
import {
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
} from "../../../../../constants/styles";
import { logEvent } from "../../../../../core/logger";
import Banks from "../../../../../fixtures/banks";
import Transaction from "../../../../../services/api/resources/transaction";
import {
  nipService,
  platformService,
  transactionServiceV1,
} from "../../../../../setup/api";
import { getDeviceDetails } from "../../../../../utils/device";
import { flashMessage } from "../../../../../utils/dialog";
import handleErrorResponse from "../../../../../utils/error-handlers/api";
import { formatPhoneNumberToReadable } from "../../../../../utils/formatters";
import globalStyles from "../styles";

const DEFAULT_ACCOUNT_TYPE = "00";
const DEFAULT_ACCOUNT_TYPE_NIP = "NOT SURE";

class DistributeForm_ extends BaseForm {
  transaction = new Transaction();

  requiredFields = ["beneficiaryPhone", "amount"];

  componentDidUpdate() {}

  clear() {
    this.beneficiaryPicker.setState({
      fieldIsValid: false,
      value: null,
    });
    this.genderPicker.setState({
      fieldIsValid: false,
      value: null,
    });
    this.amount.clear();

    this.setState({
      form: {},
      invalidFields: [],
      isComplete: false,
      isValid: false,
    });

    super.clear();
  }

  constructor() {
    super();

    this.state = {
      agents: [],
      countryShortCode: NIGERIA_SHORT_CODE,
      disabledOptions: [],
      form: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
      recipientOptions: [],
    };

    this.clear = this.clear.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const {
      response,
      status,
    } = await platformService.getAgentsUnderAggregator();
    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      return;
    }

    this.setState({
      agents: response.content,
      recipientOptions: response.content.map(
        ({ businessName, businessPhoneNo }) => ({
          label: `${businessName} - ${formatPhoneNumberToReadable(
            businessPhoneNo
          )}`,
          value: businessPhoneNo,
        })
      ),
    });

    if (this.state.form.beneficiaryPhone) {
      const selectedAgent = this.state.agents.find(
        ({ businessPhoneNo }) =>
          businessPhoneNo === this.state.form.beneficiaryPhone
      );

      this.updateFormField({
        beneficiaryAccountNo: selectedAgent?.businessPhoneNo,
        beneficiaryAgentCode: selectedAgent?.walletRef,
        beneficiaryEmail: selectedAgent?.businessEmail,
        beneficiaryFirstName: selectedAgent?.businessName,
        beneficiaryLastName: selectedAgent?.businessName,
        beneficiaryName: selectedAgent?.businessName,
      });
    }
  }

  render() {
    const { disabledOptions, defaultFormValues } = this.props;
    const { recipientOptions } = this.state;

    return (
      <React.Fragment>
        <FormPicker
          choices={recipientOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          defaultValue={defaultFormValues?.recipient}
          disabledOptions={disabledOptions}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(beneficiaryPhone, isValid) => {
            const selectedAgent = this.state.agents.find(
              ({ businessPhoneNo }) => businessPhoneNo === beneficiaryPhone
            );

            this.updateFormField({
              beneficiaryPhone,
              beneficiaryAccountNo: selectedAgent?.accountNo,
              beneficiaryAgentCode: selectedAgent?.walletRef,
              beneficiaryEmail: selectedAgent?.businessEmail,
              beneficiaryFirstName: selectedAgent?.businessName,
              beneficiaryLastName: selectedAgent?.businessName,
              beneficiaryName: selectedAgent?.businessName,
            });
            isValid === false
              ? this.addInvalidField("beneficiaryPhone")
              : this.removeInvalidField("beneficiaryPhone");

            this.setState({
              disabledOptions: [...disabledOptions, beneficiaryPhone],
            });
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          ref={(comp) => (this.beneficiaryPicker = comp)}
          text="Beneficiary:"
          validators={{
            required: false,
          }}
        />

        <FormCheckbox
          defaultValue={defaultFormValues?.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            isValid === false
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
          ref={(comp) => (this.genderPicker = comp)}
        />

        <FormInput
          autoCompleteType="tel"
          defaultValue={defaultFormValues?.amount}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(amount, isValid) => {
            this.updateFormField({
              amount,
            });
            isValid === false
              ? this.addInvalidField("amount")
              : this.removeInvalidField("amount");
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="0.00"
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          ref={(comp) => (this.amountInput__ = comp)}
          textInputRef={(input) => (this.amount = input)}
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

class TransferToAccountForm_ extends BaseForm {
  transaction = new Transaction();

  requiredFields = [
    "accountNumber",
    "bankCode",
    "beneficiaryName",
    // "beneficiaryPhone",
    "amount",
  ];

  constructor() {
    super();

    this.state = {
      banks: Banks,
      countryShortCode: NIGERIA_SHORT_CODE,
      form: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
      nameInquirySuccess: null,
    };

    this.onSelectBank = this.onSelectBank.bind(this);
    this.fetchBanks = this.fetchBanks.bind(this);
  }

  componentDidMount() {
    this.fetchBanks();
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      setTimeout(() => this.accountNumber.focus(), 500);
    });

    this.updateFormField({
      accountType: DEFAULT_ACCOUNT_TYPE,
    });
    Banks.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }

  async fetchBanks() {
    //const { code, response, status } = await quicktellerService.getBanks();
    const { code, response, status } = await transactionServiceV1.getBanks();
    const banksList = response || [];
    banksList.sort((a, b) => {
      if (a.bankName.toLowerCase() > b.bankName.toLowerCase()) {
        return 1;
      }

      if (a.bankName.toLowerCase() < b.bankName.toLowerCase()) {
        return -1;
      }

      return 0;
    });

    this.setState({
      banks: banksList,
    });
  }

  async onSelectBank(bankCode) {
    this.activityIndicator.open();

    logEvent(ACCOUNT_VALIDATION_CLICK);

    this.setState({
      nameInquirySuccess: null,
    });

    stopwatch.start();
    const { deviceUuid } = await getDeviceDetails();
    const { status, response } = await this.transaction.doAccountInquiry(
      bankCode,
      this.state.form.accountNumber,
      deviceUuid
    );

    stopwatch.stop();

    if (status === ERROR_STATUS) {
      logEvent(ACCOUNT_VALIDATION_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
      });

      this.setState({
        form: {
          ...this.state.form,
          beneficiaryName: null,
        },
        isLoading: false,
        nameInquirySuccess: false,
      });
    } else {
      logEvent(ACCOUNT_VALIDATION_SUCCESS, {
        secondsElapsed: stopwatch.secondsElapsed,
      });

      this.setState({
        form: {
          ...this.state.form,
          beneficiaryName: response.accountName,
        },
        nameInquirySuccess: true,
      });

      setTimeout(() => {
        this.activityIndicator && this.activityIndicator.close();
      }, 3000);

      setTimeout(() => {
        this.beneficiaryPhone.focus();
      }, 3300);
    }
  }

  render() {
    if (!this.state.animationsDone) {
      return <View />;
    }

    return (
      <React.Fragment>
        <RBSheet
          animationType="fade"
          ref={(ref) => {
            this.activityIndicator = ref;
          }}
          closeOnDragDown={false}
          closeOnPressBack={false}
          closeOnPressMask={false}
          height={400}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          {this.state.nameInquirySuccess && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../animations/checked-done-2.json")}
              />
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text center green>
                  Name Inquiry Successful.
                </Text>
                <Text big center bold>
                  {`${this.state.form.beneficiaryName}`}
                </Text>
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === false && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../animations/14651-error-animation (2).json")}
              />
              <Text big bold center red style={{ marginTop: 10 }}>
                Account name confirmation failed. Please, retry.
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() => this.onSelectBank(this.state.form.bankCode)}
                  title="RETRY"
                  titleStyle={{
                    color: COLOUR_RED,
                  }}
                  transparent
                />

                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() => this.activityIndicator.close()}
                  title="CANCEL"
                  titleStyle={{
                    color: COLOUR_GREY,
                  }}
                  transparent
                />
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === null && (
            <React.Fragment>
              <ActivityIndicator
                containerStyle={{
                  flex: null,
                }}
              />
              <Text style={{ marginTop: 5 }}>Verifying account details</Text>
            </React.Fragment>
          )}
        </RBSheet>

        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.accountNumber}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          maxLength={MIN_ACCOUNT_NUMBER_LENGTH}
          onChangeText={(accountNumber, isValid) => {
            this.updateFormField({
              accountNumber,
            });
            isValid === false
              ? this.addInvalidField("accountNumber")
              : this.removeInvalidField("accountNumber");
            isValid &&
              this.state.form.bankCode &&
              this.onSelectBank(this.state.form.bankCode);
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1234567890"
          propagateError={this.props.propagateFormErrors}
          text="Account Number:"
          textInputRef={(input) => (this.accountNumber = input)}
          validators={{
            length: MIN_ACCOUNT_NUMBER_LENGTH,
            required: true,
          }}
        />
        <FormPicker
          choices={this.state.banks.map((option) => ({
            label: option.bankName,
            value: option.cbnCode,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(bankCode, isValid) => {
            const bank = this.state.banks.find(
              (bank) => bankCode == bank.cbnCode
            );

            this.updateFormField({
              bankCode,
              bankName: bank?.bankName,
              bank: bank,
            });
            isValid === false
              ? this.addInvalidField("bankCode")
              : this.removeInvalidField("bankCode");
            const isAccountNumberValid = !this.state.invalidFields.includes(
              "accountNumber"
            );
            isAccountNumberValid && this.onSelectBank(bankCode);
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Bank:"
          validators={{
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.beneficiaryName}
          disabled={
            FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT
              ? true
              : this.state.nameInquirySuccess
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(beneficiaryName, isValid) => {
            this.updateFormField({ beneficiaryName });
            !isValid
              ? this.addInvalidField("beneficiaryName")
              : this.removeInvalidField("beneficiaryName");
          }}
          onSubmitEditing={() => {
            this.beneficiaryPhone.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="John"
          propagateError={this.props.propagateFormErrors}
          text="Beneficiary Name:"
          textInputRef={(input) => (this.beneficiaryName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.beneficiaryPhone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(beneficiaryPhone, isValid) => {
            this.updateFormField({
              beneficiaryPhone,
            });
            isValid === false
              ? this.addInvalidField("beneficiaryPhone")
              : this.removeInvalidField("beneficiaryPhone");
          }}
          onSubmitEditing={() => {
            this.remark.focus();
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="xxxxxxxxxxx"
          propagateError={this.props.propagateFormErrors}
          text="Beneficiary Phone:"
          textInputRef={(input) => (this.beneficiaryPhone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            //required: true,
          }}
        />
        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.amount}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(amount, isValid) => {
            this.updateFormField({
              amount,
            });
            isValid === false
              ? this.addInvalidField("amount")
              : this.removeInvalidField("amount");
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="0.00"
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          textInputRef={(input) => (this.amount = input)}
          validators={{
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.remark}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(remark, isValid) => {
            this.updateFormField({ remark });
            !isValid
              ? this.addInvalidField("remark")
              : this.removeInvalidField("remark");
          }}
          onSubmitEditing={() => {
            this.amount.focus();
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Remark"
          propagateError={this.props.propagateFormErrors}
          text="Remark:"
          textInputRef={(input) => (this.remark = input)}
        />
        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            isValid === false
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
        />
      </React.Fragment>
    );
  }
}

class NipTransferToAccountForm_ extends BaseForm {
  transaction = new Transaction();

  requiredFields = [
    "accountNumber",
    "institutionCode",
    "beneficiaryName",
    "beneficiaryPhone",
    "amount",
  ];

  constructor() {
    super();

    this.state = {
      banks: Banks,
      countryShortCode: NIGERIA_SHORT_CODE,
      form: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
      nameInquirySuccess: null,
    };
    this.fetchBanks = this.fetchBanks.bind(this);
    this.onSelectBank = this.onSelectBank.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      setTimeout(() => this.accountNumber.focus(), 500);
    });

    this.updateFormField({
      accountType: DEFAULT_ACCOUNT_TYPE_NIP,
    });

    this.fetchBanks();
  }

  async fetchBanks() {
    const { deviceUuid } = await getDeviceDetails();
    const { code, response, status } = await nipService.getBanks(deviceUuid);

    const banksList = response.aliases || [];
    banksList.sort((a, b) => {
      if (a.institutionName.toLowerCase() > b.institutionName.toLowerCase()) {
        return 1;
      }

      if (a.institutionName.toLowerCase() < b.institutionName.toLowerCase()) {
        return -1;
      }

      return 0;
    });

    this.setState({
      banks: banksList,
    });
  }

  async onSelectBank(institutionCode) {
    this.activityIndicator.open();

    logEvent(ACCOUNT_VALIDATION_CLICK);

    this.setState({
      nameInquirySuccess: null,
    });

    stopwatch.start();

    const { deviceUuid } = await getDeviceDetails();
    const { status, response } = await nipService.getAccountName(
      this.state.form.accountNumber,
      institutionCode,
      deviceUuid
    );

    stopwatch.stop();

    if (status === ERROR_STATUS) {
      logEvent(ACCOUNT_VALIDATION_FAILURE, {
        secondsElapsed: stopwatch.secondsElapsed,
      });

      this.setState({
        form: {
          ...this.state.form,
          beneficiaryName: null,
        },
        isLoading: false,
        nameInquirySuccess: false,
      });
    } else {
      logEvent(ACCOUNT_VALIDATION_SUCCESS, {
        secondsElapsed: stopwatch.secondsElapsed,
      });

      this.setState({
        form: {
          ...this.state.form,
          beneficiaryName: response.beneficiaryName,
        },
        nameInquirySuccess: true,
      });

      setTimeout(() => {
        this.activityIndicator && this.activityIndicator.close();
      }, 3000);

      setTimeout(() => {
        this.beneficiaryPhone.focus();
      }, 3300);
    }
  }

  render() {
    if (!this.state.animationsDone) {
      return <View />;
    }

    return (
      <React.Fragment>
        <RBSheet
          animationType="fade"
          ref={(ref) => {
            this.activityIndicator = ref;
          }}
          closeOnDragDown={false}
          closeOnPressBack={false}
          closeOnPressMask={false}
          height={400}
          duration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          {this.state.nameInquirySuccess && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../animations/checked-done-2.json")}
              />
              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text center green>
                  Name Inquiry Successful.
                </Text>
                <Text big center bold>
                  {`${this.state.form.beneficiaryName}`}
                </Text>
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === false && (
            <React.Fragment>
              <LottieView
                autoPlay={true}
                loop={false}
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  height: 230,
                  top: 0,
                  width: 230,
                }}
                source={require("../../../../../animations/14651-error-animation (2).json")}
              />
              <Text big bold center red style={{ marginTop: 10 }}>
                Account name confirmation failed. Please, retry.
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() =>
                    this.onSelectBank(this.state.form.institutionCode)
                  }
                  title="RETRY"
                  titleStyle={{
                    color: COLOUR_RED,
                  }}
                  transparent
                />

                <Button
                  containerStyle={{ width: "30%" }}
                  onPressOut={() => this.activityIndicator.close()}
                  title="CANCEL"
                  titleStyle={{
                    color: COLOUR_GREY,
                  }}
                  transparent
                />
              </View>
            </React.Fragment>
          )}
          {this.state.nameInquirySuccess === null && (
            <React.Fragment>
              <ActivityIndicator
                containerStyle={{
                  flex: null,
                }}
              />
              <Text style={{ marginTop: 5 }}>Verifying account details</Text>
            </React.Fragment>
          )}
        </RBSheet>

        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.accountNumber}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          maxLength={MIN_ACCOUNT_NUMBER_LENGTH}
          onChangeText={(accountNumber, isValid) => {
            this.updateFormField({
              accountNumber,
            });
            isValid === false
              ? this.addInvalidField("accountNumber")
              : this.removeInvalidField("accountNumber");
            isValid &&
              this.state.form.bankCode &&
              this.onSelectBank(this.state.form.bankCode);
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="1234567890"
          propagateError={this.props.propagateFormErrors}
          text="Account Number:"
          textInputRef={(input) => (this.accountNumber = input)}
          validators={{
            length: MIN_ACCOUNT_NUMBER_LENGTH,
            required: true,
          }}
        />
        <FormPicker
          choices={this.state.banks.map((option) => ({
            label: option.institutionName,
            value: option.alias,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(alias, isValid) => {
            this.updateFormField({
              institutionCode: alias,
              bankName: this.state.banks.find((bank) => alias === bank.alias)
                .institutionName,
            });
            isValid === false
              ? this.addInvalidField("institutionCode")
              : this.removeInvalidField("institutionCode");
            const isAccountNumberValid = !this.state.invalidFields.includes(
              "accountNumber"
            );
            isAccountNumberValid && this.onSelectBank(alias);
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Bank:"
          validators={{
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.beneficiaryName}
          disabled={
            FORCE_ACCOUNT_VALIDATION_ON_TRANSFER_TO_ACCOUNT
              ? true
              : this.state.nameInquirySuccess
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(beneficiaryName, isValid) => {
            this.updateFormField({ beneficiaryName });
            !isValid
              ? this.addInvalidField("beneficiaryName")
              : this.removeInvalidField("beneficiaryName");
          }}
          onSubmitEditing={() => {
            this.beneficiaryPhone.focus();
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="John"
          propagateError={this.props.propagateFormErrors}
          text="Beneficiary Name:"
          textInputRef={(input) => (this.beneficiaryName = input)}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: "name",
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.beneficiaryPhone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(beneficiaryPhone, isValid) => {
            this.updateFormField({
              beneficiaryPhone,
            });
            isValid === false
              ? this.addInvalidField("beneficiaryPhone")
              : this.removeInvalidField("beneficiaryPhone");
          }}
          onSubmitEditing={() => {
            this.remark.focus();
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="xxxxxxxxxxx"
          propagateError={this.props.propagateFormErrors}
          text="Beneficiary Phone:"
          textInputRef={(input) => (this.beneficiaryPhone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.amount}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(amount, isValid) => {
            this.updateFormField({
              amount,
            });
            isValid === false
              ? this.addInvalidField("amount")
              : this.removeInvalidField("amount");
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="0.00"
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          textInputRef={(input) => (this.amount = input)}
          validators={{
            required: true,
          }}
        />
        <FormInput
          autoCompleteType="name"
          defaultValue={this.state.form.remark}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(remark, isValid) => {
            this.updateFormField({ remark });
            !isValid
              ? this.addInvalidField("remark")
              : this.removeInvalidField("remark");
          }}
          onSubmitEditing={() => {
            this.amount.focus();
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="Remark"
          propagateError={this.props.propagateFormErrors}
          text="Remark:"
          textInputRef={(input) => (this.remark = input)}
        />
        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            isValid === false
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
        />
      </React.Fragment>
    );
  }
}

class TransferToAgentForm_ extends BaseForm {
  requiredFields = ["beneficiaryPhone", "amount"];

  state = {
    countryShortCode: NIGERIA_SHORT_CODE,
    form: {},
    invalidFields: [],
    isComplete: null,
    isValid: null,
  };

  componentDidMount() {
    setTimeout(() => this.beneficiaryPhone.focus(), 300);
  }

  render() {
    return (
      <React.Fragment>
        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.beneficiaryPhone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(beneficiaryPhone, isValid) => {
            this.updateFormField({
              beneficiaryPhone,
            });
            isValid === false
              ? this.addInvalidField("beneficiaryPhone")
              : this.removeInvalidField("beneficiaryPhone");
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          text="Beneficiary Phone:"
          textInputRef={(input) => (this.beneficiaryPhone = input)}
          validators={{
            length: MIN_NIGERIA_PHONE_LENGTH,
            required: true,
          }}
        />

        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={["Male", "Female"]}
          onSelect={(gender, isValid) => {
            this.updateFormField({ gender });
            isValid === false
              ? this.addInvalidField("gender")
              : this.removeInvalidField("gender");
          }}
          propagateError={this.props.propagateFormErrors}
        />

        <FormInput
          autoCompleteType="tel"
          defaultValue={this.state.form.amount}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(amount, isValid) => {
            this.updateFormField({
              amount,
            });
            isValid === false
              ? this.addInvalidField("amount")
              : this.removeInvalidField("amount");
          }}
          optional={true}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="0.00"
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          textInputRef={(input) => (this.amount = input)}
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    disabledOptions: state.transactions.disabledPrimaryChoices,
    propagateFormErrors: state.forms.propagateFormErrors,
  };
}

export const DistributeForm = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(DistributeForm_);

export const NipTransferToAccountForm = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(NipTransferToAccountForm_);

export const TransferToAccountForm = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TransferToAccountForm_);

export const TransferToAgentForm = connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TransferToAgentForm_);

const styles = StyleSheet.create({
  ...globalStyles,
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: COLOUR_WHITE,
    padding: 20,
    paddingBottom: 30,
    flex: 0.8,
  },
  but: {
    padding: 10,
    elevation: 5,
    marginTop: 10,
    marginBottom: 40,
    flex: 0.2,
  },
});
