import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import moment from 'moment';
import {Icon} from 'react-native-elements';

import Button from '../../../../../components/button';
import FormDate from '../../../../../components/form-controls/form-date';
import FormPicker from '../../../../../components/form-controls/form-picker';
import Header from '../../../../../components/header';
import {SUPER_AGENT} from '../../../../../constants';
import {SUCCESS_STATUS} from '../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';
import TransactionTypes from '../../../../../fixtures/transaction_types';
import FeatureFlag from '../../../../../fragments/feature-flag';
import {platformService} from '../../../../../setup/api';

export default class CommissionsEarnedFilterScene extends React.Component {
  constructor() {
    super();

    const currentDate = moment().format('DD-MM-YYYY');

    this.state = {
      agents: [],
      currentDate,
      filters: {
        endDate: moment().format('DD-MM-YYYY'),
        startDate: moment().subtract(1, 'months').format('DD-MM-YYYY'),
      },
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateParam = this.updateParam.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const {response, status} = await platformService.getAgentsUnderAggregator();

    const domainCode = this.props.route?.params?.domainCode || '';

    if (status === SUCCESS_STATUS) {
      this.setState({
        agents: response.content,
        filters: {
          domainCode,
        },
      });
    }
  }

  updateParam(params) {
    this.setState({
      filters: {
        ...this.state.filters,
        ...params,
      },
    });
  }

  async cancelFilters() {
    this.props.navigation.replace('CommissionsEarned', {
      refresh: false,
      filters: this.state.filters,
    });
  }

  async applyFilters() {
    this.props.navigation.replace('CommissionsEarned', {
      refresh: true,
      filters: this.state.filters,
    });
  }

  render() {
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
                this.props.navigation.replace('CommissionsEarned', {
                  filters: this.state.filters,
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
            maxDate={this.state.filters.endDate}
            onDateSelect={startDate => {
              this.updateParam({
                startDate,
              });
            }}
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
            choices={TransactionTypes.map(value => ({
              value: value.id,
              label: value.name,
            }))}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={transactionTypeInt => {
              this.updateParam({transactionTypeInt});
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Transaction Type:"
            validators={{
              required: true,
            }}
          />

          <FormPicker
            choices={[
              {
                label: 'Credit',
                value: 'CREDIT',
              },
              {
                label: 'Debit',
                value: 'DEBIT',
              },
            ]}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onSelect={event => {
              this.updateParam({event});
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            propagateError={this.props.propagateFormErrors}
            text="Event:"
            validators={{
              required: true,
            }}
          />

          <FeatureFlag
            requiredDomain={SUPER_AGENT}
            uid="commissions-earned-filters-agent-field">
            {() => (
              <FormPicker
                choices={this.state.agents.map(({businessName, walletRef}) => ({
                  label: businessName,
                  value: walletRef,
                }))}
                innerContainerStyle={styles.formInputInnerContainerStyle}
                onSelect={domainCode => {
                  this.updateParam({domainCode});
                }}
                defaultValue={this.state.filters?.domainCode}
                outerContainerStyle={styles.formInputOuterContainerStyle}
                propagateError={this.props.propagateFormErrors}
                text="Agent:"
                validators={{
                  required: true,
                }}
              />
            )}
          </FeatureFlag>
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
            onPressOut={this.cancelFilters}
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
