import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import Header from '../../../../../components/header';
import {NIGERIA, USER} from '../../../../../constants';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../../constants/styles';
import CountriesStatesLga from '../../../../../fixtures/countries_states_lgas.json';
import CacRegPaymentPrompt from '../../../../../fragments/cac-reg-payment-details-modal';
import TransactionV1 from '../../../../../services/api/resources/transaction-v1';
import {getDeviceDetails} from '../../../../../utils/device';
import {loadData, saveData} from '../../../../../utils/storage';
import ProgressBar from '../../../../aggregator/components/progress-bar';
import {BusinessDetailsForm as AgentBusinessDetailsAgentBusinessDetails} from '../forms/business-details-form';

const GENDER_TYPES = [
  {
    name: 'MALE',
    value: 'MALE',
    id: 1,
  },
  {
    name: 'FEMALE',
    value: 'FEMALE',
    id: 2,
  },
];
class BusinessDetails extends React.Component {
  constructor() {
    super();
    this.transaction = new TransactionV1();
    this.paymentModalRef = React.createRef();
    this.fetchPersonalFormDetails = this.fetchPersonalFormDetails.bind(this);
    this.fetchInitiateResponse = this.fetchInitiateResponse.bind(this);
    this.fetchCountries = this.fetchCountries.bind(this);
    this.loadRegType = this.loadRegType.bind(this);
    this.clearCacForm = this.clearCacForm.bind(this);

    this.state = {
      form: {},
      invalidFields: [],
      isLoading: false,
      base64KycImages: null,
      personalDetailsFormData: null,
      initiateResponseData: null,
      businessDetailsFormData: null,
      states: [],
      stateName: null,
      proprietorStateName: null,
      lgas: [],
      lgName: null,
      countries: [],
      proprietorCountry: null,
      commencementDate: null,
      newproprietorDob: null,
      assistedCacRegType: false,
      proprietorGender: null,
    };
  }

  componentDidMount() {
    this.fetchStates();
    this.fetchCountries();
    const {base64Images: base64KycImages} = this.props.route.params || {};

    if (!base64KycImages) {
      return;
    } else {
      this.setState(
        {
          base64KycImages: base64KycImages,
        },
        () => {
          console.log('base64KycImages', this.state.base64KycImages);
          console.log('base64KycImages1', this.state.base64KycImages.Passport);
        },
      );
    }

    this.fetchPersonalFormDetails();
    this.fetchInitiateResponse();
    this.loadRegType();
  }

  async clearCacForm() {
    await saveData('cacBusinessFormData', '');
    await saveData('cacRegBusinessFormData', '');
    await saveData('cacRegPersonalFormData', '');
  }

  async loadRegType() {
    const savedCacRegType = JSON.parse(await loadData('CAC REG TYPE'));

    if (savedCacRegType === 'assisted') {
      this.setState({assistedCacRegType: true});
    } else {
      this.setState({assistedCacRegType: false});
    }

    console.log('savedCacRegTypePersonal', this.state.assistedCacRegType);
  }

