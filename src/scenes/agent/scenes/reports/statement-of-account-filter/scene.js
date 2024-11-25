import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';

import moment from 'moment';
import Button from '../../../../../components/button';
import FormDate from '../../../../../components/form-controls/form-date';
import Header from '../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';

export default class StatementOfAccountFilterScene extends React.Component {
  constructor() {
    super();

    const currentDate = moment().format('DD-MM-YYYY');
    const startDate = moment().subtract(1, 'months').format('DD-MM-YYYY');
    const endDate = moment().format('DD-MM-YYYY');

    this.state = {
      currentDate,
      filters: {
        endDate,
        startDate,
      },
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
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

  normalizeFilters(filters) {
    return {
      ...filters,
      startDate: moment(filters.startDate, 'DD-MM-YYYY').format(
        'YYYY-MM-DD[T23:59:59]',
      ),
      endDate: moment(filters.endDate, 'DD-MM-YYYY').format(
        'YYYY-MM-DD[T00:00:00]',
      ),
    };
  }

  async cancelFilters() {
    const category = this.props.route?.params?.category || null;

    this.props.navigation.replace('StatementOfAccount', {
      refresh: false,
    });
  }

  async applyFilters() {
    const category = this.props.route?.params?.category || null;

    this.props.navigation.replace('StatementOfAccount', {
      refresh: true,
      filters: this.normalizeFilters(this.state.filters),
      category,
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
              onPress={this.cancelFilters}
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
