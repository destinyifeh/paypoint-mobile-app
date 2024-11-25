import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import H1 from '../../../../../../components/h1';
import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';

const PosReportView = props => {
  const [data, setData] = useState();
  const [agent, setAgent] = useState();
  const [nextAgent, setNextAgent] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const platform = new Platform();

  retrieveAgentData = async agentData => {
    const {code, response} = await platform.getAggregatorAgentsByPhone(
      agentData,
    );

    if (code == '404' || code != '200') {
      setAgent({count: 0});
      nextAgent.count && setIsLoading(false);
      return;
    }
    nextAgent.count && setIsLoading(false);
    setAgent(response.content[0]);
  };
  retrieveNewAgentData = async agentData => {
    const {code, response} = await platform.getAggregatorAgentsByPhone(
      agentData,
    );

    if (code == '404' || code != '200') {
      setNextAgent({count: 0});
      nextAgent.count && setIsLoading(false);
    }
    nextAgent.count && setIsLoading(false);
    setNextAgent(response.content[0]);
  };

  const formatPhoneNo = phone => '2340' + phone.slice(-10);

  useEffect(() => {
    setData(props.navigation.state.params.data);
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#F3F3F4',
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
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => props.navigation.replace('PosReport')}
          />
        }
        hideNavigationMenu={props.hideNavigator}
        showNavigationMenu={props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="POS Report View"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
      />

      {isLoading ? <ActivityIndicator /> : <ReportContent data={data} />}
    </View>
  );
};

const ReportContent = ({data}) => {
  const agent = null;
  const nextAgent = null;
  if (!data) return <View />;
  return (
    <View
      style={{
        padding: 30,
      }}>
      <ScrollView>
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Request ID:
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {`${data.requestId}`}
          </Text>
        </View>
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Request Status:
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {`${data.requestStatus}`}
          </Text>
        </View>
        {data.reasonForDecline && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Reasons For Decline:
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {`${data.reasonForDecline}`}
            </Text>
          </View>
        )}
        <DrawLine />
        <View>
          <H1 style={{fontSize: FONT_SIZE_BIG, marginVertical: 10}}>
            POS Previous Terminal ID
          </H1>
        </View>
        {agent && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Name of Agent
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {`${agent.contact.firstname} ${agent.contact.middlename} ${agent.contact.lastname}`}
            </Text>
          </View>
        )}
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Phone Number:
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {`${data.currentTerminalOwner}`}
          </Text>
        </View>
        {agent && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Email Address
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {agent.businessEmail}
            </Text>
          </View>
        )}
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Terminal Model
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {data.terminalModel}
          </Text>
        </View>
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Device Name
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {data.terminalName}
          </Text>
        </View>
        {agent && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Agent Address
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {agent.businessLocation.addressLine1}
            </Text>
          </View>
        )}

        <DrawLine />

        <View>
          <H1 style={{fontSize: FONT_SIZE_BIG, marginVertical: 10}}>
            Agent Mapped
          </H1>
        </View>
        {nextAgent && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Agent Name:
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {`${nextAgent.contact.firstname} ${nextAgent.contact.middlename} ${nextAgent.contact.lastname}`}
            </Text>
          </View>
        )}
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Phone Number:
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {`${data.nextTerminalOwner}`}
          </Text>
        </View>
        {nextAgent && (
          <View>
            <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
              Email Address
            </H1>
            <Text
              style={{
                fontSize: FONT_SIZE_TEXT_INPUT,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                marginBottom: 10,
              }}>
              {nextAgent.businessEmail}
            </Text>
          </View>
        )}
        <View>
          <H1 style={{fontSize: FONT_SIZE_MID, marginVertical: 10}}>
            Agent Address
          </H1>
          <Text
            style={{
              fontSize: FONT_SIZE_TEXT_INPUT,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              marginBottom: 10,
            }}>
            {data.nextOwnerBusinessAddress}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const DrawLine = () => (
  <View
    style={{
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
    }}
  />
);

export default PosReportView;
