import React from 'react';
import { View } from 'react-native';

import { COLOUR_OFF_WHITE, COLOUR_WHITE, COLOUR_BLUE, COLOUR_GREY } from '../../../constants/styles';
import ClickableListItem from '../../../components/clickable-list-item';
import Text from '../../../components/text';
import { Icon } from 'react-native-elements';


export default class ApplicationStrip extends React.Component {

  renderSkeleton() {
    return (
      <View
        style={{
          alignItems: 'center',
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: 'row',
          height: 90,
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10
        }}
      >
        <View 
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_OFF_WHITE,
            borderRadius: 17,
            height: 35,
            justifyContent: 'center',
            width: 35
          }}
        />
      
        <View style={{
          flex: .8,
          height: '100%',
          justifyContent: 'space-evenly',
          marginVertical: 20,
          marginLeft: 20,
        }}>
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
        </View>

      </View>
    );
  }

  render () {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderSkeleton()
    }

    return <ClickableListItem
      onPressOut={this.props.onPressOut}
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        borderBottomColor: COLOUR_OFF_WHITE,
        borderBottomWidth: 5,
        flex: 1,
        flexDirection: 'row',
        height: 90,
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10
      }}
    >
      <View 
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_BLUE,
          borderRadius: 17,
          height: 35,
          justifyContent: 'center',
          width: 35
        }}
      >
        <Text white>{this.props.firstName[0]}{this.props.lastName[0]}</Text>
      </View>
      
      <View style={{
        flex: .5,
        height: '100%',
        justifyContent: 'space-evenly',
        marginVertical: 20,
      }}>
        <Text bold>{this.props.firstName} {this.props.lastName}</Text>
        <Text bold small>Application ID: {this.props.id}</Text>
        <Text 
          isPendingStatus={this.props.isAwaitingValidation || this.props.isAwaitingApproval}
          isStatus
        >
          {this.props.application.cleanApprovalStatus || this.props.application.cleanApplicationType}
        </Text>
      </View>

      <View style={{
        alignItems: 'flex-end',
        flex: .4,
      }}>
        <Icon 
          color={COLOUR_GREY}
          name="chevron-right"
          size={32} />
      </View>
    </ClickableListItem>
  }
}
