import React from 'react';

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import {onboardingService} from '../../../../../../App';
import Accordion from '../../../../../components/accordion';
import ActivityIndicator from '../../../../../components/activity-indicator';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import ProgressiveImage from '../../../../../components/progressive-image';
import {NIGERIA} from '../../../../../constants';
import {SUCCESS_STATUS} from '../../../../../constants/api';
import {BLOCKER} from '../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import CountriesStatesLgas from '../../../../../fixtures/countries_states_lgas';
import {setIsFastRefreshPending} from '../../../../../services/redux/actions/tunnel';
import {flashMessage} from '../../../../../utils/dialog';
import handleErrorResponse from '../../../../../utils/error-handlers/api';

const EditableHeader = props => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{marginTop: 10, flex: 1, fontWeight: 'bold'}}>
        {props.label}:
      </Text>
    </View>
  );
};

class ViewApplicantDetails extends React.Component {
  state = {
    application: null,
    isLoading: true,
    reason: '',
  };

  componentDidMount() {
    this.loadApplicationToState();
  }

  constructor() {
    super();
    this.state = {
      application: {},
      isLoading: true,
      isReady: false,
      reason: '',
    };
    this.loadApplicationToState = this.loadApplicationToState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getApplicatId();
  }

  serializeApiData(attachments) {
    return attachments.map(value => {
      documentType = value.documentType.replace('_', ' ');
      return {
        hasBeenUploaded: true,
        uri: `https://mufasa.interswitchng.com/p/finch/onboarding/${value.documentName}`,
        fileName: documentType,
        documentName: documentType,
        documentType: documentType,
      };
    });
  }

  getApplicatId = async () => {
    console.log('APPLICANT DETAILS 1');

    const {applicantDetails} = this.props.route?.params || {};
    console.log('APPLICANT DETAILS 2:', applicantDetails);
    const {status, response} = await onboardingService.getApplicationAggregator(
      applicantDetails.applicationId,
    );
    console.log('APPLICANT DETAILS REPLACE::', response);

    const application = response;
    console.log('APPLICANT DETAILS USE:', application);

    this.loadApplicationToState(application);
    this.initiate(application);
    this.setState({
      reason: application.declineReason,
    });
    console.log('reason', this.state.reason);
  };

  initiate = async application => {
    const {status, response} =
      await onboardingService.getDocumentsByApplicationAggregator(
        application.applicationId,
      );
    if (status === SUCCESS_STATUS) {
      const attachments = this.serializeApiData(response);
      this.setState({
        attachments,
      });
    }
  };

  async loadApplicationToState(application) {
    this.setState({
      application,
      isLoading: false,
      isReady: true,
    });
  }

  get personalDetails() {
    const personalInformation = this.state.application
      ? this.state.application?.applicantDetails
      : {};

    return (
      <View style={styles.section}>
        <Text style={{marginTop: 10, fontWeight: 'bold', flex: 1}}>
          Phone Number:
        </Text>
        <Text>{personalInformation?.phoneNumber}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Email Address:</Text>
        <Text>{personalInformation?.emailAddress}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Gender:</Text>
        <Text>{personalInformation?.gender}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Date of Birth:</Text>
        <Text>{personalInformation?.dob}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>BVN:</Text>
        <Text>{personalInformation?.bvn}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Status:</Text>
        <Text>{this.state.application.applicationType}</Text>
      </View>
    );
  }

  get kycDetails() {
    const personalInformation = this.state.application
      ? this.state.application.applicantDetails
      : {};

    return (
      <View style={styles.section}>
        <EditableHeader
          onPressOut={() => this.props.navigation.replace('kYCInformation')}
          label="Identification Type"
        />

        <Text>{personalInformation?.identificationType}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>
          Identification Number:
        </Text>
        <Text>{personalInformation?.identificationNumber}</Text>

        <Text>{'\n'}</Text>
        {this.state.attachments?.map((value, index) => {
          return (
            <>
              <View key={index} style={{display: 'flex', flexDirection: 'row'}}>
                <ProgressiveImage
                  thumbnailSource={{
                    uri:
                      value.uri ||
                      'https://mufasa.interswitchng.com/p/finch/onboarding/7105_UTILITY_BILL.jpeg',
                  }}
                  source={{
                    uri:
                      value.uri ||
                      'https://mufasa.interswitchng.com/p/finch/onboarding/7105_UTILITY_BILL.jpeg',
                  }}
                  style={{
                    height: 75,
                    width: 75,
                    borderRadius: 5,
                  }}
                  resizeMode="cover"
                />
                <Text style={{verticalAlign: 'center'}}>
                  {'\n'}
                  {value?.documentType}
                </Text>
              </View>
              <View style={{height: 5}} />
            </>
          );
        })}
      </View>
    );
  }

