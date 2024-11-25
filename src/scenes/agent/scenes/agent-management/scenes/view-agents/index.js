import { default as React, useEffect, useRef, useState } from "react";
import { Animated, FlatList, View } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";

import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Text from '../../../../../../components/text';
import { ERROR_STATUS } from '../../../../../../constants/api';
import { COLOUR_BLUE, COLOUR_GREY, COLOUR_OFF_WHITE, COLOUR_WHITE, CONTENT_LIGHT } from '../../../../../../constants/styles';
import AgentOptionsMenu from '../../../../../../fragments/agent-options-menu';
import { hideNavigator, showNavigator } from '../../../../../../services/redux/actions/navigation';
import { platformService } from '../../../../../../setup/api';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';

import { TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  COLOUR_RED,
  FONT_SIZE_MID
} from "../../../../../../constants/styles";
import { formatNumber } from "../../../../../../utils/formatters";

export class AgentRow extends React.Component {
  renderSkeleton() {
    return (
      <View
        style={{
          alignItems: "center",
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: "row",
          height: 90,
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: COLOUR_OFF_WHITE,
            borderRadius: 17,
            height: 35,
            justifyContent: "center",
            width: 35
          }}
        />

        <View
          style={{
            flex: 0.8,
            height: "100%",
            justifyContent: "space-evenly",
            marginVertical: 20,
            marginLeft: 20
          }}
        >
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: "100%"
            }}
          />
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: "100%"
            }}
          />
          <View
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: "100%"
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    const { isLoading } = this.props;

    const words = this.props.businessName.split(" ");
    let result = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (i === 0 || word !== "and") {
        result += word[0]?.toUpperCase();
      }
    }

    if (isLoading) {
      return this.renderSkeleton();
    }

    return (
      <ClickableListItem
        onPressOut={this.props.onPressOut}
        style={{
          alignItems: "center",
          backgroundColor: COLOUR_WHITE,
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: "row",
          height: 80,
          justifyContent: "space-between",
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: "#EBF8FE",
            borderRadius: 17,
            height: 35,
            justifyContent: "center",
            width: 35
          }}
        >
          <Text style={{ color: "#18425D" }}>{result}</Text>
        </View>

        <View
          style={{
            flex: 0.75,
            height: "100%",
            justifyContent: "space-evenly",
            marginVertical: 20
          }}
        >
          <Text semiBold title>
            {this.props.businessName}
          </Text>
          <Text mid semiBold>
            Phone No.: <Text mid>{this.props.businessPhoneNo}</Text>
          </Text>
          <Text isSuccessStatus={this.props.status === "Active"} isStatus>
            {this.props.status}
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            flex: 0.15
          }}
        >
          <Icon color={COLOUR_GREY} name="chevron-right" size={32} />
        </View>
      </ClickableListItem>
    );
  }
}
class StatusCard extends React.Component {
  // TODO work on Awaiting Validation, Awaiting Approval, Setup in Progress
  constructor() {
    super();
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const { title, agentNumber } = this.props;

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          borderRadius: 12,
          elevation: 6,
          minHeight: 100,
          margin: 20,
          // marginTop: 40,
          padding: 20
        }}
      >
        <Text
          center
          red
          small
          style={{
            // marginBottom: 15,
            paddingTop: 5,
            fontSize: 20
          }}
        >
          {`${title}`}
        </Text>

        <Text biggest blue bold center style={{ fontSize: 40 }}>
          {agentNumber}
        </Text>
      </View>
    );
  }
}

