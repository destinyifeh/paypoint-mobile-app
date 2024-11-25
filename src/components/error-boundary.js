import React from 'react';

import { View } from 'react-native';

import { COLOUR_BLUE } from '../constants/styles';
import ContactUsOptionsMenu from '../fragments/contact-us-options-menu';
import NavigationService from '../utils/navigation-service';
import Button from './button';
import Text from './text';


export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.reportErrorsAsExceptions = false;
    //log to firebase
  }

  render() {
    if (this.state.hasError) {
      return <View
        style={{
          alignItems: 'center',
          backgroundColor: `${COLOUR_BLUE}CC`,
          flex: 1,
          height: '100%',
          justifyContent: 'center',
          padding: 20,
          position: 'absolute',
          width: '100%',
          zIndex: 1,
        }}
      >
        <ContactUsOptionsMenu 
          ref_={component => this.contactUsOptionsMenu = component}
          requestClose={() => this.contactUsOptionsMenu.close()}
        />

        <Text bold center white>Oops!</Text>
        <Text bigger bold center white>
          An error occured.
        </Text>

        <Button
          containerStyle={{
            alignSelf: 'center',
            backgroundColor: 'white',
            marginTop: 30,
            width: '80%'
          }}
          title="Go Home"
          titleStyle={{
            color: COLOUR_BLUE
          }}
          onPress={() => {
            NavigationService.navigate('CrashRescue');
            this.setState({hasError: false});
          }} 
        />
        <Button
          containerStyle={{
            alignSelf: 'center',
            backgroundColor: 'white',
            // marginTop: 30,
            width: '80%'
          }}
          title="Contact Support"
          transparent
          onPressOut={() => this.contactUsOptionsMenu.open()} 
        />

        <View
          style={{
            bottom: 15,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            position: 'absolute',
            width: '100%'
          }}
        >
          <Button 
            onPress={() => {
              NavigationService.replace('Logout');
            }}
            title="Logout"
            transparent
          />
        </View>
      </View>;
    }

    return this.props.children; 
  }
}
