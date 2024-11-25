import React from "react";
import { View } from "react-native";
import { Divider, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../../../components/button";
import FormCheckbox from "../../../../../../components/form-controls/form-checkbox";
import Header from "../../../../../../components/header";
import Text from "../../../../../../components/text";
import { USER, WALLET } from "../../../../../../constants";
import { ERROR_STATUS } from "../../../../../../constants/api";
import { NGN } from "../../../../../../constants/currencies";
import { BLOCKER } from "../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_RED,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from "../../../../../../constants/styles";
import symbols from "../../../../../../constants/symbols";
import amountField from "../../../../../../fragments/amount-field";
import UserSerializer from "../../../../../../serializers/resources/user";
import Transaction from "../../../../../../services/api/resources/transaction";
import { convertNgnToNgk } from "../../../../../../utils/converters/currencies";
import { flashMessage } from "../../../../../../utils/dialog";
import handleErrorResponse from "../../../../../../utils/error-handlers/api";
import { loadData } from "../../../../../../utils/storage";
import DisabledScene from "../../../../../misc/disabled-scene";

const EMPTY_AMOUNT = "0.00";
const NGN_SYMBOL = symbols[NGN];
const OTHER_AMOUNT = "Other amount";

export default class UnloadCommissionScene extends React.Component {
  transaction = new Transaction();

  constructor() {
    super();

    this.state = {
      amount: EMPTY_AMOUNT,
      currentBalance: "0.00",
      isLoading: false,
    };

    this.getPaid = this.getPaid.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async _loadUser() {
    const currentUser = new UserSerializer(JSON.parse(await loadData(USER)));
    return currentUser;
  }

  async loadData() {
    const currentUser = await this._loadUser();
    const { commissions_earned } =
      JSON.parse(await loadData(WALLET + currentUser.businessMobileNo)) || {};
    this.setState({
      currentBalance: JSON.stringify(commissions_earned),
    });
  }

  async getPaid() {
    this.setState({
      isLoading: true,
    });

    const { amount } = this.state;

    const { status, response, code } = await this.transaction.unloadCommission(
      convertNgnToNgk(parseFloat(amount))
    );

    console.log("UNLOAD COMMISSION", status, response, code);

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), BLOCKER);

      return;
    }

    console.log("UNLOAD COMMISSION", status, response, code);
    flashMessage(
      "Successful",
      `${NGN_SYMBOL}${amount} has been successfully transferred to your current balance.`,
      BLOCKER
    );

    this.setState({
      isLoading: false,
    });

    this.props.navigation.replace("HomeTabs");
  }

  render() {
    const {
      remoteConfig: { enable_commission_unload },
    } = this.props;

    return (
      <View
        style={{
          backgroundColor: COLOUR_SCENE_BACKGROUND,
          flex: 1,
        }}
      >
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
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title="Unload Commission"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />

        {enable_commission_unload === false ? (
          <DisabledScene sceneName="Commissions Unload" />
        ) : (
          <React.Fragment>
            <ScrollView
              contentContainerStyle={{
                padding: 20,
              }}
            >
              <Text>AVAILABLE COMMISSION:</Text>

              <Text bold black big>
                {amountField("NGN", this.state.currentBalance || EMPTY_AMOUNT)}
              </Text>

              <FormCheckbox
                autoCompleteType="tel"
                keyboardType="number-pad"
                text="Amount:"
                placeholder="Enter your amount"
                onChangeText={(value) =>
                  this.setState({
                    amount: value,
                  })
                }
                onSelect={(value) => {
                  if (value === OTHER_AMOUNT) {
                    this.setState({
                      amount: EMPTY_AMOUNT,
                      toShowInput: true,
                    });
                  } else {
                    this.setState({
                      amount: this.state.currentBalance,
                      toShowInput: false,
                    });
                  }
                }}
                outerContainerStyle={{ marginTop: 15 }}
                innerContainerStyle={{
                  backgroundColor: COLOUR_WHITE,
                  marginTop: 5,
                  padding: 5,
                }}
                options={[
                  amountField("NGN", this.state.currentBalance || EMPTY_AMOUNT),
                  "Other amount",
                ]}
                withInput={this.state.toShowInput}
                validators={{
                  required: true,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  marginTop: 30,
                }}
              >
                <Text black big>
                  Total Amount
                </Text>
                <Text black big>
                  {amountField(NGN, this.state.amount || EMPTY_AMOUNT)}
                </Text>
              </View>

              <Divider />
            </ScrollView>

            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 20,
              }}
            >
              <Button
                transparent
                buttonStyle={{ paddingHorizontal: 40 }}
                onPressOut={() => this.props.navigation.goBack()}
                title="Cancel"
                titleStyle={{ color: COLOUR_GREY }}
              />
              <Button
                buttonStyle={{ paddingHorizontal: 40 }}
                containerStyle={{ width: "50%" }}
                loading={this.state.isLoading}
                onPressOut={this.getPaid}
                title="Get Paid"
              />
            </View>
          </React.Fragment>
        )}
      </View>
    );
  }
}
