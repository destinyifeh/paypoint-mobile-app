import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import Accordion from '../../../components/accordion';
import ActivityIndicator from '../../../components/activity-indicator';
import Button from '../../../components/button';
import Header from '../../../components/header';
import {NIGERIA} from '../../../constants';
import {DOCUMENT_BASE_URL} from '../../../constants/api-resources';
import {
  APPLICATION_SELF_ONBOARDING,
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../constants/styles';
import CountriesStatesLgas from '../../../fixtures/countries_states_lgas.json';
import IdentificationTypes from '../../../fixtures/identification_types.json';
import {loadData} from '../../../utils/storage';

export default class SelfOnboardingApplicationPreview extends React.Component {
  state = {
    application: null,
    isLoading: true,
    attachments: null,
    initialAttachment: [],
  };

  constructor() {
    super();

    this.loadApplicationToState = this.loadApplicationToState.bind(this);
    this.getIdentificationTypeName = this.getIdentificationTypeName.bind(this);
    this.serializeApiData = this.serializeApiData.bind(this);
    this.serializeUploadData = this.serializeUploadData.bind(this);
  }

  componentDidMount() {
    this.loadApplicationToState();
  }

  async loadApplicationToState() {
    const application = JSON.parse(await loadData(APPLICATION_SELF_ONBOARDING));
    const initialUpload = JSON.parse(await loadData('PASSPORT_UPLOAD_RES'));

    const attachDoc = application?.documentsList;
    const attachments = this.serializeApiData(attachDoc);
    const uploadData = this.serializeUploadData(initialUpload);

    this.setState({
      application,
      isLoading: false,
      attachments: attachments,
      initialAttachment: uploadData,
    });
    console.log('APPLICATION IS: ', application);
  }

  serializeUploadData(attachment) {
    const documentNameWithoutData = attachment.documentName.replace('data', '');
    console.log(documentNameWithoutData, 'docooo');
    return {
      hasBeenUploaded: true,
      uri: `${DOCUMENT_BASE_URL}/agent-kyc/${documentNameWithoutData}`,
      fileName: attachment.documentName,
      documentName: attachment.documentType,
      documentType: attachment.documentType,
      documentId: attachment.documentId,
    };
  }

  serializeApiData(attachments) {
    console.log(attachments, 'att');
    return attachments?.map(value => {
      console.log(
        `${DOCUMENT_BASE_URL}/agent-kyc/${value.documentName.replace(
          'data',
          '',
        )}`,
        'NUGAGEE IMAGE URL NEW',
      );

      return {
        hasBeenUploaded: true,

        uri: `${DOCUMENT_BASE_URL}/agent-kyc/${value.documentName.replace(
          'data',
          '',
        )}`,

        fileName: value.documentName,
        documentName: value.documentType,
        documentType: value.documentType,
        documentId: value.documentId,
      };
    });
  }

  getIdentificationTypeName(id) {
    const identificationType = IdentificationTypes.find(
      value => value.id == id,
    );
    return identificationType ? identificationType.name : id;
  }

  get personalDetails() {
    const personalInformation = this.state.application
      ? this.state.application.applicantDetails
      : {};

    const country = CountriesStatesLgas.find(
      value => value.id == personalInformation?.nationality,
    );
    const state = country?.states.find(
      value => value.id == personalInformation?.state,
    );
    const lga = state?.lgas?.find(
      value => value.id == personalInformation?.localGovernmentArea,
    );

    return (
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          Contact Information
        </Text>
        {personalInformation?.firstName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>First Name:</Text>
            <Text>{personalInformation?.firstName}</Text>
          </>
        )}
        {personalInformation?.surname && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Last Name:</Text>
            <Text>{personalInformation?.surname}</Text>
          </>
        )}
        {personalInformation?.middleName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Middle Name:
            </Text>
            <Text>{personalInformation?.middleName}</Text>
          </>
        )}
        {personalInformation?.emailAddress && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Email Address:
            </Text>
            <Text>{personalInformation?.emailAddress}</Text>
          </>
        )}
        {personalInformation?.phoneNumber && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Phone Number:
            </Text>
            <Text>{personalInformation?.phoneNumber}</Text>
          </>
        )}
        {country?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 20}}>
              Residential Information
            </Text>
          </>
        )}
        {country?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Country:</Text>
            <Text>{country?.name}</Text>
          </>
        )}
        {state?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>State:</Text>
            <Text>{state?.name}</Text>
          </>
        )}
        {lga?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>LGA:</Text>
            <Text>{lga?.name}</Text>
          </>
        )}
        {personalInformation?.address && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Address:</Text>
            <Text>{personalInformation?.address}</Text>
          </>
        )}
        {personalInformation?.closestLandMark && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Closest Landmark:
            </Text>
            <Text>{personalInformation?.closestLandMark}</Text>
          </>
        )}
        <Text style={{marginTop: 10, fontWeight: 'bold', fontSize: 20}}>
          Personal Information
        </Text>
        {personalInformation?.dob && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Date Of Birth:
            </Text>
            <Text>{personalInformation?.dob}</Text>
          </>
        )}
        {personalInformation?.placeOfBirth && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Place Of Birth:
            </Text>
            <Text>{personalInformation?.placeOfBirth}</Text>
          </>
        )}
        {personalInformation?.identificationNumber && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>ID Number:</Text>
            <Text>{personalInformation?.identificationNumber}</Text>
          </>
        )}
        {personalInformation?.bvn && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>BVN:</Text>
            <Text>{personalInformation?.bvn}</Text>
          </>
        )}
        {personalInformation?.gender && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Gender:</Text>
            <Text>{personalInformation?.gender}</Text>
          </>
        )}
        {personalInformation?.identificationType && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>ID Type:</Text>
            <Text>
              {this.getIdentificationTypeName(
                personalInformation?.identificationType,
              )}
            </Text>
          </>
        )}
        {country?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Nationality:
            </Text>
            <Text>{country?.name}</Text>
          </>
        )}
        {personalInformation?.mothersMaidenName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Mother's Maiden Name:
            </Text>
            <Text>{personalInformation?.mothersMaidenName}</Text>
          </>
        )}
      </View>
    );
  }

  get businessDetails() {
    const businessDetails = this.state.application
      ? this.state.application?.businessDetails
      : {};
    const country = CountriesStatesLgas.find(value => value?.name === NIGERIA);
    const state = country?.states.find(
      value => value.id == businessDetails?.state,
    );
    const lga = state?.lgas?.find(
      value => value.id == businessDetails?.localGovernmentArea,
    );

    return (
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          Business Information
        </Text>
        {businessDetails?.businessName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Business Name:
            </Text>
            <Text>{businessDetails?.businessName}</Text>
          </>
        )}
        {businessDetails?.companyRegistrationNumber && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Company Registration No:
            </Text>
            <Text>{businessDetails?.companyRegistrationNumber}</Text>
          </>
        )}
        {businessDetails?.bankName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Bank Name:</Text>
            <Text>{businessDetails?.bankName}</Text>
          </>
        )}
        {businessDetails?.accountNumber && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Account Number:
            </Text>
            <Text>{businessDetails?.accountNumber}</Text>
          </>
        )}
        {businessDetails?.businessType && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Business Type:
            </Text>
            <Text>{businessDetails?.businessType}</Text>
          </>
        )}
        {state?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>State:</Text>
            <Text>{state?.name}</Text>
          </>
        )}
        {lga?.name && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>LGA:</Text>
            <Text>{lga?.name}</Text>
          </>
        )}
        {businessDetails?.address && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Business Address:
            </Text>
            <Text>{businessDetails?.address}</Text>
          </>
        )}
      </View>
    );
  }

  get nextOfKinDetails() {
    const NextOfKinInformation = this.state.application
      ? this.state.application?.nextOfKin
      : {};

    return (
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>
          Personal Information
        </Text>
        {NextOfKinInformation?.firstName && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Full Name:</Text>
            <Text>{NextOfKinInformation?.firstName}</Text>
          </>
        )}
        {/* {NextOfKinInformation?.surname && (
          <>
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Last Name:
            </Text>
            <Text>{NextOfKinInformation?.surname}</Text>
          </>
        )} */}
        {NextOfKinInformation?.phoneNumber && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Phone Number:
            </Text>
            <Text>{NextOfKinInformation?.phoneNumber}</Text>
          </>
        )}
        {NextOfKinInformation?.emailAddress && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Email Address:
            </Text>
            <Text>{NextOfKinInformation?.emailAddress}</Text>
          </>
        )}
        {NextOfKinInformation?.gender && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Gender:</Text>
            <Text>{NextOfKinInformation?.gender}</Text>
          </>
        )}
        {NextOfKinInformation?.relationship && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>
              Relationship:
            </Text>
            <Text>{NextOfKinInformation?.relationship}</Text>
          </>
        )}
        {NextOfKinInformation?.address && (
          <>
            <Text style={{marginTop: 10, fontWeight: 'bold'}}>Address:</Text>
            <Text>{NextOfKinInformation?.address}</Text>
          </>
        )}
      </View>
    );
  }

  get KYCDoc() {
    const {initialAttachment} = this.state;
    return (
      <View style={styles.section}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>KYC Information</Text>
        {/* {this.state.attachments.map((val, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 20,
            }}
          >
            <Image
              key={index}
              source={{ uri: val.uri }}
              style={{
                height: 75,
                marginRight: 10,
                width: 75,
              }}
              resizeMode="cover"
            />
            <Text>
              {val.documentType === "PASSPORT_PHOTO"
                ? "Passport Photograph"
                : val.documentType}
            </Text>
          </View>
        ))} */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            marginTop: 20,
          }}>
          {!initialAttachment.uri ? (
            <ActivityIndicator />
          ) : (
            <Image
              source={{uri: initialAttachment.uri}}
              style={{
                height: 75,
                marginRight: 10,
                width: 75,
              }}
              resizeMode="cover"
            />
          )}
          <Text>
            {initialAttachment.documentType === 'PASSPORT_PHOTO'
              ? 'Passport Photograph'
              : initialAttachment.documentType}
          </Text>
        </View>
      </View>
    );
  }
  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
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
              onPress={() =>
                this.props.navigation.replace('SelfOnboardingNOKScene', {
                  isFromDashboard: false,
                  selfOnboarding: false,
                  isBackButton: true,
                })
              }
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Application Preview"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <ScrollView>
          <Accordion
            content={this.personalDetails}
            expanded={true}
            header="Personal Details"
          />
          <Accordion
            content={this.KYCDoc}
            expanded={true}
            header="KYC Details"
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

          <View style={styles.but}>
            <Button
              containerStyle={{
                // marginBottom: 10,
                marginTop: 10,
                width: '100%',
                backgroundColor: COLOUR_BLUE,
              }}
              onPress={() =>
                this.props.navigation.replace('ServiceLevelAgreement', {
                  selfOnboarding: true,
                })
              }
              title="PROCEED"
            />
          </View>
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
  },
});
