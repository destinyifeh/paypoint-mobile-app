import React from "react";
import {
  Dimensions, StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import PropTypes from "prop-types";
import RBSheet from "react-native-raw-bottom-sheet";
import Share from "react-native-share";
import { connect } from "react-redux";

import { SHARE_RECEIPT_TITLE } from "../constants";
import {
  COLOUR_PRIMARY,
  COLOUR_RED,
  COLOUR_WHITE,
  FONT_SIZE_BIG
} from "../constants/styles";
import Button from "./button";
import H1 from "./h1";
import Text from "./text";

const windowHeight = Dimensions.get("window").height;

function ConfirmationLine({ fieldName, value }) {
  let compStyle = {};
  const compValue = value;
  const FIELDS_TO_ENBOLDEN = ["Amount", "Fee"];

  if (fieldName === "Amount") {
    compStyle = { fontSize: FONT_SIZE_BIG };
  }

  return (
    <View style={styles.receiptLineContainer}>
      <Text
        bold
        title
        style={{ ...styles.receiptLineItemFieldName, ...compStyle }}
      >
        {fieldName}
      </Text>
      <Text
        bold={FIELDS_TO_ENBOLDEN.includes(fieldName)}
        title
        right
        style={{ ...styles.receiptLineItemValue, ...compStyle }}
      >
        {compValue}
      </Text>
    </View>
  );
}

function ConfirmationItem({ align, fieldName, value }) {
  return (
    <View style={styles.confirmationItemContainer}>
      <Text
        semiBold
        right={align === "right"}
        small
        style={{ color: "#AAB7C6", fontSize: 14 }}
      >
        {fieldName}
      </Text>
      <Text
        black
        semiBold
        right={align === "right"}
        style={{ fontSize: 18 }}
        mid
      >
        {value}
      </Text>
    </View>
  );
}

class ConfirmationTemplate {
  
  static fundViaUSSD(fields) {
    
    const { amount, fee, ussdCode } = fields;

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
          justifyContent: "space-between",
          marginVertical: 8,
        }}
      >
        <Text />
        <TouchableOpacity
          onPress={() => {
            Share.open({
              message:
                `Kindly dial ${ussdCode} to fund ${amount} ` +
                `from your Bank account.`,
              title: SHARE_RECEIPT_TITLE,
            });

          }}
        >
          <React.Fragment>
            <Text center>Fee: {fee}</Text>
            <Text big bold center>
            To fund your wallet with {amount} kindly dial this code:
            </Text>
            <Text biggest bold center>
              { ussdCode }
            </Text>
          </React.Fragment>
        </TouchableOpacity>
        <Text right small>
          {
            'Once your transaction is complete, click on "PROCEED" to \
complete your transaction.'
          }
        </Text>
      </View>
    );
  }
}

class ConfirmationTab_ extends React.Component {
  get actionButtons() {
    return (
      <View
        style={{
          justifyContent: "space-between",
          padding: 15,
        }}
      >
        <Button
          loading={this.props.isLoading}
          containerStyle={{ width: "100%" }}
          title={"PROCEED"}
          onPressOut={this.props.onSubmit}
        />
        <Text style={{ height: 3 }} />
        <Button
          transparent
          containerStyle={{
            width: "100%",
            borderColor: COLOUR_RED,
            borderWidth: 1,
          }}
          title="CANCEL"
          titleStyle={{
            color: COLOUR_PRIMARY,
          }}
          onPressOut={this.props.onClose}
        />
      </View>
    );
  }

  get header() {
    const { userIsAnInternalAgent } = this.props;

    return <H1>{this.props.header || "Confirm"}</H1>;
  }

  render() {
    const {
      fields,
    } = this.props;


    return (
      <React.Fragment>
        {this.header}
        {ConfirmationTemplate.fundViaUSSD(fields)}
        {this.actionButtons}
      </React.Fragment>
    );
  }
}

function ConfirmationBottomSheet_({
  fields,
  internalAgents,
  isLoading,
  onClose,
  requestClose,
  serviceType,
  sheetRef,
  userIsAnInternalAgent,
  ...props
}) {
  const fieldsSize = Array.isArray(fields)
    ? fields.reduce((total, section) => total + Object.keys(section).length, 0)
    : null;

  const shouldShowConfirmationTabV2 = userIsAnInternalAgent;

  console.log({ fieldsSize });

  let height = null;
  let multiplier = null;
  let numberOfRows = null;
  if (fieldsSize) {
    numberOfRows = Math.round(fieldsSize / 2);
    multiplier = Math.max(Math.min(numberOfRows * 1.75, 8), 4.5);
    height = shouldShowConfirmationTabV2
      ? windowHeight * (multiplier / 10)
      : windowHeight * 0.9;

    if (serviceType?.confirmationTabMessage) {
      height += 60;
    }
  } else {
    height = windowHeight * 0.9;
  }

  return (
    <RBSheet
      animationType="fade"
      closeOnPressBack={true}
      closeOnPressMask={true}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      minClosingHeight={height}
      duration={250}
      height={height}
      onClose={() => {
        onClose();
      }}
      ref={sheetRef}
      customStyles={{
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <ConfirmationTab
          fields={fields}
          isLoading={isLoading}
          onClose={requestClose}
          serviceType={serviceType}
          {...props}
        />
      </View>
    </RBSheet>
  );
}

function mapStateToProps(state) {
  return {
    internalAgents: state.tunnel.remoteConfig.account_opening_pilot_group,
    userIsAnInternalAgent: state.tunnel.remoteConfig.userIsAnInternalAgent,
  };
}

export const ConfirmationBottomSheetUssd = connect(
  mapStateToProps,
  null
)(ConfirmationBottomSheet_);

export const ConfirmationTab = connect(
  mapStateToProps,
  null
)(ConfirmationTab_);

ConfirmationBottomSheet_.propTypes = {
  fields: PropTypes.array,
  internalAgents: PropTypes.array,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  requestClose: PropTypes.func,
  sheetRef: PropTypes.any,
  userIsAnInternalAgent: PropTypes.bool,
};

ConfirmationItem.propTypes = {
  align: PropTypes.string,
  fieldName: PropTypes.string,
  value: PropTypes.string,
};

ConfirmationLine.propTypes = {
  fieldName: PropTypes.string,
  value: PropTypes.string,
};

ConfirmationTab.propTypes = {
  category: PropTypes.string,
  fields: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  header: PropTypes.string,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  payment: PropTypes.object,
  processed: PropTypes.bool,
  shouldShowConfirmationTabV2: PropTypes.bool,
  subCategory: PropTypes.object,
  userIsAnInternalAgent: PropTypes.bool,
};

const styles = StyleSheet.create({
  receiptLineItemFieldName: {
    width: "45%",
  },
  receiptLineItemValue: {
    width: "50%",
  },
  receiptLineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  confirmationSectionContainerOld: {
    marginBottom: 20,
  },
  confirmationItemContainer: {
    flexDirection: "column",
    marginTop: 20,
    width: "45%",
  },
  confirmationSectionContainer: {
    borderTopColor: "#F3F5F6",
    borderTopWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
