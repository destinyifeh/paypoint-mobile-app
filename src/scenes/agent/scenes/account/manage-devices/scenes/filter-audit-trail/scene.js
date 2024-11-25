import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import moment from 'moment';

import {Icon} from 'react-native-elements';

import Button from '../../../../../../../components/button';
import FormDate from '../../../../../../../components/form-controls/form-date';
import FormPicker from '../../../../../../../components/form-controls/form-picker';
import Header from '../../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';

const AuditActions = [
  {
    name: 'Login',
    value: 'LOGIN',
  },
  {
    name: 'Logout',
    value: 'LOGOUT',
  },
  {
    name: 'Password Change',
    value: 'CHANGE_PASSWORD',
  },
  {
    name: 'Password Reset',
    value: 'RESET_PASSWORD',
  },
  {
    name: 'Password Reset Email Sent',
    value: 'RESET_PASSWORD_SEND_EMAIL',
  },
  {
    name: 'Create',
    value: 'CREATE',
  },
  {
    name: 'Update',
    value: 'UPDATE',
  },
  {
    name: 'Delete',
    value: 'DELETE',
  },
  {
    name: 'Activate',
    value: 'ACTIVATE',
  },
  {
    name: 'Deactivate',
    value: 'DEACTIVATE',
  },
];

export default class FilterAuditTrailScene extends React.Component {
  constructor() {
    super();

    const currentDate = moment().format('DD-MM-YYYY');

    this.state = {
      currentDate,
      devices: [],
      filters: {
        endDate: moment().format('DD-MM-YYYY'),
        startDate: moment().subtract(6, 'months').format('DD-MM-YYYY'),
      },
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.updateParam = this.updateParam.bind(this);
  }

  updateParam(params) {
    this.setState({
      filters: {
        ...this.state.filters,
        ...params,
      },
    });
  }

  async applyFilters() {
    console.log(this.state.filters);
    const {devices = []} = this.props.route?.params || {};

    this.props.navigation.replace('ManageDevicesAuditTrail', {
      devices: devices,
      refresh: true,
      filters: {
        ...this.state.filters,
        endDate: moment(this.state.filters.endDate, 'DD-MM-YYYY').format(
          'YYYY-MM-DD[ 23:59:59]',
        ),
        startDate: moment(this.state.filters.startDate, 'DD-MM-YYYY').format(
          'YYYY-MM-DD[ 00:00:00]',
        ),
      },
    });
  }

  render() {
    const {devices = []} = this.props.route?.params || {};

    return (
      <View
        style={{
          backgroundColor: COLOUR_SCENE_BACKGROUND,
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_RED}
              underlayColor="transparent"
              name="close"
              size={32}
              type="material"
              onPress={() =>
                this.props.navigation.navigate('ManageDevicesAuditTrail')
              }
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Filters"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}>
          <FormDate
            defaultValue={this.state.filters.startDate}
            innerContainerStyle={{
              backgroundColor: COLOUR_WHITE,
              marginTop: 5,
            }}
            maxDate={this.state.currentDate}
            onDateSelect={startDate =>
              this.updateParam({
                startDate,
              })
            }
            outerContainerStyle={{
              marginBottom: 20,
            }}
            text="Start Date:"
          />

          <FormDate
            defaultValue={this.state.filters.endDate}
            innerContainerStyle={{
              backgroundColor: COLOUR_WHITE,
              marginTop: 5,
            }}
            maxDate={this.state.currentDate}
            minDate={this.state.filters.startDate}
            onDateSelect={endDate =>
              this.updateParam({
                endDate,
              })
            }
            outerContainerStyle={{
              marginBottom: 20,
            }}
            text="End Date:"
          />

          <FormPicker
            choices={devices.map(({deviceid, deviceName}) => ({
              label: deviceName,
              value: deviceid,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={deviceId => {
              this.updateParam({deviceId});
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Device:"
            validators={{
              required: true,
            }}
          />

          <FormPicker
            choices={AuditActions.map(({name, value}) => ({
              label: name,
              value,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={auditAction => {
              this.updateParam({auditAction});
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Audit Action:"
            validators={{
              required: true,
            }}
          />
        </ScrollView>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 20,
          }}>
          <Button
            transparent
            buttonStyle={{paddingHorizontal: 40}}
            onPressOut={() =>
              this.props.navigation.navigate('ManageDevicesAuditTrail')
            }
            title="Cancel"
            titleStyle={{color: COLOUR_GREY}}
          />
          <Button
            buttonStyle={{paddingHorizontal: 40}}
            onPressOut={this.applyFilters}
            title="Apply Filters"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputInnerContainerStyle: {
    marginTop: 5,
  },
  formInputOuterContainerStyle: {
    marginBottom: 20,
  },
});
