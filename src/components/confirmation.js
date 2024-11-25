import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import PropTypes from "prop-types";
import RBSheet from "react-native-raw-bottom-sheet";
import Share from "react-native-share";
import { connect } from "react-redux";

import { SHARE_RECEIPT_TITLE, WITHDRAW } from "../constants";
import {
  COLOUR_PRIMARY,
  COLOUR_RED,
  COLOUR_WHITE,
  FONT_SIZE_BIG,
} from "../constants/styles";
import { Banner } from "./banner";
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

  if (fieldName === "Beneficiary Phone" && !compValue) {
    return null;
  }
  if (fieldName === "Account Type" && !compValue) {
    return null;
  }
  if (fieldName === "Remark" && !compValue) {
    return null;
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
  static default(fields, shouldShowConfirmationTabV2 = null, serviceType = {}) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          backgroundColor: COLOUR_WHITE,
          justifyContent: "flex-start",
          marginTop: 12,
        }}
      >
        {fields.map((section, index) => (
          <View
            key={index}
            style={
              shouldShowConfirmationTabV2
                ? styles.confirmationSectionContainer
                : styles.confirmationSectionContainerOld
            }
          >
            {Object.keys(section).map((item, index) =>
              shouldShowConfirmationTabV2 ? (
                <ConfirmationItem
                  align={index % 2 === 0 ? "left" : "right"}
                  fieldName={item}
                  key={index}
                  value={section[item]}
                />
              ) : (
                <ConfirmationLine
                  fieldName={item}
                  key={index}
                  value={section[item]}
                />
              )
            )}
          </View>
        ))}
        {Boolean(serviceType?.confirmationTabMessage) && (
          <Banner
            description={serviceType.confirmationTabMessage}
            style={{ marginBottom: 16 }}
            title={null}
          />
        )}
      </ScrollView>
    );
  }

  static withdrawViaUSSD(fields) {
    const { amount, Commission } = fields;
    const ussdShortCode = fields["USSD SHORT CODE"];

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
                `Kindly dial ${ussdShortCode} to withdraw ${amount} ` +
                `from your Quickteller Paypoint agent.`,
              title: SHARE_RECEIPT_TITLE,
            });
            // Linking.openURL(`tel://${ussdShortCode}`);
          }}
        >
          <React.Fragment>
            <Text center>Commission Due: {Commission}</Text>
            <Text big bold center>
              Customer should dial this code:
            </Text>
            <Text biggest bold center>
              {ussdShortCode}
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
    const shouldShowConfirmationTabV2 = userIsAnInternalAgent;

    if (shouldShowConfirmationTabV2) {
      return (
        <View>
          <Text black style={{ fontSize: 22 }}>
            Transaction Details
          </Text>
          <Text black style={{ marginBottom: 8 }} mid>
            Please confirm the transaction details below
          </Text>
        </View>
      );
    }

    return <H1>{this.props.header || "Confirm"}</H1>;
  }

  render() {
    const {
      category,
      fields,
      subCategory,
      userIsAnInternalAgent,
      serviceType,
    } = this.props;
    console.log({ category, subCategory });
    const template =
      category.toUpperCase() === WITHDRAW.toUpperCase() &&
      subCategory.name === "Via USSD"
        ? ConfirmationTemplate.withdrawViaUSSD
        : ConfirmationTemplate.default;

    const shouldShowConfirmationTabV2 = userIsAnInternalAgent;

    return (
      <React.Fragment>
        {this.header}
        {template(fields, shouldShowConfirmationTabV2, serviceType)}
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

  console.log("HEIGHT OF CONFIRMATION TAB", {
    fieldsSize,
    height,
    multiplier,
    numberOfRows,
    shouldShowConfirmationTabV2,
  });

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
    isLoading: state.tunnel.isLoading,
    userIsAnInternalAgent: state.tunnel.remoteConfig.userIsAnInternalAgent,
  };
}

export const ConfirmationBottomSheet = connect(
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
