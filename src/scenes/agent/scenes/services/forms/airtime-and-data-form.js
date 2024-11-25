import React from 'react';
import {StyleSheet} from 'react-native';

import Numeral from 'numeral';
import {connect} from 'react-redux';

import BaseForm from '../../../../../components/base-form';
import FormCheckbox from '../../../../../components/form-controls/form-checkbox';
import FormInput from '../../../../../components/form-controls/form-input';
import FormPhone from '../../../../../components/form-controls/form-phone';
import FormPicker from '../../../../../components/form-controls/form-picker';
import {NIGERIA_SHORT_CODE} from '../../../../../constants';
import {ERROR_STATUS} from '../../../../../constants/api';
import {
  ENVIRONMENT,
  QUICKTELLER_API_TERMINAL_ID,
} from '../../../../../constants/api-resources';
import {CASUAL} from '../../../../../constants/dialog-priorities';
import {MIN_NIGERIA_PHONE_LENGTH} from '../../../../../constants/fields';
import {COLOUR_WHITE} from '../../../../../constants/styles';
import AllNetworkPaymentCodes from '../../../../../fixtures/network-payments-code';
import AllNetworkPaymentCodesEPin from '../../../../../fixtures/network-payments-code-epin.json';
import {flashErrorMessage} from '../../../../../services/redux/actions/tunnel';
import {quicktellerService} from '../../../../../setup/api';
import {convertNgkToNgn} from '../../../../../utils/converters/currencies';
import handleErrorResponse from '../../../../../utils/error-handlers/api';
import globalStyles from '../styles';

const AIRTIME_SUB_CATEGORY_ID = 1;
const DATA = 'DATA';
const DATA_SUB_CATEGORY_ID = 2;
const E_PINS_SUB_CATEGORY_ID = 3;
const NetworkPaymentCodes = AllNetworkPaymentCodes[ENVIRONMENT];
const NetworkPaymentCodesEPin = AllNetworkPaymentCodesEPin[ENVIRONMENT];

const QUICKTELLER_CATEGORY_ID_AIRTIME_AND_DATA = 4;

class AirtimeAndDataForm extends BaseForm {
  requiredDataFields = ['amount', 'paymentItemCode', 'phone'];

  requiredAirtimeFields = ['amount', 'paymentItemCode', 'phone'];

  constructor(props) {
    super(props);

    this.state = {
      billerOptions: [],
      countryShortCode: NIGERIA_SHORT_CODE,
      dataPlans: [],
      form: {},
      product: props.product,
      selectedBillerOption: {},
      invalidFields: [],
      isComplete: null,
      isValid: null,
    };

    this.fetchBillers = this.fetchBillers.bind(this);
  }

  componentDidMount() {
    const subCategory = this.props.route?.params?.subCategory || {};

    this.isAirtime = subCategory.id === AIRTIME_SUB_CATEGORY_ID;
    this.isData = subCategory.id === DATA_SUB_CATEGORY_ID;
    this.isEpins = subCategory.id === E_PINS_SUB_CATEGORY_ID;

    if (this.isData) {
      this.requiredFields = this.requiredDataFields;
    } else if (this.isAirtime || this.isEpins) {
      this.requiredFields = this.requiredAirtimeFields;
    }

    this.setState({
      isAirtime: this.isAirtime,
      isData: this.isData,
    });

    setTimeout(() => this.phone.focus(), 350);
    this.fetchBillers();
  }

  async fetchBillers() {
    this.setState({
      isLoading: true,
    });

    const {status, response} = await quicktellerService.getServices(
      QUICKTELLER_CATEGORY_ID_AIRTIME_AND_DATA,
      QUICKTELLER_API_TERMINAL_ID,
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashErrorMessage(null, await handleErrorResponse(response), CASUAL);

      // this.props.navigation.goBack();

      return;
    }

    const {services} = response;
    const dataPlans = services.filter(({name}) =>
      name.toUpperCase().includes(DATA),
    );

    this.setState({
      filteredDataPlans: dataPlans,
      dataPlans,
    });
  }

  async fetchDataPlanOptions(serviceId) {
    this.setState({
      isLoading: true,
    });

    const {status, response} = await quicktellerService.getOptions(
      serviceId,
      QUICKTELLER_API_TERMINAL_ID,
    );

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashErrorMessage(null, await handleErrorResponse(response), CASUAL);

      // this.props.navigation.goBack();

      return;
    }

    const {options} = response;