  fetchStates() {
    const nigeria = CountriesStatesLga.find(value => value.name === NIGERIA);
    this.setState(
      {
        states: nigeria.states,
      },
      () => {
        console.log('STATES1', this.state.states);
      },
    );
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map(value => ({
        id: value.id,
        name: value.name,
      })),
    });
    console.log('COUNTRIES', this.state.countries);
  }

  async fetchPersonalFormDetails() {
    const fetchPersonalFormData = JSON.parse(
      await loadData('cacRegPersonalFormData'),
    );
    this.setState(
      {
        personalDetailsFormData: fetchPersonalFormData,
      },
      () => {
        console.log('PERSONAL FORM', this.state.personalDetailsFormData);
      },
    );

    const {states} = this.state;
    const proprietorStateId = this.state.personalDetailsFormData.state;
    const proprietorGenderId = this.state.personalDetailsFormData.gender;
    console.log('newproprietorDob1', this.state.personalDetailsFormData);
    const proprietorDob = this.state.personalDetailsFormData.dateOfBirth;
    const newproprietorDob = this.rewriteDateFormat(proprietorDob);
    const proprietorStateName = states.find(
      item => item.id === proprietorStateId,
    );
    const proprietorGender = GENDER_TYPES.find(
      item => item.id === proprietorGenderId,
    );
    console.log('GENDERPROP', proprietorGender.name);
    console.log('PROPSTATE1', proprietorStateName);
    this.setState({
      proprietorStateName: proprietorStateName
        ? proprietorStateName.name
        : null,
      lgas: proprietorStateName.lgas,
      newproprietorDob: newproprietorDob,
      proprietorGender: proprietorGender ? proprietorGender.name : null,
    });
    console.log('proprietorGender', this.state.proprietorGender);
    console.log('newproprietorDob2', this.state.newproprietorDob);
    const {lgas} = this.state;
    const idLg = this.state.personalDetailsFormData.lga;
    const lgNmae = lgas.find(item => item.id === idLg);

    this.setState({
      lgName: lgNmae ? lgNmae.name : null,
    });
    console.log('PROPSTATE2', this.state.lgName);
    console.log('proprietorGender2', this.state.proprietorGender);
  }

  rewriteDateFormat(dateStr) {
    // Split the input date by the hyphen
    const [day, month, year] = dateStr.split('-');
    // Return the date in the format "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  }

  async fetchInitiateResponse() {
    const cacInitiateResponse = JSON.parse(
      await loadData('cacRegInitiateResponseData'),
    );
    this.setState(
      {
        initiateResponseData: cacInitiateResponse,
      },
      () => {
        console.log(
          'initaitaeResponseData',
          this.state.initiateResponseData.cacInitiateRequest.amount,
        );
      },
    );
  }

  async getFormData() {
    const businessForm = this.BusinessDetailsForm.state.form;
    await saveData('cacRegBusinessFormData', businessForm);
    this.setState(
      {
        businessDetailsFormData: businessForm,
      },
      () => {
        console.log(
          'businessDetailsFormData',
          this.state.businessDetailsFormData,
        );

        console.log('COMPANYSTATE1', this.state.businessDetailsFormData);
        const {states} = this.state;
        const idState = this.state.businessDetailsFormData.companyState;
        const stateName = states.find(item => item.id === idState);
        console.log('COMPANYSTATE2', stateName.name);
        const commencementDate =
          this.state.businessDetailsFormData.businessCommencementDate;
        const newcommencementDate = this.rewriteDateFormat(commencementDate);
        console.log('newcommencementDate', newcommencementDate);
        this.setState(
          {
            stateName: stateName ? stateName.name : null,
            commencementDate: newcommencementDate,
          },
          () => {
            console.log('COMPANYSTATE3', this.state.stateName);

            console.log('newcommencementDate2', this.state.commencementDate);
          },
        );
      },
    );
  }

  async proceedCacRequest() {
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    try {
      const currentUser = JSON.parse(await loadData(USER));
      console.log('PROCEED CAC USER', currentUser);
      const deviceDetails = await getDeviceDetails();
      const proprietorDob = this.state.assistedCacRegType
        ? this.state.newproprietorDob
        : this.state.personalDetailsFormData.dateOfBirth;
      const deviceId = deviceDetails;
      const deviceUuid = deviceId.deviceUuid;
      const amount = 0;
      const paymentItemCode = 'IFISCAC';
      const meansOfIdentification =
        this.state.base64KycImages['NIN Slip Image']['base64'];
      const supportingDoc =
        this.state.base64KycImages?.['Supporting Document']?.['base64'] ?? '';
      console.log('supportingDoc', meansOfIdentification);
      const payLoad = {
        businnessPhone: this.state.personalDetailsFormData.phoneNumber,
        transactionReference:
          this.state.initiateResponseData.transactionReference,
        transactionType: 'CAC_REGISTRATION',
        cacInitiateRequest: {
          amount: this.state.initiateResponseData.cacInitiateRequest.amount,
          borneBy: 'customer',
          businessName:
            this.state.initiateResponseData.cacInitiateRequest.businessName,
          customerMsisdn: this.state.personalDetailsFormData.phoneNumber,
          fee: amount,
          lineOfBusiness:
            this.state.initiateResponseData.cacInitiateRequest.lineOfBusiness,
          narration: 'cac registration',
          paymentInstrumentType: 'CASH',
          paymentItemCode: paymentItemCode,
          reference: this.state.initiateResponseData.transactionReference,
          registrationPayload: {
            proprietorCity: this.state.personalDetailsFormData.city,
            companyCity: this.state.personalDetailsFormData.city,
            proprietorPhonenumber:
              this.state.personalDetailsFormData.phoneNumber,
            businessCommencementDate: this.state.commencementDate,
            companyState: this.state.stateName,
            proprietorNationality: this.state.personalDetailsFormData.country,
            proprietorState: this.state.proprietorStateName,
            proprietorDob: proprietorDob,
            proprietorFirstname: this.state.personalDetailsFormData.firstname,
            proprietorOthername: this.state.personalDetailsFormData.firstname,
            proprietorSurname: this.state.personalDetailsFormData.surname,
            proprietorGender: this.state.proprietorGender,
            proprietorStreetNumber:
              this.state.personalDetailsFormData.streetNumber,
            proprietorServiceAddress:
              this.state.personalDetailsFormData.houseAddress,
            companyEmail:
              this.state.businessDetailsFormData.companyEmailAddress,
            companyStreetNumber:
              this.state.businessDetailsFormData.companyStreetNumber,
            proprietorEmail: this.state.personalDetailsFormData.emailAddress,
            companyAddress: this.state.businessDetailsFormData.companyAddress,
            proprietorPostcode: this.state.personalDetailsFormData.postalCode,
            proprietorLga: this.state.lgName,
            transactionRef:
              this.state.initiateResponseData.transactionReference,
            supportingDoc: supportingDoc,
            signature: this.state.base64KycImages.Signature.base64,
            meansOfId: meansOfIdentification,
            passport: this.state.base64KycImages.Passport.base64,
          },
        },
      };
      console.log('PAYLOAD', payLoad);
      const response = await this.transaction.cacRegistrationProceed(
        {
          businnessPhone: this.state.personalDetailsFormData.phoneNumber,
          transactionReference:
            this.state.initiateResponseData.transactionReference,
          transactionType: 'CAC_REGISTRATION',
          cacInitiateRequest: {
            amount: this.state.initiateResponseData.cacInitiateRequest.amount,
            borneBy: 'customer',
            businessName:
              this.state.initiateResponseData.cacInitiateRequest.businessName,
            customerMsisdn: this.state.personalDetailsFormData.phoneNumber,
            fee: amount,
            lineOfBusiness:
              this.state.initiateResponseData.cacInitiateRequest.lineOfBusiness,
            narration: 'cac registration',
            paymentInstrumentType: 'CASH',
            paymentItemCode: paymentItemCode,
            reference: this.state.initiateResponseData.transactionReference,
            registrationPayload: {
              proprietorCity: this.state.personalDetailsFormData.city,
              companyCity: this.state.personalDetailsFormData.city,
              proprietorPhonenumber:
                this.state.personalDetailsFormData.phoneNumber,
              businessCommencementDate: this.state.commencementDate,
              companyState: this.state.stateName,
              proprietorNationality: 'Nigeria',
              proprietorState: this.state.proprietorStateName,
              proprietorDob: proprietorDob,
              proprietorFirstname: this.state.personalDetailsFormData.firstname,
              proprietorOthername:
                this.state.personalDetailsFormData.proprietorOthername,
              proprietorSurname: this.state.personalDetailsFormData.surname,
              proprietorGender: this.state.proprietorGender,
              proprietorStreetNumber:
                this.state.personalDetailsFormData.streetNumber,
              proprietorServiceAddress:
                this.state.personalDetailsFormData.houseAddress,
              companyEmail:
                this.state.businessDetailsFormData.companyEmailAddress,
              companyStreetNumber:
                this.state.businessDetailsFormData.companyStreetNumber,
              proprietorEmail: this.state.personalDetailsFormData.emailAddress,
              companyAddress: this.state.businessDetailsFormData.companyAddress,
              proprietorPostcode: this.state.personalDetailsFormData.postalCode,
              proprietorLga: this.state.lgName,
              transactionRef:
                this.state.initiateResponseData.transactionReference,
              supportingDoc: supportingDoc,
              signature: this.state.base64KycImages.Signature.base64,
              meansOfId: meansOfIdentification,
              passport: this.state.base64KycImages.Passport.base64,
            },
          },
        },
        deviceUuid,
      );

      console.log('PROCEED RESPONSE', response);
      if (
        response.status === SUCCESS_STATUS &&
        response.response.code === '00'
      ) {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.clearCacForm();
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('Congratulation');
      } else if (
        response.status === SUCCESS_STATUS &&
        response.response.code === '01'
      ) {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('CacUnsuccessfulPayment'); //CacUnsuccessfulPayment
      } else if (
        response.status === ERROR_STATUS &&
        response.response.code === null
      ) {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('CacUnsuccessfulPayment'); //CacUnsuccessfulPayment
      } else if (response.status === ERROR_STATUS && response.code === 500) {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('CacUnsuccessfulPayment'); //CacUnsuccessfulPayment
      } else if (
        response.status === ERROR_STATUS &&
        response.response.code === '40006'
      ) {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('InsufficientFund');
      } else {
        this.setState({
          errorMessage: null,
          isLoading: false,
        });
        this.paymentModalRef.current.close();
        this.props.navigation.navigate('CacUnsuccessfulPayment'); //CacUnsuccessfulPayment
      }
    } catch (error) {
      console.log('PROCEED RESPONSE2', error);
      this.setState({
        errorMessage: null,
        isLoading: false,
      });
      this.paymentModalRef.current.close();
      this.props.navigation.navigate('CacUnsuccessfulPayment'); //CacUnsuccessfulPayment
    }
  }

  makePayment = () => {
    this.proceedCacRequest();

    // this.props.navigation.navigate("Congratulation");
  };

  proceed = () => {
    this.getFormData();
    this.paymentModalRef.current.open();
  };
  render() {
    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() =>
                // this.props.navigation.navigate("AgentUpgradeLanding")
                this.props.navigation.navigate('CacKycDetails')
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`CAC Registration`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="3" size="3" />

        <ScrollView>
          <View
            style={{
              backgroundColor: COLOUR_WHITE,
              flex: 1,
            }}>
            <AgentBusinessDetailsAgentBusinessDetails
              propagateFormErrors={this.state.propagateFormErrors}
              ref={form => (this.BusinessDetailsForm = form)}
              superAgents={this.props.superAgents}
              onPress={() => this.proceed()}
            />

            <CacRegPaymentPrompt
              paymentModalRef={this.paymentModalRef}
              otpOk={this.makePayment}
              loading={this.state.isLoading}
            />

            <View style={{paddingHorizontal: 20, marginBottom: 10}}>
              {/* <Button
                onPress={this.proceed}
                title="Proceed to payment"
                loading={this.state.isLoading}
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: screen => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: message => dispatch(navigateTo(message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BusinessDetails);

const styles = StyleSheet.create({});
