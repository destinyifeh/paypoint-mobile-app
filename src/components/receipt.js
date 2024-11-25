import React, { useCallback, useEffect, useState } from "react";

import PropTypes from "prop-types";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import SendIntentAndroid from "react-native-send-intent";
import Share from "react-native-share";
import ViewShot, { captureRef } from "react-native-view-shot";
import { connect } from "react-redux";

import DeviceInfo from "react-native-device-info";
import { Icon } from "react-native-elements";

import {
  failedAnimation,
  successAnimation,
  waitingAnimation,
} from "../animations";
import { SHARE_RECEIPT_MESSAGE, SHARE_RECEIPT_TITLE, USER } from "../constants";
import {
  DEFAULT_REMOTE_CONFIG_VALUES,
  PRINTER_DRIVER_PACKAGE_NAME,
} from "../constants/api-resources";
import { BLOCKER, CASUAL } from "../constants/dialog-priorities";
import {
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_OFF_WHITE,
  COLOUR_PRIMARY,
  COLOUR_WHITE,
  FONT_FAMILY_BODY,
} from "../constants/styles";
import UserSerializer from "../serializers/resources/user";
import { convertNgkToNgn } from "../utils/converters/currencies";
import { flashMessage } from "../utils/dialog";
import { formatDateTime3, formatNgnAmount } from "../utils/formatters";
import PrintManager, {
  BluetoothPrintManager,
  InbuiltUsbThermalPrintManager,
} from "../utils/print-manager";
import { loadData } from "../utils/storage";
import BankIcon from "./bank-icon";
import ClickableListItem from "./clickable-list-item";
import { FormInput } from "./form-controls/form-input";
import Modal from "./modal";
import Text from "./text";

const TRANSACTION_STATUS = "Transaction Status";
const businessName = {};

const getReceiptImage = async (receiptRef) => {
  return await captureRef(receiptRef, {
    format: "jpg",
    quality: 0.8,
  });
};

const shareReceiptCapture = async (receiptRef) => {
  const uri = await getReceiptImage(receiptRef);

  await Share.open({
    url: `file://${uri}`,
    message: SHARE_RECEIPT_MESSAGE,
    title: SHARE_RECEIPT_TITLE,
  });
};
const windowHeight = Dimensions.get("window").height;

function ReceiptLine({ fieldName, value }) {
  if (fieldName === "Transaction Date") {
    value = value.toUpperCase();
  }

  const compValue = value;
  if (fieldName === "Beneficiary Phone" && !compValue) {
    return null;
  }
  if (fieldName === "Remark" && !compValue) {
    return null;
  }

  return (
    <View style={styles.receiptLineContainer}>
      <Text black bold receiptLineItem style={styles.receiptLineItemFieldName}>
        <Text black bold>
          {fieldName}
          {(fieldName + compValue).length > 25 ? ":\n" : ": "}
        </Text>
        {compValue}
      </Text>
    </View>
  );
}

