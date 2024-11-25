import React from "react";
import { Image, StyleSheet, ToastAndroid, View } from "react-native";

import LottieView from "lottie-react-native";
import Numeral from "numeral";
import { Divider } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { connect } from "react-redux";

import ActivityIndicator from "../../../../../components/activity-indicator";
import BaseForm from "../../../../../components/base-form";
import Button from "../../../../../components/button";
import FormCheckbox from "../../../../../components/form-controls/form-checkbox";
import FormInput from "../../../../../components/form-controls/form-input";
import FormPicker from "../../../../../components/form-controls/form-picker";
import Text from "../../../../../components/text";
import { NIGERIA_SHORT_CODE } from "../../../../../constants";
import { ERROR_STATUS, SUCCESS_STATUS } from "../../../../../constants/api";
import {
  MOCK_QUICKTELLER_RESPONSE,
  QUICKTELLER_API_TERMINAL_ID,
  WHITELISTED__PRELOADED_BILLERS_CODES_FOR_EDO_STATE_HOSPITAL,
} from "../../../../../constants/api-resources";
import { NGN } from "../../../../../constants/currencies";
import {
  MIN_ADDRESS_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
} from "../../../../../constants/fields";
import {
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
} from "../../../../../constants/styles";
import EdoStateHospital from "../../../../../fixtures/edo_state_hospital_collections";
import amountField from "../../../../../fragments/amount-field";
import Transaction from "../../../../../services/api/resources/transaction";
import { catalogService } from "../../../../../setup/api";
import { convertNgkToNgn } from "../../../../../utils/converters/currencies";
import handleErrorResponse from "../../../../../utils/error-handlers/api";
import globalStyles from "../styles";

function CustomerInquiryIndicator({
  customerDetails,
  customerInquirySuccess,
  onRetry,
  ref_,
  onClose,
  ...props
}) {
  return (
    <RBSheet
      animationType="fade"
      ref={ref_}
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
      {customerInquirySuccess && (
        <React.Fragment>
          <LottieView
            autoPlay={true}
            loop={false}
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              // position: 'absolute',
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
              Customer Inquiry Successful.
            </Text>
            <Text big center bold>
              {`${customerDetails?.fullName}`}
            </Text>
            <Text bigger center bold>
              {`${amountField(
                NGN,
                JSON.stringify(convertNgkToNgn(customerDetails?.amount))
              )}`}
            </Text>
          </View>
        </React.Fragment>
      )}
      {customerInquirySuccess === false && (
        <React.Fragment>
          <LottieView
            autoPlay={true}
            loop={false}
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              // position: 'absolute',
              height: 230,
              top: 0,
              width: 230,
            }}
            source={require("../../../../../animations/14651-error-animation (2).json")}
          />
          <Text
            big
            bold
            center
            red
            style={{ marginTop: 10, marginHorizontal: 10 }}
          >
            Fetch customer account failed. Please, retry!
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
              onPressOut={onRetry}
              title="RETRY"
              titleStyle={{
                color: COLOUR_RED,
              }}
              transparent
            />

            <Button
              containerStyle={{ width: "30%" }}
              onPressOut={onClose}
              title="CANCEL"
              titleStyle={{
                color: COLOUR_GREY,
              }}
              transparent
            />
          </View>
        </React.Fragment>
      )}
      {customerInquirySuccess === null && (
        <React.Fragment>
          <ActivityIndicator
            containerStyle={{
              flex: null,
            }}
          />
          <Text style={{ marginTop: 5 }}>
            Fetching customer's payable amount
          </Text>
        </React.Fragment>
      )}
    </RBSheet>
  );
}

class PayBillForm extends BaseForm {
  transaction = new Transaction();

  requiredFields = [
    "amount",
    "customerId",
    "phone",
    "paymentItemCode",
    ...(this.props.product?.urlName === "odirs" ||
    this.props.product?.urlName === "ODIRSLAND" ||
    this.props.product?.urlName === "Evreg" ||
    this.props.product?.urlName === "ondostatejudiciary"
      ? ["address"]
      : []),
  ];

  constructor(props) {
    super(props);

    this.state = {
      isCustomerIdFieldFocused: false,
      billerOptions: [],
      countryShortCode: NIGERIA_SHORT_CODE,
      customerDetails: {},
      didErrorOccurFetchingPayableAmount: null,
      form: {},
      product: props.product,
      selectedBillerOption: {},
      hasRequiredAmountBeenFetched: null,
      invalidFields: [],
      isComplete: null,
      isValid: null,
    };

    this.getOptions = this.getOptions.bind(this);
    this.getPayableAmount = this.getPayableAmount.bind(this);
    this.onContinueButtonPress = this.onContinueButtonPress.bind(this);
  }

