import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';

import moment from 'moment';
import { platformService } from '../../../../../setup/api';
import FormInput from '../../../../../components/form-controls/form-input';
import FormPicker from '../../../../../components/form-controls/form-picker';
import Header from '../../../../../components/header';
import { COLOUR_BLUE, COLOUR_GREY, COLOUR_RED, COLOUR_SCENE_BACKGROUND, COLOUR_WHITE, CONTENT_LIGHT } from '../../../../../constants/styles';
import Button from '../../../../../components/button';


const APPROVAL_STATUS = [
  { name: "Draft", id: 1 },
  { name: "Awaiting Validation", id: 2 },
  { name: "Awaiting Approval", id: 3 },
  { name: "Approved", id: 4 },
  { name: "Rejected", id: 5 },
  { name: "Cancelled", id: 6 }
];

export default class ApplicantsFilterScene extends React.Component {

  constructor() {
    super();

    const currentDate = moment().format('DD-MM-YYYY');
    const startDate = moment().subtract(1, 'months').format('DD-MM-YYYY');
    const endDate = moment().format('DD-MM-YYYY');

    this.state = {
      agents: [],
      currentDate,
      filters: {
        endDate,
        startDate,
      }
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateParam = this.updateParam.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const { response, status } = await platformService.getAgentsUnderAggregator();

    if (status === SUCCESS_STATUS) {
      this.setState({
        agents: response.content
      });
    }
  }

  updateParam(params) {
    this.setState({
      filters: {
        ...this.state.filters,
        ...params
      }
    })
  }

  async applyFilters() {

    this.props.navigation.replace('ViewApplicants', {
      refresh: true,
      filters: this.state.filters
    })
  }


  render() {

    return <View style={{
      backgroundColor: COLOUR_SCENE_BACKGROUND,
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
          name="close"
          size={32}
          type="material"
          onPress={() => this.props.navigation.replace('ViewApplicants')}
        />}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Filters"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }} />

      <ScrollView contentContainerStyle={{
        padding: 20
      }}>

        <FormInput
          hideOptionalLabel
          text="Business Name / Phone Number:"
          placeholder="Business Name or Phone Number"
          onChangeText={(searchText) => this.updateParam({
            searchText
          })}
          outerContainerStyle={{
            marginBottom: 20
          }}
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            marginTop: 5,
            padding: 5
          }}
        />
        <FormPicker
          choices={APPROVAL_STATUS.map(({ id, name }) => ({
            label: name,
            value: id
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={(statusCodeInt) => {
            this.updateParam({ statusCodeInt })
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Application Status:"
          validators={{
            required: true
          }}
        />


      </ScrollView>

      <View style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20
      }}>
        <Button
          transparent
          buttonStyle={{ paddingHorizontal: 40 }}
          onPressOut={() => this.props.navigation.replace('ViewApplicants')}
          title="Cancel"
          titleStyle={{ color: COLOUR_GREY }}
        />
        <Button
          buttonStyle={{ paddingHorizontal: 40 }}
          onPressOut={this.applyFilters}
          title="Apply Filters"
        />
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  formInputInnerContainerStyle: {
    marginTop: 5
  },
  formInputOuterContainerStyle: {
    marginBottom: 20
  },
})