function Receipt({
  fields,
  icon,
  iconPath,
  onDismiss,
  onHome,
  paymentDetailsTitle,
  showAnimation,
  subMessage,
  template,
  thankYouMessage,
  receiptType,
  newRemoteConfig,
  remoteConfig: { devices_with_printers: devicesWithPrinters },
}) {
  const printManager = new PrintManager({
    devicesWithPrinters,
  });
  const receiptView = React.useRef();

  const [areAnimationsDone, setAreAnimationsDone] = useState(false);
  const [transactionSuccessfulTextOpacity] = useState(new Animated.Value(0.1));
  const [userCanPrint, setUserCanPrint] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [disablePrintButton, setDisablePrintButton] = useState(false);
  const [showPrintPasswordModal, setShowPrintPasswordModal] = useState(false);
  const [printPassword, setPrintPassword] = useState("");

  useEffect(() => {
    if (!showAnimation) {
      return;
    }

    Animated.timing(transactionSuccessfulTextOpacity, {
      toValue: 1,
      duration: 2000,
      easing: Easing.circle,
      useNativeDriver: true,
    }).start();

    !areAnimationsDone && setTimeout(() => setAreAnimationsDone(true), 2200);
  }, []);

  useEffect(() => {
    loadData(USER).then((data) => {
      const userData = new UserSerializer(JSON.parse(data));

      businessName["Business Name"] = userData.domainName;
      setHasLoaded(true);
    });

    SendIntentAndroid.isAppInstalled(PRINTER_DRIVER_PACKAGE_NAME).then(
      (isAppInstalled) => setUserCanPrint(isAppInstalled)
    );
  }, []);

  const animationView = () => {
    const transactionStatus = fields?.find((section) =>
      Object.keys(section).includes(TRANSACTION_STATUS)
    )[(TRANSACTION_STATUS, "requestType")];

    let animation = null;

    switch (transactionStatus) {
      case "Successful":
        animation = successAnimation;
        break;
      case "Pending":
        animation = waitingAnimation;
        break;
      case "Failed":
        animation = failedAnimation;
        break;
    }

    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          padding: 16,
        }}
      >
        {animation ? animation({ style: { height: 400, width: 400 } }) : null}
        <Text bigger bold center>
          Transaction {transactionStatus}
        </Text>
        <Text center>Please, hold on for the receipt!</Text>
      </View>
    );
  };

  const checkprintPassword = async () => {
    if (printPassword == newRemoteConfig.print_restriction_password) {
      flashMessage(null, "Receipt is being printed. Please wait...", CASUAL);

      const bluetoothPrinter = new BluetoothPrintManager();
      const thermalPrinter = new InbuiltUsbThermalPrintManager();
      const { deviceModel } = await getDeviceDetails();

      if (devicesWithPrinters.includes(deviceModel)) {
        thermalPrinter.printReceipt(fields, iconPath, receiptType);
      } else {
        if (!(await printManager.checkIfUserCanPrint())) {
          flashMessage(
            "Printer not setup",
            'Go to "Help" and select "Setup Printer" to set your ' +
              "printer up to print receipts!",
            BLOCKER
          );

          return;
        }

        flashMessage(null, "Receipt is being printed. Please wait...", CASUAL);

        let uri = fields;
        uri = await getReceiptImage(receiptView.current);

        bluetoothPrinter.printReceipt(uri, iconPath);

        return;
      }
      setDisablePrintButton(true);
      return;
    } else {
      flashMessage(null, "Invalid Password.", CASUAL);
      Alert.alert("Error", "Invalid Password.");
    }
  };

  const printPasswordModal = () => {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              setShowPrintPasswordModal(false);
              checkprintPassword();
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              width: "40%",
            },
            title: "Continue",
            disabled: printPassword == "" ? true : false,
          },
          {
            containerStyle: {
              width: "2%",
              backgroundColor: "white",
            },
          },
          {
            onPress: () => {
              setShowPrintPasswordModal(false);
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: "40%",
              backgroundColor: "#999999",
            },
            title: "Cancel",
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FormInput
              hideOptionalLabel
              outerContainerStyle={{
                marginBottom: 5,
                borderBottomColor: "red",
              }}
              innerContainerStyle={{
                elevation: 5,
                marginBottom: 5,
              }}
              onChangeText={(searchTerm) => setPrintPassword(searchTerm)}
              placeholder="Enter Password"
            />
          </View>
        }
        isModalVisible={true}
        size="md"
        title="Print Confirmation"
        withButtons
        hideCloseButton
      />
    );
  };

  const actionButtons = (onHome) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          justifySelf: "flex-end",
          paddingBottom: 5,
          paddingTop: 5,
          borderTopColor: "#e5e5e6",
          borderTopWidth: 0.86,
          paddingRight: 15,
          paddingLeft: 15,
        }}
      >
        <ClickableListItem onPress={onDismiss} center>
          <Icon name="arrow-back" color={COLOUR_PRIMARY} size={22} />
          <Text
            blue
            semiBold
            title
            style={{
              fontSize: 14,
            }}
          >
            Back
          </Text>
        </ClickableListItem>

        <ClickableListItem
          center
          disabled={disablePrintButton == true ? true : false}
          style={{
            userSelect: disablePrintButton == true ? "none" : "",
          }}
          onPress={async () => {
            console.log(fields[1]["Biller Name"], "NUGAGEE FIELDS");
            console.log(newRemoteConfig, "NUGAGEE NEW REMOTE CONFIGS");
            console.log(
              newRemoteConfig?.print_restriction_biller,
              "NUGAGEE NEW REMOTE CONFIGS VALUEs"
            );
            if (
              newRemoteConfig?.print_restriction_biller.includes(
                fields[1]["Biller Name"]
              ) &&
              receiptType == "***RE-PRINT***"
            ) {
              // if (
              //   fields[1]['Biller Name'] == "BENUE STATE IRS" &&
              //   receiptType == "***RE-PRINT***"
              // ) {
              setShowPrintPasswordModal(true);
            } else if (
              DEFAULT_REMOTE_CONFIG_VALUES.print_restriction_biller.includes(
                // newRemoteConfig.print_restriction_biller.includes(
                fields[1]["Biller Name"]
              )
            ) {
              const bluetoothPrinter = new BluetoothPrintManager();
              const thermalPrinter = new InbuiltUsbThermalPrintManager();
              //  const { deviceModel } = await getDeviceDetails();
              const deviceModel = await DeviceInfo.getDeviceName();

              if (devicesWithPrinters.includes(deviceModel)) {
                thermalPrinter.printReceipt(fields, iconPath, receiptType);
              } else {
                // if (!(await printManager.checkIfUserCanPrint())) {
                //   flashMessage(
                //     "Printer not setup",
                //     'Go to "Help" and select "Setup Printer" to set your ' +
                //       "printer up to print receipts!",
                //     BLOCKER
                //   );

                //   return;
                // }

                thermalPrinter.printReceipt(fields, iconPath, receiptType);

                flashMessage(
                  null,
                  "Receipt is being printed. Please wait...",
                  CASUAL
                );

                // let uri = fields;
                // uri = await getReceiptImage(receiptView.current);

                // bluetoothPrinter.printReceipt(uri, iconPath);

                return;
              }
              setDisablePrintButton(true);
              return;
            } else {
              const bluetoothPrinter = new BluetoothPrintManager();
              const thermalPrinter = new InbuiltUsbThermalPrintManager();
              //  const { deviceModel } = await getDeviceDetails();
              const deviceModel = await DeviceInfo.getDeviceName();

              if (devicesWithPrinters.includes(deviceModel)) {
                thermalPrinter.printReceipt(fields, iconPath, receiptType);
              } else {
                // if (!(await printManager.checkIfUserCanPrint())) {
                //   flashMessage(
                //     "Printer not setup",
                //     'Go to "Help" and select "Setup Printer" to set your ' +
                //       "printer up to print receipts!",
                //     BLOCKER
                //   );

                //   return;
                // }

                thermalPrinter.printReceipt(fields, iconPath, receiptType);

                flashMessage(
                  null,
                  "Receipt is being printed. Please wait...",
                  CASUAL
                );

                // let uri = fields;
                // uri = await getReceiptImage(receiptView.current);

                // bluetoothPrinter.printReceipt(uri, iconPath);

                return;
              }

              return;
            }
          }}
        >
          <Icon
            name="print"
            color={disablePrintButton == true ? COLOUR_GREY : COLOUR_PRIMARY}
            size={22}
            onPressOut={() => shareReceiptCapture(receiptView.current)}
          />
          <Text
            blue
            semiBold
            title
            style={{
              fontSize: 14,
            }}
          >
            Print
          </Text>
        </ClickableListItem>

        <ClickableListItem
          onPress={() => {
            shareReceiptCapture(receiptView.current);
          }}
          center
        >
          <Icon
            name="share"
            color={COLOUR_PRIMARY}
            size={22}
            onPressOut={() => shareReceiptCapture(receiptView.current)}
          />
          <Text
            blue
            semiBold
            title
            style={{
              fontSize: 14,
            }}
          >
            Share
          </Text>
        </ClickableListItem>

        <ClickableListItem onPress={onHome} center>
          <Icon name="home" color={COLOUR_PRIMARY} size={22} />
          <Text
            blue
            semiBold
            title
            style={{
              fontSize: 14,
            }}
          >
            Home
          </Text>
        </ClickableListItem>
      </View>
    );
  };

  // const { domainName } = userData;

  const receiptContent = useCallback(() => {
    return (
      <ViewShot
        ref={receiptView}
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
          padding: 20,
          paddingTop: 45,
          paddingBottom: 0,
        }}
      >
        {Boolean(icon) && (
          <Image
            source={{ uri: icon }}
            style={{
              height: 60,
              left: 20,
              paddingLeft: 60,
              paddingTop: 50,
              position: "absolute",
              top: 5,
              maxWidth: 150,
            }}
          />
        )}
        <Image
          source={require("../assets/media/icons/paypoint.png")}
          style={{
            height: 100,
            right: 20,
            position: "absolute",
            resizeMode: "center",
            top: -20,
            maxWidth: 150,
          }}
        />
        <Text
          blue
          bold
          style={{
            fontSize: 22,
            marginTop: 27,
          }}
        >
          {thankYouMessage}
        </Text>

        <Text
          blue
          semiBold
          title
          style={{
            fontSize: 17,
            marginTop: 7.5,
          }}
        >
          {subMessage}
        </Text>
        <Text
          blue
          semiBold
          title
          style={{
            fontSize: 14,
            marginTop: 7.5,
            marginBottom: 7.5,
          }}
        >
          {receiptType}
        </Text>

        {Boolean(paymentDetailsTitle) && (
          <View
            style={{
              borderBottomColor: "#e5e5e6",
              borderBottomWidth: 0.86,
              marginTop: 10,
              paddingBottom: 8,
            }}
          >
            <Text black bold>
              {paymentDetailsTitle}
            </Text>
          </View>
        )}

        {fields.transactionType === "POS_PURCHASE"
          ? new ReceiptContentTemplates().pos(fields)
          : template(fields)}
      </ViewShot>
    );
  }, [fields, hasLoaded]);

  // return <Text>{JSON.stringify(hasLoaded)}</Text>;

  return hasLoaded ? (
    <View style={styles.container}>
      {!areAnimationsDone && showAnimation ? (
        animationView()
      ) : (
        <React.Fragment>
          {showPrintPasswordModal && printPasswordModal()}
          <ScrollView>{receiptContent()}</ScrollView>
          {actionButtons(onHome)}
        </React.Fragment>
      )}
    </View>
  ) : (
    <React.Fragment />
  );
}

