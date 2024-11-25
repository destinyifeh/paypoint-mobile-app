import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import RNFetchBlob from "rn-fetch-blob";

import { Alert } from "react-native";
import cloudDownload from "../../../../../../../assets/media/images/download-outlined.png";
import fileSymbol from "../../../../../../../assets/media/images/file-symbol.png";
import ClickableListItem from "../../../../../../../components/clickable-list-item";
import FormInput from "../../../../../../../components/form-controls/form-input";
import Header from "../../../../../../../components/header";
import { AGENT } from "../../../../../../../constants";
import {
  DISABLE_PROFILE_FIELDS,
  DOCUMENT_BASE_URL,
} from "../../../../../../../constants/api-resources";
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_SEMIBOLD,
} from "../../../../../../../constants/styles";
import AgentSerializer from "../../../../../../../serializers/resources/agent";
import { loadData } from "../../../../../../../utils/storage";
export default class UpdateDocumentsScene extends React.Component {
  state = {
    expand: null,
    form: {
      documents: [],
    },
    toggler: false,
    attachmentToggler: false,
  };

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));

    console.log("AGENT INFORMATION", agentInformation);

    const serializedAgentInformation = new AgentSerializer(agentInformation);

    this.setState({
      form: {
        ...this.state.form,
        ...this.serializeApiData(agentInformation),
      },
    });
  }

  addInvalidField() {}

  serializeApiData(apiData) {
    const {
      documents,
      identificationNumber,
      identificationType,
      nin,
    } = apiData;

    return {
      documents,
      identificationNumber,
      identificationType,
      nin,
    };
  }

  updateFormField() {}

  addInvalidField() {}

  removeInvalidField() {}

  onToggle() {
    this.setState({ toggler: !this.state.toggler });
  }

  async downloadFile(uri, documentName) {
    console.log(uri, "uriiii");

    try {
      const response = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: RNFetchBlob.fs.dirs.DownloadDir + `/${documentName}`,
          description: "Downloading file...",
        },
      }).fetch("GET", uri);

      console.log("File downloaded:", response.path());
      Alert.alert("File Downloaded", "Check your Downloads folder.");
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "Failed to download file.");
    }
  }
  render() {
    return (
      <View
        style={{
          // backgroundColor: "#F3F3F4",
          backgroundColor: "#FFFFFF",

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
          title="KYC Information"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: "bold",
          }}
        />

        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}
        >
          <View style={styles.contentView}>
            <View style={styles.innerContainerView}>
              <TouchableOpacity
                style={[
                  styles.touchableDropdown,
                  { borderBottomWidth: !this.state.toggler ? 2 : 0 },
                ]}
                onPress={() => this.onToggle()}
              >
                <Text style={styles.titleText}>KYC Information</Text>
                <Icon
                  name={this.state.toggler ? "chevron-up" : "chevron-down"}
                  type="feather"
                  size={24}
                  color="grey"
                  containerStyle={{}}
                />
              </TouchableOpacity>

              {/* <ScrollView contentContainerStyle={{
        padding: 20
      }}> */}

              {!this.state.toggler && (
                <>
                  <FormInput
                    defaultValue={this.state.form.identificationType ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(identificationType, isValid) => {
                      this.updateFormField({ identificationType });
                      !isValid
                        ? this.addInvalidField("identificationType")
                        : this.removeInvalidField("identificationType");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="ID Type"
                    textInputRef={(input) => (this.identificationType = input)}
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.identificationNumber ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(identificationNumber, isValid) => {
                      this.updateFormField({ identificationNumber });
                      !isValid
                        ? this.addInvalidField("identificationNumber")
                        : this.removeInvalidField("identificationNumber");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="ID Number"
                    textInputRef={(input) =>
                      (this.identificationNumber = input)
                    }
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.issueDate ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(issueDate, isValid) => {
                      this.updateFormField({ issueDate });
                      !isValid
                        ? this.addInvalidField("issueDate")
                        : this.removeInvalidField("issueDate");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="ID Issue Date"
                    textInputRef={(input) => (this.issueDate = input)}
                    validators={{
                      required: true,
                    }}
                  />

                  <FormInput
                    defaultValue={this.state.form.expiryDate ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    onChangeText={(expiryDate, isValid) => {
                      this.updateFormField({ expiryDate });
                      !isValid
                        ? this.addInvalidField("expiryDate")
                        : this.removeInvalidField("expiryDate");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="ID Expiry Date"
                    textInputRef={(input) => (this.issueDate = input)}
                    validators={{
                      required: true,
                    }}
                  />
                  <FormInput
                    defaultValue={this.state.form.nin ?? ""}
                    disabled={DISABLE_PROFILE_FIELDS}
                    innerContainerStyle={styles.formInputInnerContainerStyle}
                    keyboardType="number-pad"
                    onChangeText={(nin, isValid) => {
                      this.updateFormField({ nin });
                      !isValid
                        ? this.addInvalidField("nin")
                        : this.removeInvalidField("nin");
                    }}
                    outerContainerStyle={styles.formInputOuterContainerStyle}
                    propagateError={this.props.propagateFormErrors}
                    text="NIN"
                    textInputRef={(input) => (this.accountNumber = input)}
                    validators={{
                      // length: 11,
                      // regex: "numeric",
                      required: true,
                    }}
                  />
                </>
              )}
            </View>

            <View style={styles.attachmentContainer}>
              <TouchableOpacity
                style={[
                  styles.touchableDropdown,
                  { borderBottomWidth: !this.state.attachmentToggler ? 2 : 0 },
                ]}
                onPress={() =>
                  this.setState({
                    attachmentToggler: !this.state.attachmentToggler,
                  })
                }
              >
                <Text style={styles.titleText}>Attachments</Text>
                <Icon
                  name={this.state.toggler ? "chevron-up" : "chevron-down"}
                  type="feather"
                  size={24}
                  color="grey"
                  containerStyle={{}}
                />
              </TouchableOpacity>
              {!this.state.attachmentToggler && (
                <>
                  {this.state.form.documents?.map((val, idx) => {
                    const attachment = {
                      ...val,

                      uri: `${DOCUMENT_BASE_URL}/agent-kyc/${val.documentName}`,
                    };

                    console.log(attachment, "map attach");
                    return (
                      <View
                        style={styles.attachmentInnerContainer}
                        key={val.documentId}
                      >
                        <ClickableListItem
                          key={attachment.documentId}
                          onPress={() =>
                            this.props.navigation.navigate("ImageViewer", {
                              image: {
                                title: attachment.documentType,
                                url: attachment.uri,
                              },
                            })
                          }
                        >
                          <View style={styles.attachmentInnerContainerView}>
                            <View style={styles.fileDocumentTypeContainer}>
                              <Text style={styles.fileTypeText}>
                                {val.documentExtention ?? "file"}
                              </Text>
                            </View>
                            <Image
                              source={fileSymbol}
                              resizeMode="contain"
                              style={{ width: 30, height: 30 }}
                            />

                            {/* <Icon type="feather" name="file" size={40} color="#D0D5DD" /> */}
                            <Text style={styles.documentTypeText}>
                              {val.documentType}
                            </Text>
                          </View>
                        </ClickableListItem>
                        <TouchableOpacity
                          onPress={() =>
                            this.downloadFile(attachment.uri, val.documentName)
                          }
                        >
                          <Image
                            source={cloudDownload}
                            resizeMode="contain"
                            style={{ width: 20, height: 20 }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          </View>
        </ScrollView>

        {/* <View style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20
      }}>
        <Button 
          transparent
          buttonStyle={{ paddingHorizontal: 40 }} 
          onPressOut={() => this.props.navigation.goBack()}
          title="Cancel"
          titleStyle={{ color: COLOUR_GREY }}
        />
        <Button 
          buttonStyle={{ paddingHorizontal: 40 }} 
          title="Save" 
        />
      </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },

  contentView: { width: "98%", alignSelf: "center" },
  innerContainerView: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#F3F3F4",
    borderRadius: 10,
  },
  touchableDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#F3F3F4",
    padding: 5,
  },
  titleText: {
    color: COLOUR_BLACK,
    fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
    fontSize: 17,
    paddingBottom: 10,
  },

  attachmentContainer: {
    borderWidth: 2,
    padding: 10,
    borderColor: "#F3F3F4",
    borderRadius: 10,
    marginTop: 20,
  },
  attachmentInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderColor: "#F3F3F4",
    padding: 5,
    marginTop: 10,
  },
  fileTypeText: { fontSize: 5, color: "white", fontWeight: "200" },
  documentTypeText: {
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "400",
    lineHeight: 24,
    fontSize: 16,
    left: 5,
    color: COLOUR_BLACK,
  },
  fileDocumentTypeContainer: {
    backgroundColor: "#DD2025",
    position: "absolute",
    top: 5,
    zIndex: 1,
    left: 0,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  attachmentInnerContainerView: { flexDirection: "row", alignItems: "center" },
});