  componentDidMount() {
    this.getOptions();
  }

  async getOptions() {
    const { product } = this.props;
    let getOptionsResponseStatus = null;
    let getOptionsResponseObj = {};

    if (MOCK_QUICKTELLER_RESPONSE) {
      getOptionsResponseStatus = SUCCESS_STATUS;
      getOptionsResponseObj = {
        supportPhoneNumber: null,
        code: "MCN",
        amountType: 0,
        name: "Multichoice Limited",
        categoryId: 2,
        categoryName: "",
        urlName: "dstv",
        description: "Pay DSTV bills",
        id: 104,
        imageUrl:
          "https://qt-v5.qa.interswitchng.com/images/Downloaded/72b21de3-d345-4a65-b231-7656a74c646c.png",
        imageName: "Multichoice Limited",
        currencyCode: "566",
        customerIdName: "Decoder Number",
        address: null,
        surcharge: 7700,
        supportEmail: "application.development@interswitchng.com",
        customerBearsFee: false,
        additionalMessage: "",
        options: [
          {
            sortOrder: 12,
            amount: 10200,
            billerType: "",
            categoryId: "2",
            code: "02",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "02",
            isAmountFixed: true,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "PREMIUM + DUAL",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10402",
            ussdShortCode: "*322*10402*DecoderNo*Amount#",
          },
          {
            sortOrder: 11,
            amount: 1312000,
            billerType: "",
            categoryId: "2",
            code: "18",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "18",
            isAmountFixed: false,
            itemCurrencyCode: null,
            itemCurrencySymbol: "",
            name: "PREMIUM + ASIA",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10418",
            ussdShortCode: "*322*10418*DecoderNo*Amount#",
          },
          {
            sortOrder: 10,
            amount: 1398000,
            billerType: "",
            categoryId: "2",
            code: "28",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "28",
            isAmountFixed: false,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "PREMIUM",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10428",
            ussdShortCode: "*322*1*10428*13980#",
          },
          {
            sortOrder: 2,
            amount: 3500,
            billerType: "",
            categoryId: "2",
            code: "08",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "08",
            isAmountFixed: false,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "ASIAN BOUQUET",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10408",
            ussdShortCode: "*322*10408*DecoderNo*Amount#",
          },
          {
            sortOrder: 1,
            amount: 300000,
            billerType: "",
            categoryId: "2",
            code: "03",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "03",
            isAmountFixed: false,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "FAMILY BOUQUET",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10403",
            ussdShortCode: "*322*10403*DecoderNo*Amount#",
          },
          {
            sortOrder: 0,
            amount: 12200,
            billerType: "",
            categoryId: "2",
            code: "01",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "01",
            isAmountFixed: true,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "Premium + Dual",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10401",
            ussdShortCode: "*322*10401*DecoderNo*Amount#",
          },
          {
            sortOrder: 0,
            amount: 11000,
            billerType: "",
            categoryId: "2",
            code: "14",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "14",
            isAmountFixed: false,
            itemCurrencyCode: "840",
            itemCurrencySymbol: "USD",
            name: "PREMIUM + FRENCH",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10414",
            ussdShortCode: "*322*1*10414*110#",
          },
          {
            sortOrder: 0,
            amount: 756000,
            billerType: "",
            categoryId: "2",
            code: "35",
            currencyCode: "566",
            currencySymbol: "NGN",
            customerIdField: "Decoder Number",
            id: "35",
            isAmountFixed: true,
            itemCurrencyCode: "566",
            itemCurrencySymbol: "NGN",
            name: "TEST",
            serviceId: 104,
            serviceName: "Multichoice Limited",
            surcharge: "7700",
            pictureId: "0",
            paymentCode: "10435",
            ussdShortCode: "*322*1*10435*7560#",
          },
        ],
      };
    } else {
      let getOptionsResponse = {};
      if (
        WHITELISTED__PRELOADED_BILLERS_CODES_FOR_EDO_STATE_HOSPITAL ==
        product.id
      ) {
        getOptionsResponseStatus = SUCCESS_STATUS;
        getOptionsResponseObj = EdoStateHospital;
      } else {
        getOptionsResponse = await catalogService.getOptions(
          product.urlName,
          QUICKTELLER_API_TERMINAL_ID
        );
        getOptionsResponseStatus = getOptionsResponse.status;
        getOptionsResponseObj = getOptionsResponse.response;
      }
    }

    if (getOptionsResponseStatus === SUCCESS_STATUS) {
      this.setState({
        errorLoading: false,
        isLoading: false,
        product: getOptionsResponseObj,
        billerOptions: getOptionsResponseObj.options,
      });

      return;
    }

    ToastAndroid.show(
      await handleErrorResponse(getOptionsResponseObj),
      ToastAndroid.LONG
    );

    this.setState({
      errorLoading: true,
      isLoading: false,
      service: getOptionsResponseObj,
    });
  }