    this.setState({
      billerOptions: options,
    });
  }

  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };

    const isComplete =
      this.requiredFields.find(
        fieldName =>
          newForm[fieldName] === null || newForm[fieldName] === undefined,
      ) === undefined;

    this.setState({
      form: newForm,
      isComplete,
    });
  }

  render() {
    const {billerOptions, dataPlans, selectedBillerOption} = this.state;

    return (
      <React.Fragment>
        <FormPhone
          autoCompleteType="tel"
          defaultValue={this.state.form.phone}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(phone, isValid) => {
            this.updateFormField({
              phone,
              customerId: phone,
            });
            isValid === false
              ? this.addInvalidField('phone')
              : this.removeInvalidField('phone');
            isValid === false
              ? this.addInvalidField('customerId')
              : this.removeInvalidField('customerId');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="08012345678"
          propagateError={this.props.propagateFormErrors}
          text="Phone:"
          textInputRef={input => (this.phone = input)}
          validators={{
            length: [MIN_NIGERIA_PHONE_LENGTH, 13],
            required: true,
          }}
        />

        {this.isAirtime && (
          <FormPicker
            defaultValue={this.props.route?.params?.paymentCode}
            choices={NetworkPaymentCodes.map(option => ({
              label: option.name,
              value: option.payment_code,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(paymentItemCode, isValid) => {
              serviceName = (
                NetworkPaymentCodes.find(
                  value => value.payment_code === paymentItemCode,
                ) || {}
              ).name;
              this.updateFormField({
                paymentItemCode,
                serviceName,
              });
              isValid === false
                ? this.addInvalidField('paymentItemCode')
                : this.removeInvalidField('paymentItemCode');
              setTimeout(this.amount.focus, 700);
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Network:"
            validators={{
              required: true,
            }}
          />
        )}

        {this.isEpins && (
          <FormPicker
            choices={NetworkPaymentCodesEPin.map(option => ({
              label: option.name,
              value: option.payment_code,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(paymentItemCode, isValid) => {
              serviceName = (
                NetworkPaymentCodesEPin.find(
                  value => value.payment_code === paymentItemCode,
                ) || {}
              ).name;
              this.updateFormField({
                paymentItemCode,
                serviceName,
              });
              isValid === false
                ? this.addInvalidField('paymentItemCode')
                : this.removeInvalidField('paymentItemCode');
              setTimeout(this.amount.focus, 700);
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Network:"
            validators={{
              required: true,
            }}
          />
        )}

        {this.isData && (
          <FormPicker
            choices={dataPlans.map(option => ({
              imageUrl: option.imageUrl,
              label: option.name,
              value: option.id,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(serviceId, isValid) => {
              isValid === false
                ? this.addInvalidField('network')
                : this.removeInvalidField('network');

              this.fetchDataPlanOptions(serviceId);
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Network:"
            validators={{
              required: true,
            }}
          />
        )}

        {this.isData && (
          <FormPicker
            defaultValue={this.props.route?.params?.paymentCode}
            choices={billerOptions.map(option => ({
              label: option.name,
              value: option.paymentCode,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={(selectedPaymentCode, isValid) => {
              const billerOption = this.state.billerOptions.find(
                ({paymentCode}) => paymentCode === selectedPaymentCode,
              );

              this.setState({
                selectedBillerOption: billerOption,
              });

              this.updateFormField({
                paymentItemCode: selectedPaymentCode,
              });
              isValid === false
                ? this.addInvalidField('paymentItemCode')
                : this.removeInvalidField('paymentItemCode');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Data Plan:"
            validators={{
              required: true,
            }}
          />
        )}

        <FormInput
          autoCompleteType="tel"
          defaultValue={Numeral(
            convertNgkToNgn(selectedBillerOption.amount),
          ).format('0,0.00')}
          disabled={
            Object.keys(selectedBillerOption).length &&
            selectedBillerOption.isAmountFixed
          }
          editable={
            Object.keys(selectedBillerOption).length &&
            !selectedBillerOption.isAmountFixed
          }
          innerContainerStyle={styles.formInputInnerContainerStyle}
          keyboardType="number-pad"
          onChangeText={(amount, isValid) => {
            this.updateFormField({amount});
            isValid === false
              ? this.addInvalidField('amount')
              : this.removeInvalidField('amount');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder="0.00"
          propagateError={this.props.propagateFormErrors}
          text="Amount:"
          textInputRef={input => (this.amount = input)}
          validators={{
            regex: 'numbers',
            required: true,
          }}
        />

        <FormCheckbox
          defaultValue={this.state.form.gender}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          text="Gender:"
          options={['Male', 'Female']}
          onSelect={(gender, isValid) => {
            this.updateFormField({gender});
            isValid === false
              ? this.addInvalidField('gender')
              : this.removeInvalidField('gender');
          }}
          propagateError={this.props.propagateFormErrors}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    propagateFormErrors: state.forms.propagateFormErrors,
  };
}

export default connect(mapStateToProps, null, null, {forwardRef: true})(
  AirtimeAndDataForm,
);

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
