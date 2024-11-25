import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import ActivityIndicator from "../../../../../../../components/activity-indicator";
import Header from "../../../../../../../components/header";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_FORM_CONTROL_BACKGROUND,
  COLOUR_GREEN,
  COLOUR_LINK_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_SIZE_MID,
  FONT_SIZE_TEXT_INPUT,
  FONT_SIZE_TITLE,
} from "../../../../../../../constants/styles";

import {
  BackHandler,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { onboardingService } from "../../../../../../../setup/api";
import { saveData } from "../../../../../../../utils/storage";
import FipProgressBar from "../../components/fip-progress-bar";

function FipAgentTinAndCacVerification(props) {
  const [form, setForm] = React.useState({
    tinNumber: null,
    cacNumber: null,
    kycId: null,
  });
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showTinSuccessIcon, setShowTinSuccessIcon] = React.useState(false);
  const [showCacSuccessIcon, setShowCacSuccessIcon] = React.useState(false);
  const [tinValidationStatus, setTinValidationStatus] = React.useState(null);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [cacType, setCacType] = React.useState("BN");
  const [showCacField, setShowCacField] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState({
    tin: null,
    cac: null,
  });

  const tinRef = useRef();
  const handleBackButtonPress = () => {
    props.navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    tinRef.current?.focus();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress
    );
    return () => backHandler.remove();
  }, []);

  const updateFormField = (params) => {
    setIsError(false);
    setErrorMessage((prev) => ({
      ...prev,
      cac: null,
      tin: null,
    }));

    const newForm = {
      ...form,
      ...params,
    };

    setForm((prev) => ({
      ...prev,
      ...params,
    }));
  };

  const onSubmit = async () => {
    if (tinValidationStatus === "VERIFIED") {
      await handleCacValidation();
    } else {
      await onValidateTin();
    }
  };

  const onValidateTin = async () => {
    setIsLoading(true);
    setErrorMessage((prev) => ({
      ...prev,
      cac: null,
      tin: null,
    }));

    let res;
    try {
      const payload = {
        identificationNumber: form.tinNumber,
      };
      if (!form.tinNumber) {
        setIsError(true);

        setErrorMessage((prev) => ({
          ...prev,
          tin: "Please enter your TIN",
          cac: null,
        }));

        setIsLoading(false);
      } else if (form?.tinNumber.length < 9) {
        setIsError(true);
        setErrorMessage((prev) => ({
          ...prev,
          tin: "Field must be 9 or more characters.",
          cac: null,
        }));

        setIsLoading(false);
      } else {
        res = await onboardingService.fipKycValidation("TIN", payload);
        console.log(res, "resto");
        const { status, code, response } = res;
        const { description, kycData } = response || {};
        const {
          kycNextStage,
          kycId,
          tinVerificationResponse,
          cacVerificationResponse,
          bvnVerificationResponse,
          ninVerificationResponse,
        } = kycData || {};
        const { validationStatus, cacRegNo, message } =
          tinVerificationResponse || {};
        const theBvn = bvnVerificationResponse?.bvnData?.bvn;

        if (validationStatus === "NOT_VERIFIED") {
          setIsError(true);

          setErrorMessage((prev) => ({
            ...prev,
            tin: message,
            cac: null,
          }));
          setIsLoading(false);
          return;
        }

        setIsLoading(false);

        switch (kycNextStage) {
          case "CAC":
            setIsError(false);
            setShowTinSuccessIcon(true);
            setTinValidationStatus("VERIFIED");
            setShowCacField(true);
            setForm((prev) => ({
              ...prev,
              cacNumber: cacRegNo,
              kycId: kycId,
            }));
            break;

          case "BVN":
            props.navigation.replace("FipAgentBvnVerification", {
              kycId: kycId,
            });
            break;

          case "NIN":
            props.navigation.replace("FipAgentNinVerification", {
              kycId: kycId,
            });
            break;

          case "BVN_VERIFY_MOBILE":
            props.navigation.replace("FipAgentBvnVerification", {
              kycId: kycId,
            });
            break;

          case "LIVELINESS":
            props.navigation.replace("FipAgentFacialVerification", {
              data: {
                bvn: theBvn,
                kycId: kycId,
              },
            });
            break;

          case "WALLET_VERIFY_MOBILE":
            await saveData("fipAgentBvnData", ninVerificationResponse?.ninData);
            props.navigation.replace("FipAgentPersonalInformation", {
              kycId: kycId,
              bvnData: ninVerificationResponse?.ninData,
            });
            break;

          case "PERSONAL_DETAIL":
          case "PERSONAL_DETAILS":
            await saveData("fipAgentBvnData", ninVerificationResponse?.ninData);
            props.navigation.replace("FipAgentPersonalInformation", {
              kycId: kycId,
              bvnData: ninVerificationResponse?.ninData,
            });
            break;

          default:
            setIsError(true);
            setErrorMessage((prev) => ({
              ...prev,
              tin:
                response?.description ||
                "Oops! Something went wrong. Please try again later.",
              cac: null,
            }));
            break;
        }
      }
    } catch (err) {
      console.log(err, "Tin error");
      setIsLoading(false);
      setIsError(true);

      setErrorMessage((prev) => ({
        ...prev,
        tin: res?.response?.description
          ? res.response.description
          : "Oops! Something went wrong. Please try again later.",
        cac: null,
      }));
    }
  };

  const handleCacValidation = async () => {
    setIsLoading(true);
    setErrorMessage((prev) => ({
      ...prev,
      cac: null,
      tin: null,
    }));
    const payload = {
      identificationNumber: form.cacNumber,
      prefix: cacType,
      kycId: form.kycId,
    };
    console.log(payload, "cac payload");
    let res;

    try {
      res = await onboardingService.fipKycValidation("CAC", payload);
      console.log(res, "resto");
      const { code, response } = res;
      const { kycData, description } = response;
      const { cacVerificationResponse, kycId } = kycData;
      const { validationStatus, cacData, message } = cacVerificationResponse;

      if (validationStatus === "NOT_VERIFIED") {
        setIsError(true);

        setErrorMessage((prev) => ({
          ...prev,
          cac: message
            ? message
            : "Oops! Something went wrong. Please try again later.",
          tin: null,
        }));
        setIsLoading(false);
      } else if (validationStatus === "VERIFIED") {
        setIsLoading(false);
        setIsError(false);
        setShowCacSuccessIcon(true);
        props.navigation.replace("FipAgentBvnVerification", { kycId: kycId });
      } else {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage((prev) => ({
          ...prev,
          cac: description
            ? description
            : "Oops! Something went wrong. Please try again later.",
          tin: null,
        }));
      }
    } catch (err) {
      console.log(err, "cac Val error");
      setIsLoading(false);
      setIsError(true);
      setErrorMessage((prev) => ({
        ...prev,
        cac: res?.response?.description
          ? res.response.description
          : "Oops! Something went wrong. Please try again later.",
        tin: null,
      }));
    }
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  const onToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const onCloseDropdown = () => {
    setDropdownVisible(false);
  };

  const onCacTypeSelect = (type) => {
    setCacType(type);
  };

  const showDropDown = () => {
    return (
      <View style={styles.dropDownContent}>
        <TouchableOpacity
          style={
            cacType === "BN"
              ? styles.dropDownChild
              : styles.dropDownChildInactive
          }
          onPress={() => (onCacTypeSelect("BN"), onCloseDropdown())}
        >
          <Text style={styles.dropDownChildText}>BN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            cacType === "LTD"
              ? styles.dropDownChild
              : styles.dropDownChildInactive
          }
          onPress={() => (onCacTypeSelect("LTD"), onCloseDropdown())}
        >
          <Text style={styles.dropDownChildText}>LTD</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            cacType === "RC"
              ? styles.dropDownChild
              : styles.dropDownChildInactive
          }
          onPress={() => (onCacTypeSelect("RC"), onCloseDropdown())}
        >
          <Text style={styles.dropDownChildText}>RC</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            cacType === "LLP"
              ? styles.dropDownChild
              : styles.dropDownChildInactive
          }
          onPress={() => (onCacTypeSelect("LLP"), onCloseDropdown())}
        >
          <Text style={styles.dropDownChildText}>LLP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            cacType === "IT"
              ? styles.dropDownChild
              : styles.dropDownChildInactive
          }
          onPress={() => (onCacTypeSelect("IT"), onCloseDropdown())}
        >
          <Text style={styles.dropDownChildText}>IT</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onCloseDropdown} style={{ flex: 1 }}>
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
              onPress={navigateBack}
            />
          }
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Setup New Agent"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
        />
        <View style={{ width: "95%", alignSelf: "center" }}>
          <FipProgressBar step="1" />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            <Text
              style={{
                color: COLOUR_BLACK,
                fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                fontSize: 20,
                lineHeight: 24,
                fontWeight: "600",
              }}
            >
              Enter your business details
            </Text>
            <View style={{ marginTop: 18 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: COLOUR_BLACK,
                    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                    fontSize: FONT_SIZE_TITLE,
                    lineHeight: 20,
                    marginRight: 5,
                  }}
                >
                  Enter your Tax Identification Number (TIN)
                </Text>
                {showTinSuccessIcon && (
                  <Icon
                    color={COLOUR_GREEN}
                    name="check-circle"
                    size={18}
                    type="feather"
                  />
                )}
              </View>

              <TextInput
                ref={tinRef}
                keyboardType="default"
                maxLength={14}
                editable={!isLoading && !showTinSuccessIcon}
                // placeholder="Enter TIN"
                onChangeText={(tinNumber) => {
                  updateFormField({ tinNumber });
                }}
                defaultValue={form?.tinNumber}
                style={[
                  styles.inputStyle,
                  {
                    borderColor:
                      errorMessage.tin !== null
                        ? COLOUR_RED
                        : COLOUR_FORM_CONTROL_BACKGROUND,
                    color:
                      isError && errorMessage.tin !== null
                        ? COLOUR_RED
                        : undefined,
                  },
                ]}
              />

              {isError && errorMessage.tin !== null && (
                <View style={styles.errorView}>
                  <Icon
                    name="info-circle"
                    type="font-awesome"
                    color="#DC4437"
                    size={18}
                  />

                  <Text style={styles.errorText}>{errorMessage.tin}</Text>
                </View>
              )}
            </View>
            {showCacField && form.cacNumber !== null && (
              <View style={{ marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      color: COLOUR_BLACK,
                      fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
                      fontSize: FONT_SIZE_TITLE,
                      lineHeight: 20,
                      marginRight: 5,
                    }}
                  >
                    Select your prefix
                  </Text>
                  {showCacSuccessIcon && (
                    <Icon
                      color={COLOUR_GREEN}
                      name="check-circle"
                      size={18}
                      type="feather"
                    />
                  )}
                </View>
                <View style={styles.inputInner}>
                  <View style={styles.bnInfo}>
                    <TouchableOpacity
                      style={styles.bnInfoInner}
                      onPress={onToggleDropdown}
                    >
                      <Text
                        style={[styles.dropDownChildText, { marginRight: 3 }]}
                      >
                        {cacType}
                      </Text>

                      <Icon
                        name="chevron-down"
                        type="feather"
                        color="#072F40"
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    keyboardType="default"
                    // maxLength={8}
                    // editable={!isLoading && !showCacSuccessIcon}
                    editable={false}
                    // placeholder="Enter CAC Number"
                    onChangeText={(cacNumber) => {
                      updateFormField({ cacNumber });
                    }}
                    defaultValue={form?.cacNumber}
                    style={[
                      styles.inputStyle,
                      {
                        borderColor:
                          errorMessage.cac !== null
                            ? COLOUR_RED
                            : COLOUR_FORM_CONTROL_BACKGROUND,
                        color:
                          isError && errorMessage.cac !== null
                            ? COLOUR_RED
                            : undefined,
                        width: "80%",
                      },
                    ]}
                  />
                  {dropdownVisible && showDropDown()}
                </View>

                {isError && errorMessage.cac !== null && (
                  <View style={styles.errorView}>
                    <Icon
                      name="info-circle"
                      type="font-awesome"
                      color="#DC4437"
                      size={18}
                    />

                    <Text style={styles.errorText}>{errorMessage.cac}</Text>
                  </View>
                )}
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: FONT_FAMILY_BODY,
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                Are you a Government Biller?{" "}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("FipAgentAuthorizationLetter")
                }
              >
                <Text
                  style={{
                    fontFamily: FONT_FAMILY_BODY,
                    fontSize: 14,
                    fontWeight: "700",
                    color: COLOUR_LINK_BLUE,
                  }}
                >
                  Click here
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              // disabled={isLoading || !form?.tinNumber}
              disabled={isLoading}
              style={[
                styles.button,
                {
                  // opacity: isLoading || !form?.tinNumber ? 0.6 : 1,
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              onPress={onSubmit}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                  {showCacField && form.cacNumber !== null ? "NEXT" : "NEXT"}
                </Text>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("FipAgentNinVerification")
              }
            >
              <Text>Go to Nin</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_TEXT_INPUT,
    width: "100%",
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,

    borderWidth: 1.5,
    borderRadius: 8,
    flexDirection: "row",
    height: 50,
    padding: 0,
    paddingLeft: 15,
  },

  contentContainer: {
    width: "90%",
    alignSelf: "center",
    flex: 1,
    paddingVertical: 15,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  button: {
    height: 56,
    backgroundColor: "#00425F",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    width: "100%",
  },

  bannerText: {
    color: "#5F738C",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
  },

  buttonText: {
    color: "white",
    lineHeight: 24,
    fontSize: 16,
  },

  errorText: {
    color: "#DC4437",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    left: 3,
  },
  errorView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "98%",
    alignSelf: "center",
  },
  inputError: {
    color: "#DC4437",
  },
  dropDownChild: {
    marginBottom: 10,
    width: 102,
    height: 36,
    padding: 8,
    backgroundColor: "#EBECF0",
    borderRadius: 3,
  },

  dropDownChildInactive: {
    marginBottom: 8,
    width: 102,
    height: 36,
    padding: 8,
  },
  dropDownContent: {
    backgroundColor: "white",
    width: 115,
    height: 230,
    borderRadius: 6,
    elevation: 2,
    padding: 6,
    position: "absolute",
    top: 56,
    zIndex: 1,
    alignItems: "center",
  },
  dropDownChildText: {
    color: "#072F40",
    fontFamily: FONT_FAMILY_BODY,
    fontSize: FONT_SIZE_MID,
    lineHeight: 20,
    fontWeight: "400",
  },
  inputInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  bnInfoInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bnInfo: {
    height: 50,
    width: "18%",
    marginRight: 8,
    backgroundColor: COLOUR_FORM_CONTROL_BACKGROUND,
    borderRadius: 8,
    justifyContent: "center",
  },
});

export default FipAgentTinAndCacVerification;
