import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Icon, Button as RneButton} from 'react-native-elements';
import Button from '../../../../../components/button';
import Header from '../../../../../components/header';
import Text from '../../../../../components/text';
import {SHOW_AGGREGATOR_COMMISSION} from '../../../../../constants/api-resources';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../constants/styles';

const borderLine = () => (
  <View
    style={{
      borderBottomWidth: 1,
      marginTop: 10,
      marginBottom: 20,
      borderColor: '#DDDDDD',
    }}
  />
);

export default function AgentUpgrade({navigation, route, ...props}) {
  const windowHeight = Dimensions.get('window').height;

  const {agentDetails = {}} = route.params || {};

  const words = agentDetails.businessName.split(' ');
  let result = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    if (i === 0 || word !== 'and') {
      result += word[0].toUpperCase();
    }
  }

  return (
    <View style={{marginBottom: 80}}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        goBack={() => navigation.goBack()}
        withNavigateBackIcon
        title="Upgrade Agent"
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
        <View style={styles.section}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#EBF8FE',
                borderRadius: 17,
                height: 35,
                justifyContent: 'center',
                width: 35,
              }}>
              <Text style={{color: '#18425D'}}>{result}</Text>
            </View>
            <Text style={styles.header}>
              {agentDetails.businessName}{' '}
              <Text style={{fontSize: 12, color: '#0275D8'}}>
                ({agentDetails.agentClass})
              </Text>
            </Text>
          </View>
          {borderLine()}

          <Text
            style={{
              fontSize: 14,
              color: 'black',
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            Select Upgrade Type
          </Text>
          <Text style={{fontSize: 14}}>
            You'll be required to provide us with some information depending on
            your selection. Kindly choose your preferred option below
          </Text>
        </View>
        <View style={styles.sectionClass}>
          <Text style={{fontWeight: 'bold', color: '#111827'}}>Base</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Passport Photograph`}</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Government Issued ID`}</Text>
          {borderLine()}
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 30}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          {agentDetails.agentClass.toLowerCase() == 'BASIC' && (
            <RneButton
              containerStyle={{borderWidth: 1, borderColor: '#dddddd'}}
              titleStyle={{color: '#555555'}}
              buttonStyle={{backgroundColor: 'transparent'}}
              title="You are on Base"
            />
          )}
        </View>
        <View style={styles.sectionClass}>
          <Text style={{fontWeight: 'bold', color: '#111827'}}>Standard</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Utility Bill`}</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Character Form`}</Text>
          {borderLine()}
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 30}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          {agentDetails.agentClass.toLowerCase() == 'basic' && (
            <Button
              loading={false}
              onPress={() => {
                navigation.navigate('AgentUpgradeLanding', {
                  agentDetails: agentDetails,
                  newClass: 'Standard',
                  newClassId: 2,
                });
              }}
              title="Upgrade to Standard"
              buttonStyle={{backgroundColor: '#00425F'}}
            />
          )}
        </View>
        <View style={styles.sectionClass}>
          <Text style={{fontWeight: 'bold', color: '#111827'}}>Prestige</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Utility Bill`}</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Character Form`}</Text>
          <Text
            style={{
              paddingLeft: 10,
              paddingTop: 10,
            }}>{`\u2022 Address Verification Form`}</Text>
          {borderLine()}
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 10}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingBottom: 30}}>
            <Icon
              color={COLOUR_BLUE}
              name="check-square"
              size={18}
              type="feather"
            />
            <Text style={{paddingLeft: 10}}>
              Daily transaction limit > 1,000,000
            </Text>
          </View>
          {agentDetails.agentClass != 'PRESTIGE' && (
            <Button
              loading={false}
              isDisabled={!SHOW_AGGREGATOR_COMMISSION}
              onPress={() =>
                navigation.navigate('AgentUpgradeLanding', {
                  agentDetails: agentDetails,
                  newClass: 'Prestige',
                  newClassId: 3,
                })
              }
              title="Upgrade to Prestige"
              buttonStyle={{backgroundColor: '#00425F'}}
            />
          )}
        </View>
      </ScrollView>
      <View style={{height: 10}} />
    </View>
  );
}

const styles = StyleSheet.create({
  but: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'black',
    marginLeft: 15,
  },
  section: {
    padding: 20,
  },
  sectionClass: {
    margin: 20,
    padding: 20,
    backgroundColor: '#EBF8FE',
    borderRadius: 10,
    color: '#111827',
  },
  sectionColor: {
    color: '#111827',
  },
});