export class ReceiptContentTemplates {
  default(fields) {
    return (
      <View>
        {fields?.map((section, index) =>
          Object.keys(section).length ? (
            <View
              key={index}
              style={{
                borderColor: COLOUR_LIGHT_GREY,
                borderBottomWidth: 1,
                marginBottom: 2, // 4,
              }}
            >
              {Object.keys(section).map((item, index) => (
                <ReceiptLine
                  key={index}
                  fieldName={item}
                  value={section[item]}
                />
              ))}
            </View>
          ) : (
            <React.Fragment key={index} />
          )
        )}
        <View
          style={{
            borderColor: COLOUR_LIGHT_GREY,
            borderBottomWidth: 1,
            marginBottom: 2, // 4,
          }}
        >
          <ReceiptLine
            key={20}
            fieldName={"Business Name"}
            value={businessName["Business Name"]}
          />
        </View>
      </View>
    );
  }
  pos(fields) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Agent Phone Number
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.initiatorUsername || "Loading..."}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Transaction Date
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {formatDateTime3(new Date())}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Terminal Model
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.terminalModel || "Loading..."}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Narration
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.paymentStatus === "paid"
              ? "POS PURCHASE"
              : "POS Deployment Fee"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Transaction Status
          </Text>
          <Text bold right style={{ width: "50%", color: COLOUR_GREEN }}>
            Successful
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Transaction Reference
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.transactionReference || "Loading..."}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Request Type
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {(fields?.paymentStatus === "paid" && "Paid") || "Free"}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Quantity
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.quantity || "Loading..."}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Amount
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {formatNgnAmount(convertNgkToNgn(fields?.amount || 0))}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 14,
            borderBottomColor: COLOUR_OFF_WHITE,
            borderBottomWidth: 1,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Agent Business Name
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.businessName || "Loading..."}
          </Text>
        </View>
      </View>
    );
  }

  accountOpeningTemplate(allFields) {
    const [fields, ...rest] = allFields;

    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          marginBottom: 15,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          <Text small bold center grey uppercase>
            {fields?.Bank}
          </Text>
        </View>

        <BankIcon bankName={fields?.Bank} style={{ height: 140, width: 140 }} />

        <View
          style={{ flexDirection: "row", paddingVertical: 6, marginTop: 6 }}
        >
          <Text bigger bold center grey uppercase>
            {fields["First Name"]} {fields["Middle Name"]} {fields["Last Name"]}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            paddingVertical: 6,
          }}
        >
          <Text left style={{ width: "45%" }}>
            Account Number
          </Text>
          <Text bold right style={{ width: "50%" }}>
            {fields?.AccountNumber}
          </Text>
        </View>

        {rest.map((section, index) =>
          Object.keys(section).length ? (
            <View
              key={index}
              style={{
                borderColor: COLOUR_LIGHT_GREY,
                borderBottomWidth: 1,
                marginBottom: 2, // 4,
              }}
            >
              {Object.keys(section).map((item, index) => (
                <ReceiptLine
                  key={index}
                  fieldName={item}
                  value={section[item]}
                />
              ))}
            </View>
          ) : (
            <React.Fragment />
          )
        )}
      </View>
    );
  }
}

