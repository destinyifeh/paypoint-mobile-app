import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import ActivityIndicator from "../../../../../../components/activity-indicator";
import Header from "../../../../../../components/header";
import Modal from "../../../../../../components/modal";
import { AGENT } from "../../../../../../constants";
import { SUCCESSFUL_STATUS } from "../../../../../../constants/api";
import { BLOCKER } from "../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_BIG,
  FONT_SIZE_MID,
} from "../../../../../../constants/styles";
import AgentSerializer from "../../../../../../serializers/resources/agent";
import { platformService } from "../../../../../../setup/api";
import { flashMessage } from "../../../../../../utils/dialog";
import { loadData } from "../../../../../../utils/storage";
export default function NINAccountDowngrade(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [agentInfo, setAgentInfo] = React.useState({
    agentCode: "",
    agentClass: "",
  });

  React.useEffect(() => {
    getCurrentAgentData();
  }, []);

  const getCurrentAgentData = async () => {
    const savedAgentData = JSON.parse(await loadData(AGENT));
    const currentAgent = new AgentSerializer(savedAgentData);

    const { agentCode, agentClass } = savedAgentData;
    setAgentInfo({ agentCode: agentCode, agentClass: agentClass });
  };

  const acceptDowngrade = async () => {
    setIsLoading(true);
    const payload = {
      agentCode: agentInfo.agentCode,
    };
    try {
      const res = await platformService.agentAccountDowngrade(payload);
      console.log(res, "downgrade agent res");
      const { responseMessage } = res.response;
      if (responseMessage && responseMessage === SUCCESSFUL_STATUS) {
        setShowSuccessModal(true);
        setIsLoading(false);
      } else {
        flashMessage(
          null,
          "Oops! Something went wrong. Please try again later.",
          BLOCKER
        );

        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      flashMessage(
        null,
        "Oops! Something went wrong. Please try again later.",
        BLOCKER
      );
      setIsLoading(false);
    }
  };

  const successModal = () => {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              setShowSuccessModal(false);
              props.navigation.replace("Agent");
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "100%",
            },
            title: "OKAY",
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: FONT_FAMILY_BODY,
                fontSize: FONT_SIZE_BIG,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              Account Downgraded
            </Text>
            <Text style={{ textAlign: "center", fontFamily: FONT_FAMILY_BODY }}>
              Your account has been successfully downgraded
            </Text>
          </View>
        }
        image={require("../../../../../../assets/media/images/clap.png")}
        isModalVisible={true}
        size="md"
        title="Success"
        withButtons
        hideCloseButton
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        leftComponent={
          <Icon
            underlayColor="transparent"
            color={COLOUR_WHITE}
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => props.navigation.replace("Agent")}
          />
        }
        statusBarProps={{
          backgroundColor: "transparent",
          barStyle: CONTENT_LIGHT,
        }}
        title="Downgrade Account"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: "bold",
        }}
      />
      <View style={styles.contentContainer}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ marginVertical: 8 }}>
            <Text style={styles.text}>
              Are you sure you want to accept an Account downgrade to Basic?
              Your transaction limits will be reduced as outlined below
            </Text>
          </View>

          <View
            style={[
              styles.acountTypeHeaderView,
              { width: "100%", marginBottom: 5 },
            ]}
          >
            <View style={{ width: "50%" }}>
              <Text style={styles.accountTypeHeaderText}>Limits</Text>
            </View>
            <View style={styles.packageView}>
              <Text style={styles.accountTypeHeaderText}>
                {agentInfo.agentClass}
              </Text>
              <Text style={styles.accountTypeHeaderText}>Basic</Text>
            </View>
          </View>

          <View
            style={[
              styles.acountTypeHeaderView,
              {
                borderColor: "#E1E6ED",
                backgroundColor: "white",
                borderWidth: 1,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: "50%" }}>
              <Text style={[styles.accountTypeHeaderText, { maxWidth: 150 }]}>
                Cumulative Balance
              </Text>
            </View>
            <View style={styles.amountFromView}>
              <Text
                style={[
                  styles.accountTypeHeaderText,
                  { color: "#519E47", maxWidth: 90 },
                ]}
              >
                {agentInfo.agentClass === "STANDARD"
                  ? "₦5,000,000"
                  : "₦10,000,000"}
              </Text>
              <Icon
                type="feather"
                name="arrow-right"
                color="#353F50"
                size={16}
              />
              <Text
                style={[styles.accountTypeHeaderText, { color: "#353F50" }]}
              >
                ₦300,000
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.acountTypeHeaderView,
              {
                borderColor: "#E1E6ED",
                backgroundColor: "white",
                borderWidth: 1,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: "50%" }}>
              <Text style={[styles.accountTypeHeaderText, { maxWidth: 150 }]}>
                Daily Transaction Limit
              </Text>
            </View>
            <View style={styles.amountFromView}>
              <Text
                style={[
                  styles.accountTypeHeaderText,
                  { color: "#519E47", maxWidth: 90 },
                ]}
              >
                {agentInfo.agentClass === "STANDARD"
                  ? "₦500,000"
                  : "₦1,000,000"}
              </Text>
              <Icon
                type="feather"
                name="arrow-right"
                color="#353F50"
                size={16}
              />
              <Text
                style={[styles.accountTypeHeaderText, { color: "#353F50" }]}
              >
                ₦50,000
              </Text>
            </View>
          </View>
          {/* <View
            style={[
              styles.acountTypeHeaderView,
              {
                borderColor: "#E1E6ED",
                backgroundColor: "white",
                borderWidth: 1,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: "50%" }}>
              <Text style={[styles.accountTypeHeaderText, { maxWidth: 150 }]}>
                Minimum Account Balance
              </Text>
            </View>
            <View style={styles.amountFromView}>
              <Text
                style={[styles.accountTypeHeaderText, { color: "#519E47" }]}
              >
                ₦180,000
              </Text>
              <Icon
                type="feather"
                name="arrow-right"
                color="#353F50"
                size={16}
              />
              <Text
                style={[styles.accountTypeHeaderText, { color: "#353F50" }]}
              >
                ₦32,000
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.acountTypeHeaderView,
              {
                borderColor: "#E1E6ED",
                backgroundColor: "white",
                borderWidth: 1,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: "50%" }}>
              <Text style={[styles.accountTypeHeaderText, { maxWidth: 150 }]}>
                Maximum Account Balance
              </Text>
            </View>
            <View style={styles.amountFromView}>
              <Text
                style={[styles.accountTypeHeaderText, { color: "#519E47" }]}
              >
                ₦890,000
              </Text>
              <Icon
                type="feather"
                name="arrow-right"
                color="#353F50"
                size={16}
              />
              <Text
                style={[styles.accountTypeHeaderText, { color: "#353F50" }]}
              >
                ₦90,000
              </Text>
            </View>
          </View> */}
        </ScrollView>
        {showSuccessModal && successModal()}

        <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
          <TouchableOpacity
            style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]}
            onPress={() => acceptDowngrade()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Accept Downgrade</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button2]}
            onPress={() => {
              props.navigation.navigate("Agent");
            }}
          >
            <Text style={[styles.buttonText, { color: "#353F50" }]}>
              Maintain my current tier
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
  formInputInnerContainerStyle: {
    marginTop: 0,
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 10,
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
    // backgroundColor: "#FFFFFF",
    backgroundColor: "#F3F3F4",
  },
  button: {
    height: 56,
    backgroundColor: "#00425F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  acountTypeHeaderView: {
    height: 52,
    backgroundColor: "#EBF8FE",
    borderWidth: 1,
    borderColor: "#A8D6EF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    padding: 10,
  },
  accountTypeHeaderText: {
    color: "#353F50",
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    lineHeight: 20,
    fontSize: 14,
    textTransform: "capitalize",
  },
  text: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
  },
  itemContainer: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E6ED",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLimitText: {
    color: "#353F50",
    fontSize: 14,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    lineHeight: 20,
    textAlign: "center",
  },
  itemTypeText: {
    color: "#519E47",
    fontSize: 14,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    lineHeight: 20,
    textAlign: "center",
  },

  itemBasicText: {
    color: "#353F50",
    fontSize: 14,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    lineHeight: 20,
    textAlign: "center",
  },
  button2: {
    height: 56,
    // backgroundColor: "#E1E6ED",
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E1E6ED",
    width: "100%",
  },
  buttonText: {
    color: "white",
    lineHeight: 24,
    fontSize: 16,
  },
  amountFromView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
  },
  packageView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
  },
});
