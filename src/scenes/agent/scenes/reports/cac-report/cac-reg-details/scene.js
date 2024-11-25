import React from 'react';
import {Alert, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
// import { Text as CustomText } from "../../../../../../components/text";
import {AGENT, NIGERIA} from '../../../../../../constants';
import {SUCCESS_STATUS} from '../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import CountriesStatesLga from '../../../../../../fixtures/countries_states_lgas.json';
import StatusMessageModal from '../../../../../../fragments/status-message-modal';
import AgentSerializer from '../../../../../../serializers/resources/agent';
import {cac} from '../../../../../../setup/api';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import {loadData} from '../../../../../../utils/storage';
import {CacReportForm as CacReportCacReport} from './cacReport-form';

export class CacReportBanner extends React.Component {
  render() {
    const {
      title,
      message,
      action,
      bgColor,
      icon,
      titleColor,
      queriedComment,
      actionColor,
      onPress,
      count,
    } = this.props;
    return (
      <View style={{paddingBottom: 10}}>
        <ClickableListItem
          disabled={true}
          style={{
            // alignItems: "center",
            // flexDirection: "row",
            paddingLeft: 10,
            paddingBottom: 5,
            borderLeftWidth: 16,
            borderRadius: 8,
            backgroundColor: bgColor,
            borderColor: '#EC9B40',
            borderWidth: 0.7,
            leftBorderColor: '#EC9B40',
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#6B2B0D', fontSize: 16}} bold>
                {count}
              </Text>
              <Text
                style={{
                  color: '#6B2B0D',
                  fontSize: 16,
                }}
                bold>
                {title}
              </Text>
            </View>
          </View>

          <View style={{flex: 1}}>
            {queriedComment?.map((item, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  alignItems: 'center',
                  paddingHorizontal: 6,
                }}>
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 8,
                    backgroundColor: '#6B2B0D',
                  }}
                />
                <View style={{paddingHorizontal: 9, paddingBottom: 2}}>
                  <Text
                    numberOfLines={4}
                    ellipsizeMode="clip"
                    style={{fontSize: 14, color: '#6B2B0D'}}>
                    {item.comment}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ClickableListItem>
      </View>
    );
  }
}
class CacReportDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      form: {},
      invalidFields: [],
      lineOfBusiness: [],
      buttonDisabled: true,
      isLoading: false,
      lineOfBusiness: null,
      proposedBusinessName: null,
      invalidName: false,
      savedCacBusinessForm: null,
      businessDetails: {},
      didErrorOccur: false,
      errorMessage: null,
      registrationRequestPayload: {},
      decodedObject: null,
      reportStatus: null,
      currentAgent: null,
      queried: false,
      buttonLoading: false,
      queriedFieldMap: null,
      errorLength: null,
      updatedObject: {},
      showResponseMessage: false,
      updateSuccess: null,
      errorResponse: null,
      states: [],
      comapanystateId: false,
      companyStateName: null,
      proprietorStateId: false,
      proprietorStateName: null,
      lgas: [],
      proprietorLgaName: null,
      proprietorLgaId: false,
    };
    this.loadAgent = this.loadAgent.bind(this);
    this.loadCacReportDetails = this.loadCacReportDetails.bind(this);
    this.requeryReport = this.requeryReport.bind(this);
    this.updateReport = this.updateReport.bind(this);
  }

  errorFallbackMessage() {
    const {errorMessage} = this.state;

    return (
      <View
        style={{
          alignItems: 'center',
          flex: 0.3,
          justifyContent: 'center',
          padding: 16,
        }}>
        <Text big center>
          {errorMessage}
        </Text>
        <Button
          containerStyle={{
            marginTop: 8,
          }}
          onPress={this.loadCacReportDetails}
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  async componentDidMount() {
    this.fetchStates();
    await this.loadAgent();
    const {businessDetails} = this.props.route.params || {};

    this.setState(
      {
        businessDetails: businessDetails || {},
      },
      () => {
        console.log(
          'businessDetailsReference',
          this.state.businessDetails.reference,
        );

        this.loadCacReportDetails(this.state.businessDetails.reference);
      },
    );
  }
  fetchStates() {
    const nigeria = CountriesStatesLga.find(value => value.name === NIGERIA);
    this.setState(
      {
        states: nigeria.states,
      },
      () => {
        console.log('REPORTSTATES', this.state.states);
      },
    );
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => this.props.navigation.goBack(),
        },
      ],

      {cancelable: true},
    );
  }

  async convertFilesToBase64(array) {
    const result = {};
    console.log('ARRAY', array);
    for (let i = 0; i < array.length; i++) {
      const base64String = await this.base64Image(array[i].fileCopyUri);
      result[array[i].documentName] = {
        ...array[i],
        base64: base64String,
      };
    }
    // this.setState({
    //   isLoading: true,
    // });
    console.log('RESULTS', result);
    return result;
  }

  async base64Image(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    const reader = new FileReader();
    const base64data = await new Promise(resolve => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });

    return base64data;
  }

  mergeObjectsWithBase64(firstObject, secondObject) {
    // Create a new object by copying secondObject
    const mergedObject = {...secondObject};

    // Iterate through keys in firstObject
    Object.keys(firstObject).forEach(key => {
      const nestedObject = firstObject[key];

      // Check if base64 data exists in the nested object (you can customize this to target a specific key if needed)
      if (nestedObject.hasOwnProperty('base64')) {
        // Add the base64 value using the same key into the merged object
        mergedObject[key] = nestedObject.base64;
      }
    });

    // Return the new merged object
    return mergedObject;
  }

  getRequestData(firstObject, secondObject) {
    // Create a copy of the secondObject to avoid mutating the original one
    const updatedSecondObject = {...secondObject};

    // Iterate over the keys in the firstObject
    Object.keys(firstObject).forEach(key => {
      // Check if the key exists in the secondObject
      if (updatedSecondObject.hasOwnProperty(key)) {
        // Replace the value in updatedSecondObject with the value from firstObject
        updatedSecondObject[key] = firstObject[key];
      }
    });

    // Set the updated object in the component's state
    this.setState({updatedObject: updatedSecondObject});

    // Return the updated object as well
    return updatedSecondObject;
  }

  async updateReport() {
    this.setState({
      buttonLoading: true,
    });

    const cacReportForm = this.cacReportForm.state.form;
    const base64 = await this.convertFilesToBase64(
      this.cacReportForm.state.attachments,
    );

    if (base64) {
      const newForm = this.mergeObjectsWithBase64(base64, cacReportForm);

      const requestPayload = this.getRequestData(
        newForm,
        this.state.registrationRequestPayload,
      );

      const {states} = this.state;

      if (
        typeof requestPayload.companyState !== 'string' &&
        typeof requestPayload.proprietorState !== 'string'
      ) {
        const comapnyStateId = requestPayload.companyState;
        const companyStateName = states.find(
          item => item.id === comapnyStateId,
        );

        const proprietorStateId = requestPayload.proprietorState;
        const proprietorStateName = states.find(
          item => item.id === proprietorStateId,
        );

        this.setState(
          {
            comapanystateId: true,
            companyStateName: companyStateName.name,
            proprietorStateId: true,
            proprietorStateName: proprietorStateName.name,
            proprietorLgaId: true,
            lgas: proprietorStateName.lgas,
          },
          () => {
            const {lgas} = this.state;
            const proprietorLgaId = requestPayload.proprietorLga;
            const proprietorLgaName = lgas.find(
              item => item.id === proprietorLgaId,
            );
            this.setState({
              proprietorLgaId: true,
              proprietorLgaName: proprietorLgaName.name,
            });
          },
        );
      } else if (typeof requestPayload.companyState !== 'string') {
        const comapnyStateId = requestPayload.companyState;
        const companyStateName = states.find(
          item => item.id === comapnyStateId,
        );

        this.setState({
          comapanystateId: true,
          companyStateName: companyStateName.name,
        });
      } else if (typeof requestPayload.proprietorState !== 'string') {
        const proprietorStateId = requestPayload.proprietorState;
        const proprietorStateName = states.find(
          item => item.id === proprietorStateId,
        );

        this.setState(
          {
            proprietorStateId: true,
            proprietorStateName: proprietorStateName.name,
            proprietorLgaId: true,
            lgas: proprietorStateName.lgas,
          },
          () => {
            const {lgas} = this.state;
            const proprietorLgaId = requestPayload.proprietorLga;
            const proprietorLgaName = lgas.find(
              item => item.id === proprietorLgaId,
            );
            this.setState({
              proprietorLgaId: true,
              proprietorLgaName: proprietorLgaName.name,
            });
          },
        );
      }

      const payload = {
        lineOfBusiness: requestPayload.lineOfBusiness,
        proprietorCity: requestPayload.proprietorCity,
        companyCity: requestPayload.companyCity,
        proprietorPhonenumber: requestPayload.proprietorPhonenumber,
        businessCommencementDate: requestPayload.businessCommencementDate,
        companyState: this.state.comapanystateId
          ? this.state.companyStateName
          : requestPayload.companyState, //this.state.comapanystateId ? this.state.companyStateName : requestPayload.companyState,
        proprietorNationality: 'Nigeria', //requestPayload.proprietorNationality
        proprietorState: this.state.proprietorStateId
          ? this.state.proprietorStateName
          : requestPayload.proprietorState, //, //  requestPayload.proprietorState
        proprietorDob: requestPayload.proprietorDob,
        proprietorFirstname: requestPayload.proprietorFirstname,
        proprietorOthername: requestPayload.proprietorOthername,
        proprietorSurname: requestPayload.proprietorSurname,
        proposedOption1: requestPayload.proposedOption1,
        proprietorGender: requestPayload.proprietorGender,
        proprietorStreetNumber: requestPayload.proprietorStreetNumber,
        proprietorServiceAddress: requestPayload.proprietorServiceAddress,
        companyEmail: requestPayload.companyEmail,
        companyStreetNumber: requestPayload.companyStreetNumber,
        proprietorEmail: requestPayload.proprietorEmail,
        companyAddress: requestPayload.companyAddress,
        proprietorPostcode: requestPayload.proprietorPostcode,
        proprietorLga: this.state.proprietorLgaId
          ? this.state.proprietorLgaName
          : requestPayload.proprietorLga, // requestPayload.proprietorLga Itire
        transactionRef: requestPayload.transactionRef,
        supportingDoc: requestPayload.supportingDoc,
        signature: requestPayload.signature,
        passport: requestPayload.passport,
        meansOfId: requestPayload.meansOfId,
      };

      const {response, status} = await cac.updateCacRegistrationReport(payload);

      console.log('REQUERYREPORT7', response);

      if (status === SUCCESS_STATUS) {
        this.setState({
          buttonLoading: false,
          showResponseMessage: true,
          updateSuccess: true,
        });
      } else {
        this.setState({
          buttonLoading: false,
          showResponseMessage: true,
          errorResponse: response.description,
        });
      }
    } else {
      return;
    }
    setTimeout(() => {}, 3000); // 3-second delay

    // setTimeout(() => {}, 4000);
  }

  async requeryReport() {
    console.log(
      'businessDetailsReference11',
      this.state.businessDetails.reference,
    );
    this.setState({
      buttonLoading: true,
    });
    const {response, status} = await cac.requeryCacRegistrationReport(
      this.state.businessDetails.reference,
    );
    console.log('REQUERYRES', response);
    if (status === SUCCESS_STATUS) {
      this.setState({
        buttonLoading: false,
      });
      this.showAlert('Requery Successful', 'Your request is being reviewed');
    } else {
      this.setState({
        buttonLoading: false,
      });
      this.showAlert('Error', response.description);
    }
  }

  async loadAgent() {
    const savedAgentData = JSON.parse(await loadData(AGENT));

    if (savedAgentData === null) {
      return;
    }

    const currentAgent = new AgentSerializer(savedAgentData);

    this.setState({
      currentAgent,
    });

    console.log('CACREG2', currentAgent);

    return currentAgent;
  }

  async loadCacReportDetails(reference) {
    this.setState({
      didErrorOccur: false,
      errorMessage: null,
      isLoading: true,
    });
    const {response, status} = await cac.getCacRegistrationReportByReference(
      reference,
      this.state.currentAgent.agentCode,
    );
    console.log('CACREPORTDETAILS', response);
    if (status === SUCCESS_STATUS) {
      this.setState(
        {
          isLoading: false,
          didErrorOccur: false,
          errorMessage: null,
          registrationRequestPayload:
            response.data.content[0].registrationRequestPayload,
          reportStatus: response.data.content[0].status,
          queriedFieldMap: response.data.content[0].queriedFieldMap,
          errorLength: response.data.content[0].queriedFieldMap.length,
        },
        () => {
          console.log('queriedFieldMap', this.state.queriedFieldMap);
          console.log(
            'registrationRequestPayload',
            this.state.registrationRequestPayload,
          );
        },
      );
      if (this.state.reportStatus === 'QUERIED') {
        this.setState({
          queried: true,
        });
        console.log('queriedStatus0', this.state.queried);
      }
    } else {
      this.setState({
        didErrorOccur: true,
        errorMessage: await handleErrorResponse(response),
        isLoading: false,
      });
    }
  }
  render() {
    const {didErrorOccur, isLoading} = this.state;
    return (
      <>
        <View
          style={{
            flex: 1,
          }}>
          <Header
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            navigationIconColor={COLOUR_WHITE}
            leftComponent={
              <Icon
                color={COLOUR_WHITE}
                name="chevron-left"
                onPress={() => this.props.navigation.goBack()}
                size={40}
                type="material"
                underlayColor="transparent"
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title={this.state.registrationRequestPayload.proposedOption1}
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
          />
          {/* <ReportFormCacReportFormCac /> this.state.businessDetails.businessName || "" */}

          {Boolean(!isLoading) && (
            <>
              <CacReportCacReport
                propagateFormErrors={this.state.propagateFormErrors}
                ref={form => (this.cacReportForm = form)}
                superAgents={this.props.superAgents}
                formData={this.state.registrationRequestPayload}
                cacReportDetails={this.state.registrationRequestPayload}
                buttonTitle={
                  this.state.reportStatus === 'PROCESSING'
                    ? 'REQUERY'
                    : 'UPDATE'
                }
                showButton={
                  this.state.reportStatus === 'SUCCESSFUL' ? false : true
                }
                queried={this.state.queried}
                onPress={
                  this.state.reportStatus === 'PROCESSING'
                    ? this.requeryReport
                    : this.updateReport
                }
                loading={this.state.buttonLoading}
                queriedFieldMap={this.state.queriedFieldMap}
                // count={this.state.errorLength}
              />
            </>
          )}
          {didErrorOccur && this.errorFallbackMessage()}
          {isLoading && <ActivityIndicator />}
        </View>
        <View style={{marginTop: 30}}>
          {this.state.showResponseMessage && (
            <StatusMessageModal
              navigation={this.props.navigation}
              showprovideKycModal={this.state.showResponseMessage}
              onPressNext={
                this.state.updateSuccess
                  ? () => {
                      this.setState({showResponseMessage: false});
                      this.props.navigation.goBack();
                    }
                  : () => {
                      this.setState({showResponseMessage: false});
                    }
              }
              onSkip={
                this.state.updateSuccess
                  ? () => {
                      this.setState({showResponseMessage: false});
                      this.props.navigation.goBack();
                    }
                  : () => {
                      this.setState({showResponseMessage: false});
                    }
              }
              source={
                this.state.updateSuccess
                  ? require('../../../../../../animations/checked-done-2.json')
                  : require('../../../../../../animations/14651-error-animation (2).json')
              }
              message={
                this.state.updateSuccess
                  ? 'Your details have been updated successfully'
                  : this.state.errorResponse
              }
              title={this.state.updateSuccess ? 'CLOSE' : 'TRY AGAIN'}
            />
          )}
        </View>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(CacReportDetails);