function ReceiptBottomSheet_({
  onClose,
  requestClose,
  sheetRef,
  onHome,
  ...props
}) {
  return (
    <RBSheet
      animationType="fade"
      closeOnPressBack={false}
      closeOnPressMask={false}
      closeOnDragDown={false}
      duration={250}
      height={windowHeight * 0.9}
      onClose={() => {
        console.log("CALLING ON CLOSE");
        onClose();
      }}
      onHome={() => {
        onClose();
      }}
      ref={sheetRef}
    >
      <Receipt onDismiss={requestClose} onHome={onHome} {...props} />
    </RBSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  receiptLineContainer: {
    flexDirection: "row",
  },
  receiptLineItemFieldName: {
    fontSize: 18,
    marginTop: 4,
    paddingTop: 2,
    paddingBottom: 1,
    lineHeight: 18,
    fontFamily: FONT_FAMILY_BODY,
  },
});

Receipt.defaultProps = {
  subMessage: "Here is your transaction receipt.\nSee payment details below.",
  thankYouMessage: "Thank you for using \nQuickteller Paypoint",
  paymentDetailsTitle: "Payment Details",
  showAnimation: false,
  receiptType: "***ORIGINAL COPY***",
  template: new ReceiptContentTemplates().default,
};

ReceiptBottomSheet_.propTypes = {
  fields: PropTypes.any,
  onClose: PropTypes.func,
  requestClose: PropTypes.func,
  sheetRef: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    remoteConfig: state.tunnel.remoteConfig,
  };
}

export const ReceiptBottomSheet = connect(
  mapStateToProps,
  null
)(ReceiptBottomSheet_);

export default connect(
  mapStateToProps,
  null
)(Receipt);