  get businessDetails() {
    const businessDetails = this.state.application?.businessDetails
      ? this.state.application.businessDetails
      : {};
    const country = CountriesStatesLgas.find(value => value?.name === NIGERIA);
    const state = country.states.find(
      value => value.id == businessDetails?.state,
    );
    const lga = state?.lgas?.find(value => value.id == businessDetails?.lga);

    return (
      <View style={styles.section}>
        <EditableHeader
          onPressOut={() => this.props.navigation.replace('BusinessDetails')}
          label="Business Name"
        />
        <Text>{businessDetails.businessName}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>
          Business Address:
        </Text>
        <Text>{businessDetails.address}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>State:</Text>
        <Text>{state?.name}</Text>
        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Lga:</Text>
        <Text>{lga?.name}</Text>
      </View>
    );
  }

  get nextOfKinDetails() {
    let NextOfKinInformation = this.state.application?.nextOfKin
      ? this.state.application.nextOfKin
      : {};
    if (NextOfKinInformation == {}) {
      NextOfKinInformation =
        this.state.application?.applicantDetails?.nextOfKin;
    }
    return (
      <View style={styles.section}>
        <EditableHeader
          onPressOut={() => this.props.navigation.replace('NextOfKinDetails')}
          label="Name"
        />
        <Text>{`${
          NextOfKinInformation.firstName ? NextOfKinInformation.firstName : ''
        } ${
          NextOfKinInformation.middleName ? NextOfKinInformation.middleName : ''
        } ${
          NextOfKinInformation.surname ? NextOfKinInformation.surname : ''
        }`}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Phone Number:</Text>
        <Text>{NextOfKinInformation.phoneNumber}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Relationship:</Text>
        <Text>{NextOfKinInformation.relationship}</Text>

        <Text style={{marginTop: 10, fontWeight: 'bold'}}>Address:</Text>
        <Text>{NextOfKinInformation.address}</Text>
      </View>
    );
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    const application = this.state.application;
    const {status, response, code} = await onboardingService.submitAggregator(
      application,
    );

    if (status === SUCCESS_STATUS) {
      this.setState({
        isLoading: false,
      });

      AsyncStorage.removeItem(APPLICATION);
      return;
    }

    flashMessage('Error', await handleErrorResponse(response), BLOCKER);

    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View style={{flex: 1}}>
          <Header
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            navigationIconColor={COLOUR_WHITE}
            leftComponent={
              <Icon
                color={COLOUR_WHITE}
                underlayColor="transparent"
                name="chevron-left"
                size={40}
                type="material"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title="Applicant Details"
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
          />
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`${this.state.application.applicantDetails.firstName} ${
            this.state.application.applicantDetails.middleName
              ? this.state.application.applicantDetails.middleName
              : ''
          } ${this.state.application.applicantDetails.surname}`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <ScrollView>
          <View
            style={{
              alignContent: 'center',
              padding: 20,
              justifyContent: 'center',
            }}>
            <Text style={{color: COLOUR_DARK_RED}}>*{this.state.reason}</Text>
          </View>

          <Accordion
            content={this.personalDetails}
            expanded={true}
            header="Personal Details"
          />
          <Accordion
            content={this.kycDetails}
            expanded={true}
            header="KYC Information"
          />
          <Accordion
            content={this.businessDetails}
            expanded={true}
            header="Business Details"
          />
          <Accordion
            content={this.nextOfKinDetails}
            expanded={true}
            header="Next Of Kin Details"
          />
          {this.state.application.applicationType === 'DRAFT' && (
            <View style={styles.but}>
              <Button
                containerStyle={{
                  marginTop: 10,
                  width: '100%',
                }}
                loading={this.state.isLoading}
                onPress={() => {
                  this.props.navigation.navigate('AggregatorLanding', {
                    applicantDetails: this.state.application,
                  });
                }}
                title="Resume Application"
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  but: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  section: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#cccccc',
  },
});

function mapStateToProps(state) {
  return {
    application: state.fmpaTunnel.application,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewApplicantDetails);
