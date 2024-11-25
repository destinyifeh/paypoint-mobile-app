import React, {Fragment} from 'react';
import {ScrollView, View} from 'react-native';

import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';

function DetailRow({title, value, ...props}) {
  if (typeof value !== 'string') {
    return <Fragment />;
  }
  return (
    <View style={{padding: 12}}>
      <Text bold title>
        {title}
      </Text>
      <Text mid>{value}</Text>
    </View>
  );
}

export default function ViewAgentDetails(props) {
  const {agentDetails = {}} = props.route.params || {};

  return (
    <View>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        goBack={() => props.navigation.goBack()}
        withNavigateBackIcon
        title={agentDetails.businessName}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />
      <ScrollView>
        {Object.keys(agentDetails).map((value, index) => (
          <DetailRow key={index} title={value} value={agentDetails[value]} />
        ))}
      </ScrollView>
    </View>
  );
}
