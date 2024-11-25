import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';

import moment from 'moment';
import Button from '../../../../../components/button';
import FormDate from '../../../../../components/form-controls/form-date';
import FormInput from '../../../../../components/form-controls/form-input';
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
import HistoricalTransactionTypes from '../../../../../fixtures/historical_transaction_types';
import TransactionStatuses from '../../../../../fixtures/transaction_statuses';
import TransactionTypes from '../../../../../fixtures/transaction_types';
import FeatureFlag from '../../../../../fragments/feature-flag';
import {platformService} from '../../../../../setup/api';

export default class ReportTransactionsFilterScene extends React.Component {
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
      },
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.loadData = this.loadData.bind(this);
    this.updateParam = this.updateParam.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const {response, status} = await platformService.getAgentsUnderAggregator();
    const domainCode = this.props.route?.params?.domainCode || '';
    const isHistoricalData =
      this.props.route?.params?.isHistoricalData || false;

    if (status === SUCCESS_STATUS) {
      this.setState({
        agents: response.content,
        filters: {
          domainCode,
        },
        isHistoricalData,
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

  async applyFilters() {
    this.props.navigation.replace('ReportTransactions', {
      refresh: true,
      filters: this.state.filters,
      isHistoricalData: this.state.isHistoricalData,
    });
  }

  historicalDataFilters() {
    return (
      <React.Fragment>
        <FormInput
          hideOptionalLabel
          text="GMPP Ref:"
          placeholder="GMPP Ref"
          onChangeText={gmppRef =>
            this.updateParam({
              gmppRef,
            })
          }
          outerContainerStyle={{
            marginBottom: 20,
          }}
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            marginTop: 5,
            padding: 5,
          }}
        />

        <FormPicker
          choices={HistoricalTransactionTypes.map(({value, name}) => ({
            label: name,
            value,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={transactionType => {
            this.updateParam({transactionType});
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Transaction Type:"
          validators={{
            required: true,
          }}
        />
      </React.Fragment>
    );
  }

  transactionDataFilters() {
    return (
      <React.Fragment>
        <FormInput
          hideOptionalLabel
          text="Username:"
          placeholder="Username"
          onChangeText={username =>
            this.updateParam({
              username,
            })
          }
          outerContainerStyle={{
            marginBottom: 20,
          }}
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            marginTop: 5,
            padding: 5,
          }}
        />

        <FormInput
          hideOptionalLabel
          text="Transaction Ref:"
          placeholder="Transaction Ref"
          onChangeText={transactionRef =>
            this.updateParam({
              transactionRef,
            })
          }
          outerContainerStyle={{
            marginBottom: 20,
          }}
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            marginTop: 5,
            padding: 5,
          }}
        />

        <FormPicker
          choices={TransactionStatuses.map(({id, name}) => ({
            label: name,
            value: id,
          }))}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onSelect={statusCodeInt => {
            this.updateParam({statusCodeInt});
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          propagateError={this.props.propagateFormErrors}
          text="Status:"
          validators={{
            required: true,
          }}
        />

        <FormPicker
          choices={TransactionTypes.map(({id, name}) => ({
            label: name,
            value: id,
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

        <FeatureFlag
          requiredDomain={SUPER_AGENT}
          uid="transaction-filters-agent-field">
          {() => (
            <FormPicker
              choices={this.state.agents.map(({businessName, walletRef}) => ({
                label: businessName,
                value: walletRef,
              }))}
              defaultValue={this.state.filters?.domainCode}
              innerContainerStyle={styles.formInputInnerContainerStyle}
              onSelect={domainCode => {
                this.updateParam({domainCode});
              }}
              outerContainerStyle={styles.formInputOuterContainerStyle}
              propagateError={this.props.propagateFormErrors}
              text="Agent:"
              validators={{
                required: true,
              }}
            />
          )}
        </FeatureFlag>
      </React.Fragment>
    );
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
              onPress={() => {
                this.props.navigation.replace('ReportTransactions', {
                  refresh: true,
                  filters: this.state.filters,
                  isHistoricalData: this.state.isHistoricalData,
                });
              }}
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
            onDateSelect={startDate => {
              console.log({startDate});
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

          {this.state.isHistoricalData
            ? this.historicalDataFilters()
            : this.transactionDataFilters()}
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
            onPressOut={() => {
              this.props.navigation.replace('ReportTransactions', {
                refresh: true,
                filters: this.state.filters,
                isHistoricalData: this.state.isHistoricalData,
              });
            }}
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