  async getPayableAmount() {
    this.setState({
      didErrorOccurFetchingPayableAmount: null,
      hasRequiredAmountBeenFetched: false,
      isFetchingPayableAmount: true,
    });

    this.customerInquiryIndicator.open();

    const customerId = this.state.form.customerId.trim();
    const paymentCode = this.state.selectedBillerOption.paymentCode;

    const { code, status, response } = await this.transaction.doCustomerInquiry(
      customerId,
      paymentCode
    );

    console.log({ code, response });

    if (status === ERROR_STATUS) {
      this.setState({
        isFetchingPayableAmount: false,
        didErrorOccurFetchingPayableAmount: true,
      });

      return false;
    }

    setTimeout(() => this.customerInquiryIndicator.close(), 3000);

    this.setState({
      didErrorOccurFetchingPayableAmount: false,
      hasRequiredAmountBeenFetched: true,
      isFetchingPayableAmount: false,
      customerDetails: response,
      selectedBillerOption: {
        ...this.state.selectedBillerOption,
        amount: response.amount,
      },
    });

    return true;
  }

  async onContinueButtonPress() {
    if (
      this.state.hasRequiredAmountBeenFetched !== true &&
      this.state.isAmountFetchRequired
    ) {
      return await this.getPayableAmount();
    }

    return true;
  }