function ViewAgentsScene({
  navigation,
  hideNavigator,
  showNavigator,
  ...props
}) {
  const agentOptionsMenuComponent = useRef();
  const [agents, setAgents] = useState([]);
  const [filteredData, setFilteredData] = useState(agents);
  const [currentAgentDetails, setCurrentAgentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = new Animated.Value(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const newData =
      Array.isArray(agents) &&
      agents?.filter(data =>
        data?.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    setFilteredData(newData);
  }, [searchQuery]);

  const loadAgents = async () => {
    setIsLoading(true);
    const {
      response,
      status
    } = await platformService.getAgentsUnderAggregator();
    console.log({ response, status });
    setIsLoading(false);

    if (status === ERROR_STATUS) {
      setErrorMessage(await handleErrorResponse(response));
      return
    }

    setAgents(response.content);
    setFilteredData(response.content);
  };

  useEffect(() => {
    loadAgents();
  }, [navigation]);

  return (
    <View
      style={{
        // backgroundColor: "#F3F3F4",
        flex: 1
      }}
      // onTouchEnd={() =>
      //   props.isNavigatorVisible ? props.hideNavigator() : null
      // }
    >
      <AgentOptionsMenu
        agentDetails={currentAgentDetails}
        navigation={navigation}
        ref_={agentOptionsMenuComponent}
        requestClose={() => agentOptionsMenuComponent.current.close()}
      />

      <View
        nativeID=""
        style={{
          backgroundColor: COLOUR_BLUE,
          flex: 1,
          height: "100%",
          position: "absolute",
          width: "100%"
        }}
      >
        <Svg height="800" width="400" style={{ top: 0 }}>
          <Path
            d="M0 0H165C165 0 70.8098 30.7186 62.7442 95.4958C54.6785 160.273 150 257 150 257H0V0Z"
            fill={COLOUR_RED}
          />
        </Svg>

        <Svg
          fill="none"
          height="110"
          width="130"
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <Path
            opacity="0.063399"
            d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
            stroke="white"
            strokeWidth="65"
          />
        </Svg>

        <Svg
          fill="none"
          height="105"
          width="60"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Path
            clipRule="evenodd"
            d="M-10.5 90C20.1518 90 45 65.1518 45 34.5C45 3.8482 20.1518 -21 -10.5 -21C-41.1518 -21 -66 3.8482 -66 34.5C-66 65.1518 -41.1518 90 -10.5 90Z"
            fillRule="evenodd"
            stroke="#D81E1E"
            strokeWidth="30"
          />
        </Svg>

        <Svg
          width="48"
          height="59"
          style={{ position: "absolute", top: 190, left: 0 }}
          fill="none"
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
            stroke="#D81E1E"
            strokeWidth="22"
          />
        </Svg>
      </View>

      <Header
        navigationIconColor={COLOUR_WHITE}
        // containerStyle={{
        //   backgroundColor: COLOUR_BLUE
        // }}
        hideNavigationMenu={hideNavigator}
        showNavigationMenu={showNavigator}
        statusBarProps={{
          backgroundColor: "transparent",
          barStyle: CONTENT_LIGHT
        }}
        title="Agent Management"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: "bold"
        }}
        withNavigator
      />

      {/* {isLoading && <ActivityIndicator />} */}

      <Animated.ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } }
            }
          ],
          {
            useNativeDriver: true
          }
        )}
        scrollEventThrottle={16}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
            marginLeft: 20,
            marginRight: 20
            // marginBottom: 100
          }}
        >
          <Text
            bold
            style={{
              borderLeftWidth: 5,
              borderColor: "white",
              color: COLOUR_WHITE,
              fontSize: FONT_SIZE_MID,
              paddingLeft: 15
            }}
          >
            Prospective Agents
          </Text>
        </View>
        {/* Top Section */}
          <StatusCard
            title={"Total Number of Agents"}
            agentNumber={formatNumber(agents?.length)}
          />
        
        <View
          style={{
            borderRadius: 10,
            backgroundColor: "white",
            marginHorizontal: 20,
            marginBottom: 10
          }}
        >
          <TextInput
            // ref={textInputRef}
            placeholder="Search "
            placeholderTextColor={"grey"}
            style={[
              {
                flex: 1,
                fontSize: 16,
                textAlign: "left",
                marginHorizontal: 20,
                borderRadius: 10,
                paddingHorizontal: 4,
                backgroundColor: "transparent"
              }
            ]}
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            // data={agents}
            data={filteredData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) => (
              <AgentRow
                {...item}
                key={index}
                onPressOut={() => {
                  setCurrentAgentDetails(item);
                  agentOptionsMenuComponent.current.open();
                }}
              />
            )}
          />
        )}
      </Animated.ScrollView>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewAgentsScene);
