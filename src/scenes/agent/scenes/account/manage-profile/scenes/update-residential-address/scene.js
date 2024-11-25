import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Icon, Image } from 'react-native-elements'
import ClickableListItem from '../../../../../../../components/clickable-list-item'
import FormInput from '../../../../../../../components/form-controls/form-input'
import Header from '../../../../../../../components/header'
import Text from '../../../../../../../components/text'
import { 
  COLOUR_BLUE, 
  COLOUR_RED, 
  COLOUR_WHITE, 
  CONTENT_LIGHT, 
  COLOUR_GREY
} from '../../../../../../../constants/styles';
import Button from '../../../../../../../components/button';
import FormPicker from '../../../../../../../components/form-controls/form-picker';
import { MIN_ADDRESS_LENGTH } from '../../../../../../../constants/fields';
import CountriesStatesLga from '../../../../../../../fixtures/countries_states_lgas';
import { loadData } from '../../../../../../../utils/storage';
import AgentSerializer from '../../../../../../../serializers/resources/agent';
import { AGENT } from '../../../../../../../constants';
import { DISABLE_PROFILE_FIELDS } from '../../../../../../../constants/api-resources'

export default class UpdateResidentialAddressInformationScene extends React.Component {
  state = {
    expand: null,
    countries: [],
    form: {

    },
    invalidFields: [],
    states: [],
    lgas: []
  }

  constructor() {
    super()

    this.onNationalitySelect = this.onNationalitySelect.bind(this);
    this.onStateSelect = this.onStateSelect.bind(this);
  }

  componentDidMount() {
    try {
      this.fetchCountries();
      this.loadData();      
    } catch {
      
    }
  }

  fetchCountries() {
    this.setState({
      countries: CountriesStatesLga.map(value => ({
        id: value.id,
        name: value.name,
        // states: value.states
      })
    )})
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    console.log('AGENT INFORMATION', agentInformation);

    const serializedAgentInformation = new AgentSerializer(agentInformation);

    this.setState({
      form: {
        ...this.state.form,
        ...serializedAgentInformation,
      },
    });
  }

  addInvalidField() {

  }

  onLgaSelect() {

  }

  onNationalitySelect(nationality) {
    const country = CountriesStatesLga.find(
      value => value.id == nationality
    );

    this.setState({
      states: country ? country.states.map(value => ({
        id: value.id,
        name: value.name
      })) : [],
    });
  }

  onStateSelect(stateId) {
    const country = CountriesStatesLga.find(
      value => value.id == this.state.form.nationality || value.name == this.state.form.nationality
    );

    const state = country.states.find(
      value => value.id == stateId
    );

    this.setState({
      lgas: state ? state.lgas : []
    });
  }

  updateFormField(params) {

  }

  removeInvalidField() {

  }

  renderItem (item, index) {
    
    const statusIconColor = {
      'Completed': '#32BE69',
      'Failed': '#EE312A',
      'In Progress': '#F8B573'
    }[item.status]

    return <ClickableListItem key={index} onPressOut={() => this.setState({
      expand: this.state.expand === item.time ? null : item.time  
    })} style={{
      backgroundColor: 'white',
      flexDirection: 'row',
      marginBottom: 1,
    }}>
      <View style={{flex: .8, justifyContent: 'space-evenly', paddingLeft: 20}}>
        <Text black>{item.name}</Text>
      </View>

      <View style={{
        alignItems: 'center',
        flex: .2,
        justifyContent: 'center'
      }}>
        <Icon 
          name='chevron-right'
          color={'#B4B7BF'}
          type="material"
          size={50} />
      </View>
    </ClickableListItem>
  }

  renderSectionHeader (item) {
    return <Text style={{lineHeight: 32, marginLeft: 10, marginTop: 30}}>
      {item}
    </Text>
  }

  render () {
    const defaultNationality = this.state.countries.find(
      ({name}) => name === this.state.form.nationality
    );
    
    let defaultState = {};
    try {
      defaultState = CountriesStatesLga.find(
        ({name}) => name === this.state.form.nationality
      ).states.find(
        ({name}) => name === this.state.form.state
      )
    } catch {
      defaultState = {}
    }

    let defaultLga = {};
    try {
      defaultLga = CountriesStatesLga.find(
        ({name}) => name === this.state.form.nationality
      ).states.find(
        ({name}) => name === this.state.form.state
      ).lgas.find(
        ({name}) => name === this.state.form.lga
      )
    } catch {
      defaultLga = {}
    }

    return <View style={{
        backgroundColor: '#F3F3F4',
        flex: 1
      }}>
      <Header 
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        navigationIconColor={COLOUR_WHITE}
        leftComponent={<Icon 
          color={COLOUR_RED}
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
        title="Residential Address"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />
      
      <ScrollView contentContainerStyle={{
        padding: 20
      }}>
        <FormPicker 
          choices={this.state.countries.map(({id, name}) => ({
            label: name,
            value: id
          }))}
          defaultValue={defaultNationality && defaultNationality.id}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(nationality, isValid) => {
            this.updateFormField({nationality});
            this.onNationalitySelect(nationality)
            !isValid ? this.addInvalidField('nationality') : this.removeInvalidField('nationality');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text={`Nationality:`}
          validators={{
            required: true
          }}
        />

        <FormPicker 
          choices={this.state.states.map(({id, name}) => ({
            label: name,
            value: id
          }))}
          defaultValue={defaultState && defaultState.id}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(state, isValid) => {
            this.updateFormField({state});
            this.onStateSelect(state)
            !isValid ? this.addInvalidField('state') : this.removeInvalidField('state');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="State:"
          validators={{
            required: true
          }}
        />

        <FormPicker
          choices={this.state.lgas.map(({id, name}) => ({
            label: name,
            value: id
          }))}
          defaultValue={defaultLga && defaultLga.id}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(lga, isValid) => {
            this.updateFormField({lga});
            !isValid ? this.addInvalidField('lga') : this.removeInvalidField('lga');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="LGA:"
          validators={{
            required: true
          }}
        />

        <FormInput
          autoCompleteType='street-address'
          defaultValue={this.state.form.address}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          multiline
          onChangeText={(address, isValid) => {
            this.updateFormField({address});
            !isValid ? this.addInvalidField('address') : this.removeInvalidField('address');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='1674C, Oko-Awo Rd.'
          propagateError={this.props.propagateFormErrors}
          text="Address:"
          textInputRef={(input) => this.address = input}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: 'sentence',
            required: true,
          }}
        />

        <FormInput
          autoCompleteType='street-address'
          defaultValue={this.state.form.closestLandmark}
          disabled={DISABLE_PROFILE_FIELDS}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(closestLandmark, isValid) => {
            this.updateFormField({closestLandmark});
            !isValid ? this.addInvalidField('closestLandmark') : this.removeInvalidField('closestLandmark');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='Closest landmark'
          propagateError={this.props.propagateFormErrors}
          text="Closest Landmark:"
          textInputRef={(input) => this.closestLandmark = input}
          validators={{
            minLength: MIN_ADDRESS_LENGTH,
            regex: 'sentence',
            required: true,
          }}
        />
      </ScrollView>

      {/* <View style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20
      }}>
        <Button 
          transparent
          buttonStyle={{ paddingHorizontal: 40 }} 
          onPressOut={() => this.props.navigation.goBack()}
          title="Cancel"
          titleStyle={{ color: COLOUR_GREY }}
        />
        <Button 
          buttonStyle={{ paddingHorizontal: 40 }} 
          title="Save" 
        />
      </View> */}

    </View>
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
});