  selectBillerOption(option) {
    console.log("SELECTED BILLER OPTION", { option });
    const isAmountFetchRequired = option.isAmountFixed && !option.amount;
    console.log(
      "HAS REQUIRED AMOUNT BEEN FETCHED",
      isAmountFetchRequired ? false : null
    );

    this.setState({
      selectedBillerOption: option,
      isAmountFetchRequired,
      hasRequiredAmountBeenFetched: isAmountFetchRequired ? false : null,
    });
    this.updateFormField({
      paymentItemCode: option,
    });

    if (
      !this.state.invalidFields.includes("customerId") &&
      isAmountFetchRequired &&
      this.state.form.customerId
    ) {
      this.getPayableAmount();
      return;
    }

    setTimeout(() => this.customerIdField.focus(), 650);
  }

  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };

    const isComplete =
      this.requiredFields.find(
        (fieldName) =>
          newForm[fieldName] === null || newForm[fieldName] === undefined
      ) === undefined;

    this.setState({
      form: newForm,
      isComplete,
    });
  }

  customerIdFieldIsEmail() {
    if (this.state.selectedBillerOption.customerIdField === undefined) {
      return false;
    }

    return this.state.selectedBillerOption.customerIdField
      .toLowerCase()
      .includes("mail");
  }

  customerIdFieldIsPhone() {
    if (this.state.selectedBillerOption.customerIdField === undefined) {
      return false;
    }

    return (
      this.state.selectedBillerOption.customerIdField
        .toLowerCase()
        .includes("phone") ||
      this.state.selectedBillerOption.customerIdField
        .toLowerCase()
        .includes("mobile")
    );
  }

  customerIdFormInput() {
    const emailInput = (
      <FormInput
        autoCapitalize="none"
        autoCompleteType="email"
        defaultValue={this.state.form.email}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType="email-address"
        leftIcon="mail"
        onBlur={() => {
          setTimeout(() => {
            !this.state.invalidFields.includes("customerId") &&
            this.state.form.customerId &&
            this.state.isAmountFetchRequired
              ? this.getPayableAmount()
              : null;
          }, 80);
        }}
        onChangeText={(customerId, isValid) => {
          this.updateFormField({
            customerId,
            email: customerId,
          });
          isValid === false
            ? this.addInvalidField("customerId")
            : this.removeInvalidField("customerId");
        }}
        onSubmitEditing={() => {
          !this.state.invalidFields.includes("customerId") &&
          this.state.form.customerId &&
          this.state.isAmountFetchRequired
            ? this.getPayableAmount()
            : this.amount.focus();
        }}
        optional={true}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder="johndoe@example.com"
        propagateError={this.props.propagateFormErrors}
        text="Email:"
        textContentType="emailAddress"
        textInputRef={(input) => (this.customerIdField = input)}
        validators={{
          email: true,
          required: true,
        }}
      />
    );

    const phoneInput = (
      <FormInput
        autoCompleteType="tel"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType="number-pad"
        onBlur={() => {
          setTimeout(() => {
            !this.state.invalidFields.includes("customerId") &&
            this.state.form.customerId &&
            this.state.isAmountFetchRequired
              ? this.getPayableAmount()
              : null;
          }, 80);
        }}
        onChangeText={(customerId, isValid) => {
          this.updateFormField({
            customerId,
            phone: customerId,
          });
          isValid === false
            ? this.addInvalidField("customerId")
            : this.removeInvalidField("customerId");
        }}
        onSubmitEditing={() => {
          !this.state.invalidFields.includes("customerId") &&
          this.state.form.customerId &&
          this.state.isAmountFetchRequired
            ? this.getPayableAmount()
            : this.amount.focus();
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder={`${this.state.selectedBillerOption.customerIdField}`}
        propagateError={this.props.propagateFormErrors}
        text={`${this.state.selectedBillerOption.customerIdField}: `}
        textInputRef={(input) => (this.customerIdField = input)}
        validators={{
          regex: "numbers",
          length: MIN_NIGERIA_PHONE_LENGTH,
          required: true,
        }}
      />
    );

    const regularInput = (
      <FormInput
        autoCompleteType="name"
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onBlur={() => {
          setTimeout(() => {
            !this.state.invalidFields.includes("customerId") &&
            this.state.form.customerId &&
            this.state.isAmountFetchRequired
              ? this.getPayableAmount()
              : null;
          }, 80);
        }}
        onChangeText={(customerId, isValid) => {
          this.updateFormField({ customerId });
          isValid === false
            ? this.addInvalidField("customerId")
            : this.removeInvalidField("customerId");
        }}
        onSubmitEditing={() => {
          !this.state.invalidFields.includes("customerId") &&
          this.state.form.customerId &&
          this.state.isAmountFetchRequired
            ? this.getPayableAmount()
            : this.amount.focus();
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder={`${this.state.selectedBillerOption.customerIdField}`}
        propagateError={this.props.propagateFormErrors}
        text={`${this.state.selectedBillerOption.customerIdField}: `}
        textInputRef={(input) => (this.customerIdField = input)}
        validators={{
          regex: "name",
          required: true,
        }}
      />
    );

    if (this.customerIdFieldIsPhone()) {
      return phoneInput;
    } else if (this.customerIdFieldIsEmail()) {
      return emailInput;
    }

    return regularInput;
  }

  get isSelectedBillerOptionNull() {
    return Object.values(this.state.selectedBillerOption).length === 0;
  }

  render() {
    const { product } = this.props;

    return (
      <React.Fragment>
        <CustomerInquiryIndicator
          customerDetails={this.state.customerDetails}
          customerInquirySuccess={
            this.state.didErrorOccurFetchingPayableAmount === null
              ? null
              : !this.state.didErrorOccurFetchingPayableAmount
          }
          onRetry={this.getPayableAmount}
          ref_={(component) => (this.customerInquiryIndicator = component)}
          onClose={() => this.customerInquiryIndicator.close()}
        />
        <View style={{ paddingBottom: 20 }}>
          <View
            style={{
              flex: 0.7,
              alignItems: "center",
              flexDirection: "row",
              padding: 4,
            }}
          >
            <Image
              source={{ uri: product?.imageUrl }}
              style={{ height: 75, width: 75 }}
            />
            <Text bold style={{ marginLeft: 10 }}>
              {product?.name}
            </Text>
          </View>

          <FormPicker
            choices={this.state.billerOptions.map((option) => ({
              label: option.name,
              value: option,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(option) => {
              this.selectBillerOption(option);
            }}
            outerContainerStyle={[
              styles.formInputOuterContainerStyle,
              { marginTop: 8, marginBottom: 20, marginHorizontal: 4 },
            ]}
            propagateError={this.props.propagateFormErrors}
            text="Select a biller option:"
            validators={{
              required: true,
            }}
          />

          {Object.values(this.state.selectedBillerOption).length > 0 &&
            this.customerIdFormInput()}
        </View>

        <View
          style={{
            backgroundColor: COLOUR_WHITE,
            opacity:
              this.isSelectedBillerOptionNull ||
              this.state.hasRequiredAmountBeenFetched === false
                ? 0.2
                : 1,
            borderTopWidth: 20,
            borderTopColor: "#F3F3F4",
            paddingTop: 8,
            width: "110%",
            marginLeft: -20,
            padding: 20,
          }}
        >
          <Text black big>
            Pay Bill
          </Text>
          <Divider style={{ marginTop: 10, marginBottom: 20 }} />

          {/* {Object.values(this.state.selectedBillerOption).length > 0 && this.customerIdFormInput()} */}

          <FormInput
            autoCompleteType="tel"
            defaultValue={Numeral(
              convertNgkToNgn(this.state.selectedBillerOption.amount)
            ).format("0,0.00")}
            disabled={
              Object.keys(this.state.selectedBillerOption).length &&
              this.state.selectedBillerOption.isAmountFixed
            }
            editable={
              Object.keys(this.state.selectedBillerOption).length &&
              !this.state.selectedBillerOption.isAmountFixed
            }
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType="number-pad"
            onChangeText={(amount, isValid) => {
              this.updateFormField({ amount });
              isValid === false
                ? this.addInvalidField("amount")
                : this.removeInvalidField("amount");
            }}
            onSubmitEditing={() => {
              this.phone && this.phone.focus();
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="0.00"
            propagateError={this.props.propagateFormErrors}
            text="Amount:"
            textInputRef={(input) => (this.amount = input)}
            validators={{
              regex: "numbers",
              required: true,
            }}
          />

          {!this.customerIdFieldIsPhone() && (
            <FormInput
              autoCompleteType="tel"
              defaultValue={this.state.form.phone}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="number-pad"
              onChangeText={(phone, isValid) => {
                this.updateFormField({ phone });
                isValid === false
                  ? this.addInvalidField("phone")
                  : this.removeInvalidField("phone");
              }}
              optional={true}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="08012345678"
              propagateError={this.props.propagateFormErrors}
              text="Phone:"
              textInputRef={(input) => (this.phone = input)}
              validators={{
                length: MIN_NIGERIA_PHONE_LENGTH,
                required: true,
              }}
            />
          )}

          {!this.customerIdFieldIsEmail() && (
            <FormInput
              autoCapitalize="none"
              autoCompleteType="email"
              defaultValue={this.state.form.email}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              keyboardType="email-address"
              leftIcon="mail"
              onChangeText={(email, isValid) => {
                this.updateFormField({ email });
                isValid === false
                  ? this.addInvalidField("email")
                  : this.removeInvalidField("email");
              }}
              optional={true}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              placeholder="johndoe@example.com"
              propagateError={this.props.propagateFormErrors}
              text="Email:"
              textContentType="emailAddress"
              textInputRef={(input) => (this.email = input)}
              validators={{
                email: true,
              }}
            />
          )}
          {this.props.product?.urlName === "ODIRSLAND" ||
          this.props.product?.urlName === "odirs" ||
          this.props.product?.urlName === "Evreg" ||
          this.props.product?.urlName === "ondostatejudiciary" ? (
            <FormInput
              autoCompleteType="street-address"
              innerContainerStyle={{
                marginTop: 5,
              }}
              onChangeText={(address, isValid) => {
                this.updateFormField({ address });
                isValid === false
                  ? this.addInvalidField("address")
                  : this.removeInvalidField("address");
              }}
              outerContainerStyle={{
                marginBottom: 10,
              }}
              defaultValue={this.state.form.address}
              placeholder="221b, Baker Street"
              text="Address:"
              textInputRef={(input) => (this.address = input)}
              propagateError={this.props.propagateFormErrors}
              validators={{
                required: true,
                minLength: MIN_ADDRESS_LENGTH,
              }}
            />
          ) : (
            <FormInput
              autoCompleteType="street-address"
              innerContainerStyle={{
                marginTop: 5,
              }}
              onChangeText={(address, isValid) => {
                this.updateFormField({ address });
                isValid === false
                  ? this.addInvalidField("address")
                  : this.removeInvalidField("address");
              }}
              outerContainerStyle={{
                marginBottom: 10,
              }}
              placeholder="221b, Baker Street"
              text="Address:"
              textInputRef={(input) => (this.address = input)}
            />
          )}
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
        </View>
      </React.Fragment>
    );
  }
}

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
    padding: 20,
    elevation: 5,
    marginBottom: 40,
    flex: 0.2,
  },
});

function mapStateToProps(state) {
  return {
    propagateFormErrors: state.forms.propagateFormErrors,
  };
}

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(PayBillForm);
