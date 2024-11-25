import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from "react-native-elements";
import Accordion from "../../components/accordion";
import ActivityIndicator from "../../components/activity-indicator";
import Button from "../../components/button";
import Header from "../../components/header";
import { APPLICATION, NIGERIA } from "../../constants";
import {
	COLOUR_BLUE,
	COLOUR_WHITE,
	CONTENT_LIGHT
} from "../../constants/styles";
import CountriesStatesLgas from '../../fixtures/countries_states_lgas';
import IdentificationTypes from '../../fixtures/identification_types';
import { loadData } from "../../utils/storage";

export default class ApplicationPreview extends React.Component{
  state = {
    application: null,
    isLoading: true,
  };

  constructor() {
		super();

		this.loadApplicationToState = this.loadApplicationToState.bind(this);
  }

  componentDidMount() {
    this.loadApplicationToState();
  }

  async loadApplicationToState() {
		const application = JSON.parse(await loadData(APPLICATION));
		console.log('APPLICATION IS: ', application);

		this.setState({
			application,
			isLoading: false
		});
  }

  get personalDetails() {
		const personalInformation = this.state.application ? this.state.application.applicantDetails : {};

		const identificationType = IdentificationTypes.find(
			value => value.id == personalInformation.identificationType
		)
		const country = CountriesStatesLgas.find(
			value => value.id == personalInformation.nationality
		);
		const state = country.states.find(
			value => value.id == personalInformation.state
		);
		const lga = state?.lgas?.find(
			value => value.id == personalInformation.localGovernmentArea
		)

		return (
			<View style={styles.section}>
				<Text style={{fontWeight:'bold',fontSize:20}}>Contact Information</Text>
				<Text style={{marginTop: 10, fontWeight:'bold'}}>First Name:</Text>
				<Text>{personalInformation.firstName}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Last Name:</Text>
				<Text>{personalInformation.surname}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Middle Name:</Text>
				<Text>{personalInformation.middleName}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Email Address:</Text>
				<Text>{personalInformation.emailAddress}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Phone Number:</Text>
				<Text>{personalInformation.phoneNumber}</Text>

				<Text style={{marginTop:10,fontWeight:'bold',fontSize:20}}>Residential Information</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Country:</Text>
				<Text>{country?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>State:</Text>
				<Text>{state?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>LGA:</Text>
				<Text>{lga?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Address:</Text>
				<Text>{personalInformation.address}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Closest Landmark:</Text>
				<Text>{personalInformation.closestLandMark}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold',fontSize:20}}>Personal Information</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Date Of Birth:</Text>
				<Text>{personalInformation.dob}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Place Of Birth:</Text>
				<Text>{personalInformation.placeOfBirth}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>ID Number:</Text>
				<Text>{personalInformation.identificationNumber}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>BVN:</Text>
				<Text>{personalInformation.bvn}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Gender:</Text>
				<Text>{personalInformation.gender}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>ID Type:</Text>
				<Text>{identificationType?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Nationality:</Text>
				<Text>{country?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Mother's Maiden Name</Text>
				<Text>{personalInformation.mothersMaidenName}</Text>
			</View>
		)

  }

  get businessDetails() {
		const businessDetails = this.state.application ? this.state.application.businessDetails : {};
		const country = CountriesStatesLgas.find(
			value => value?.name === NIGERIA
		);
		const state = country.states.find(
			value => value.id == businessDetails.state
		);
		const lga = state?.lgas?.find(
			value => value.id == businessDetails.localGovernmentArea
		);

		return (
			<View style={styles.section}>
				<Text style={{fontWeight:'bold',fontSize:20}}>Business Information</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Business Name:</Text>
				<Text>{businessDetails.businessName}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Company Registration No:</Text>
				<Text>{businessDetails.companyRegistrationNumber}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Bank Name:</Text>
				<Text>{businessDetails.bankName}</Text>

				<Text  style={{marginTop: 10,fontWeight:'bold'}}>Account Number:</Text>
				<Text>{businessDetails.accountNumber}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Business Type:</Text>
				<Text>{businessDetails.businessType}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>State:</Text>
				<Text>{state?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>LGA:</Text>
				<Text>{lga?.name}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Business Address:</Text>
				<Text>{businessDetails.address}</Text>
			</View>
		)
  }

  get nextOfKinDetails(){
		const NextOfKinInformation = this.state.application ? this.state.application.applicantDetails.nextOfKin : {};

		return (
			<View style={styles.section}>
				<Text style={{fontWeight:'bold',fontSize:20}}>Personal Information</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}} >First Name:</Text>
				<Text>{NextOfKinInformation.firstName}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Last Name:</Text>
				<Text>{NextOfKinInformation.surname}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Phone Number:</Text>
				<Text>{NextOfKinInformation.phoneNumber}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Gender:</Text>
				<Text>{NextOfKinInformation.gender}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Relationship:</Text>
				<Text>{NextOfKinInformation.relationship}</Text>

				<Text style={{marginTop: 10,fontWeight:'bold'}}>Address:</Text>
				<Text>{NextOfKinInformation.address}</Text>
			</View>
		)
  }

  render() {
		if (this.state.isLoading) {
			return <ActivityIndicator />
		}

		return (
			<View style={{flex: 1}}>
				<Header
					containerStyle={{
						backgroundColor: COLOUR_BLUE
					}}
					navigationIconColor={COLOUR_WHITE}
					leftComponent={<Icon
						color={COLOUR_WHITE}
						underlayColor="transparent"
						name="chevron-left"
						size={40}
						type="material"
						onPress={() => this.props.navigation.goBack()}
					/>}
					hideNavigationMenu={this.props.hideNavigator}
					showNavigationMenu={this.props.showNavigator}
					statusBarProps={{
						backgroundColor: 'transparent',
						barStyle: CONTENT_LIGHT
					}}
					title="Application Preview"
					titleStyle={{
						color: COLOUR_WHITE,
						fontWeight: 'bold'
					}}
				/>

				<ScrollView>
					<Accordion
						content={this.personalDetails}
						expanded={true}
						header="Personal Details"
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
							}}
							onPress={() => this.props.navigation.replace('ServiceLevelAgreement')}
							title="PROCEED"
						/>
					</View>
				</ScrollView>
			</View>
		)	
  }
};

const styles = StyleSheet.create({
  but: {
		alignItems: 'center',
		justifyContent:'flex-end',
		marginBottom: 10,
		paddingHorizontal: 20
	},
	section: {
		padding: 20
	}
});
