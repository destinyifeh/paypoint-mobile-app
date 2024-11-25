import React, { Fragment } from 'react';
import { Linking, ScrollView } from 'react-native';
import Text from '../components/text';
import H1 from '../components/h1';
import ClickableListItem from '../components/clickable-list-item';
import { COLOUR_RED } from '../constants/styles';

export default () => {
  return <Fragment>
    <ScrollView contentContainerStyle={{padding: 20}}>
      <H1>Terms and Conditions</H1>
      <Text style={{marginTop: 5, textAlign: "left"}}>
        {'\n'}
        Creation of an account on this application will require you to provide personal data to your account as part of the registration process. You are also required to give us more "User Personal Information" as is required to complete your registration.
        {'\n\n'}
        "User Personal Information" is any information about one of our users which could, alone or together with other information, personally identify him or her. Information such as a username and password, an email address, a real name, and a photograph are examples of "User Personal Information".
        {'\n\n'}
        User Personal Information does not include aggregated, non-personally identifying information. However, we may use aggregated, non-personally identifying information to operate, improve, and optimize our solution and service.
        {'\n\n'}
        By clicking the checkbox, I agree to share my personal information with this application and to take full responsibility of the safety of my personal details outside of this application. I also agree and understand that you shall accept no responsibility or liability whatsoever with regards to my personal information outside this application.
      </Text>
      <ClickableListItem
          onPress={() => {
            Linking.openURL(`https://mufasa.interswitchng.com/p/quickteller-paypoint/IFIS_AGENT_SERVICE_LEVEL_AGREEMENT.pdf`)
          }}
          style={{
            padding: 20
          }}
        >

          
        <Text style={{color: COLOUR_RED, textAlign:"center"}}>CLICK TO DOWNLOAD THE DETAILED TERMS AND CONDITIONS DOCUMENTS HERE</Text>
      </ClickableListItem>
    </ScrollView>
  </Fragment>
};
