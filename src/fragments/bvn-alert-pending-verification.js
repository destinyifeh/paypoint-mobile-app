import React from 'react';

import { View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { COLOUR_GREY, COLOUR_RED } from '../constants/styles';
import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';
import { connect } from 'react-redux';
import NavigationService from '../utils/navigation-service';
import Button from '../components/button';


const badIcon = ({color}) => (
  <Icon 
    color={color}
    name="meh"
    size={52}
    type="feather"
  />
);

class BVNAlertPendingVerificationMenu extends React.Component {
  state = {
    showOnlyMessage: false
  };

  render() {
    const { navigation, ref_, requestClose } = this.props;
    const { message, showOnlyMessage } = this.state;

    const Rating = ({defaultColor=COLOUR_GREY, icon}) => {
      
      return (
        <ClickableListItem 
          style={{flexDirection: 'column', 
          alignItems: 'center'}}
          onPress={() => {
            NavigationService.replace('Logout');
            requestClose()
          }}
        >
          {icon({color: defaultColor})}
          <Text 
            bold 
            center 
            style={{
              color: defaultColor, 
              marginTop: 4,
              padding:10
            }}
          >
            Your BVN information is under review.{"\n"}
            You will be notified via email when there is an update on your account
          </Text>
          <Button
          containerStyle={{
            width: 150,
          }}
          center
          title="LOGOUT"
          onPress={() => {
            NavigationService.replace('Logout');
            requestClose()
          }}
        />
        </ClickableListItem>
      );
    }
    
    
    let ratingSelect = () => (
      <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 32}}>
        <Rating
          icon={(params) => badIcon(params)}
          message=""
          tintColor={COLOUR_RED}
          title="Bad"
          value={1}
        />
      </View>
    );

    let messageView = () => (
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 32}}>
        <Text bigger center>{message}</Text>
      </View>
    );

    let content = ratingSelect;
    if (showOnlyMessage) {
      content = messageView;
    }

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={false}
        closeOnPressMask={false}
        closeOnPressBack={false}
        duration={250}
        height={290}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >

        <View
          style={{
            padding: 20
          }}
        >
        </View>
        
        {content()}
      </RBSheet>
    );
  }
}

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig
  }
}

export default connect(mapStateToProps, null)(BVNAlertPendingVerificationMenu);
