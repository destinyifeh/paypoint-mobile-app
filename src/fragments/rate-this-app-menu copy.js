import React, { useState } from 'react';

import { View, Linking } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { HAS_USER_RATED_APP_ON_THE_STORE } from '../constants';
import { COLOUR_GREY, COLOUR_GREEN, COLOUR_YELLOW, COLOUR_RED, COLOUR_PRIMARY, COLOUR_BLUE } from '../constants/styles';
import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';
import Button from '../components/button';
import { connect } from 'react-redux';
import { logEvent } from '../core/logger';
import { RATING_CLICK } from '../constants/analytics';
import { saveData } from '../utils/storage';


const badIcon = ({color}) => (
  <Icon 
    color={color}
    name="frown"
    size={52}
    type="feather"
  />
);
const okayIcon = ({color}) => (
  <Icon 
    color={color}
    name="meh"
    size={52}
    type="feather"
  />
);
const goodIcon = ({color}) => (
  <Icon 
    color={color}
    name="smile"
    size={52}
    type="feather"
  />
);


function Rating({defaultColor=COLOUR_GREY, icon, message, onRate, title, tintColor, value}) {
  const [ isActive, setIsActive ] = useState(false);

  return (
    <ClickableListItem 
      onPress={() => {
        onRate(message, value);
        setIsActive(true);
        logEvent(RATING_CLICK, {
          title
        })
      }}
      style={{flexDirection: 'column'}}
    >
      {icon({color: isActive ? tintColor : defaultColor})}
      <Text 
        bold 
        center 
        style={{
          color: isActive ? tintColor : defaultColor, 
          marginTop: 4
        }}
      >
        {title}
      </Text>
    </ClickableListItem>
  );
}


class RateThisAppMenu1 extends React.Component {
  state = {
    showOnlyMessage: false,
    showTakeToStore: false,
  };

  render() {
    const defaultMessage = 'Thank you!\nPlease, leave us a feedback.'
    const { navigation, ref_, remoteConfig, requestClose } = this.props;
    const { message, showOnlyMessage, showTakeToStore } = this.state;

    const onGiveFeedbackButtonPress = () => {
      saveData(HAS_USER_RATED_APP_ON_THE_STORE, true);
      Linking.openURL(remoteConfig.latest_app_url);
    };

    const onNoFeedbackButtonPress = () => {
      saveData(HAS_USER_RATED_APP_ON_THE_STORE, true);
      requestClose();
    };

    const onRate = (message, value) => {
      setTimeout(() => {
        const showTakeToStore = value >= 3;
        const showOnlyMessage = !showTakeToStore;

        this.setState({
          message,
          showOnlyMessage,
          showTakeToStore
        });

        if (showOnlyMessage) {
          setTimeout(requestClose, 1400);
        }
      }, 500);
    }

    let ratingSelect = () => (
      <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 32}}>
        <Rating
          icon={(params) => badIcon(params)}
          message="We appreciate your feedback!"
          onRate={onRate}
          tintColor={COLOUR_RED}
          title="Bad"
          value={1}
        />
        <Rating
          icon={(params) => okayIcon(params)}
          message="We appreciate your feedback!"
          onRate={onRate}
          tintColor={COLOUR_YELLOW}
          title="Okay"
          value={2}
        />
        <Rating
          icon={(params) => goodIcon(params)}
          message="Thank you!"
          onRate={onRate}
          tintColor={COLOUR_GREEN}
          title="Good"
          value={3}
        />
      </View>
    );

    let messageView = () => (
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 32}}>
        <Text bigger center>{message}</Text>
      </View>
    );

    let takeToStoreView = () => (
      <View style={{alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 8}}>
        <Text semiBold style={{fontSize: 24, lineHeight: 28}} center>{defaultMessage}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, }}>
          
          <Button
            containerStyle={{
              marginBottom: 20,
              marginTop: 20,
              maxWidth: '30%',
              width: 150,
            }}
            onPress={onNoFeedbackButtonPress}
            title={"NEVER"}
            titleStyle={{
              color: COLOUR_PRIMARY
            }}
            transparent
          />

          <Button
            containerStyle={{
              marginBottom: 20,
              marginRight: 12,
              marginTop: 20,
              maxWidth: '30%',
              width: 150,
              backgroundColor: COLOUR_BLUE,
            }}
            onPress={requestClose}
            title="LATER"
          />

          <Button
            containerStyle={{
              marginBottom: 20,
              marginTop: 20,
              maxWidth: '38%',
              width: 150,
              backgroundColor: COLOUR_GREEN,
            }}
            onPress={onGiveFeedbackButtonPress}
            title={"CONTINUE"}
          />
        </View>
      </View>
    );

    let content = showTakeToStore ? takeToStoreView : ratingSelect;
    if (showOnlyMessage) {
      content = messageView;
    }

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
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
          <Text
            bold
          >
            Rate this app
          </Text>
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

export default connect(mapStateToProps, null)(RateThisAppMenu1);
