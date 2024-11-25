import React from "react";
import { Alert, InteractionManager, ScrollView, View } from "react-native";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../../../../../components/header";
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from "../../../../../constants/styles";
import navigationService from "../../../../../utils/navigation-service";
import ProgressBar from "../../../../aggregator/components/progress-bar";
import { KycDetailsForm as CacKycInformationCacKycInformation } from "../forms/kyc-form";

class CacKycDetails extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      errorMessage: null,
      invalidFields: [],
      disableHeaderNav: false,
      isLoading: false,
      base64Selfie: null,
      allBase64Images: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
      //   setTimeout(() => this.accountNumber.focus(), 500);
    });

    console.log("DOCS", this.kycForm.state.selfie);
  }

  async convertFilesToBase64(array) {
    const result = {};
    console.log("ARRAY", array);
    for (let i = 0; i < array.length; i++) {
      const base64String = await this.base64Image(array[i].fileCopyUri);
      result[array[i].documentName] = {
        ...array[i],
        base64: base64String,
      };
    }
    this.setState({
      isLoading: true,
    });
    console.log("RESULTS", result);
    return result;
  }

  async convertSelfieImageToBase64(url) {
    const selfieBase64 = await this.base64Image(url);
    console.log("SELFIEBASE64", selfieBase64);
    this.setState({
      base64Selfie: selfieBase64,
      isLoading: false,
    });
    console.log("SELFIEBASE6423", this.state.base64Selfie);
  }

  async base64Image(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    const reader = new FileReader();
    const base64data = await new Promise((resolve) => {
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });

    return base64data;
  }

  checkDocumentsValidity(documents) {
    const length = documents.length;
    return length === 0 || length === 1;
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Logout",
          onPress: () => navigationService.replace("Logout"),
        },
        {
          text: "Try Again",
          onPress: () => {},
          style: "cancel",
        },
      ],

      { cancelable: false }
    );
  }

  async navigate() {
    // await saveData("kycimages", base64String);
    this.props.navigation.navigate("CacBusinessDetails");
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    console.log("SELFIE", this.kycForm.state.selfieBase64);
    const documentsData = this.kycForm.state.attachments;
    console.log("DOCUMENTDATA", documentsData);
    const base64String = await this.convertFilesToBase64(documentsData);
    this.setState({
      allBase64Images: base64String,
    });
    console.log("BASE64STRING", base64String);
    console.log("BASE64STRING2", this.state.allBase64Images);
    console.log("HAS SELFIE", this.kycForm.state.hasSelfie);
    if (this.kycForm.state.hasSelfie && !this.kycForm.state.assistedCacRegType) {
      await this.convertSelfieImageToBase64(`${this.kycForm.state.selfie}`);
      base64String["Passport"] = {
        base64: this.state.base64Selfie,
      };

      console.log('ASSISTED NO SELFIE')
    }
    this.setState({
      isLoading: false,
    });

    this.props.navigation.replace("CacBusinessDetails", {
      base64Images: this.state.allBase64Images,
    });
    // this.navigate();
    // (async () => {

    // })();

    // this.props.navigation.navigate("CacBusinessDetails");
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() =>
                // this.props.navigation.navigate("AgentUpgradeLanding")
                this.props.navigation.navigate("CacPersonalDetails")
              }
            />
          }
          navigationIconColor={COLOUR_WHITE}
          statusBarProps={{
            backgroundColor: "transparent",
            barStyle: CONTENT_LIGHT,
          }}
          title={`CAC Registration`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
            fontSize: FONT_SIZE_TITLE,
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <ProgressBar step="2" size="3" />

        <ScrollView>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
            }}
          >
            <CacKycInformationCacKycInformation
              propagateFormErrors={this.state.propagateFormErrors}
              ref={(form) => (this.kycForm = form)}
              onPress={() => this.onSubmit()}
              loading={this.state.isLoading}
            />
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
              {/* <Button
                onPress={() => this.onSubmit()}
                title="Next"
                loading={this.state.isLoading}
                buttonStyle={{ backgroundColor: COLOUR_BLUE }}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: "100%",
                }}
              /> */}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: (value) =>
      dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: (screen) => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: (message) => dispatch(navigateTo(message)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CacKycDetails);
