import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";

import {
  COLOUR_BLACK,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
} from "../constants/styles";
import ActivityIndicator from "./activity-indicator";
import ProgressiveImage from "./progressive-image";
import Text from "./text";

const DOCUMENT_EXTENSION = ["pdf"];

export default class FilePreviewSelfOnboarding extends React.Component {
  state = {
    didUploadFail: false,
    fieldIsValid: null,
    isUploadOngoing: null,
    uploaded: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    // if (nextState.isUploadOngoing) {
    // console.log(nextState)
    // }

    if (nextProps.defaultValue !== this.props.defaultValue) {
      const fieldIsValid = this.checkInputValidity(nextProps.defaultValue);
      this.onChangeText(nextProps.defaultValue);
      this.props.onChangeText(nextProps.defaultValue, fieldIsValid);
    }

    const validators = this.props.validators || {};

    if (
      nextProps.propagateError !== this.props.propagateError &&
      validators.required
    ) {
      this.props.attachment === undefined &&
        this.setState({
          errorMessage: "Field is required",
          fieldIsValid: false,
        });

      return true;
    }

    if (nextProps.attachment !== this.props.attachment && validators.required) {
      // console.log('THIS ATTACHMENT >>> ', nextProps.attachment)
      !nextProps.attachment &&
        this.setState({
          errorMessage: "Field is required",
          fieldIsValid: false,
        });

      return true;
    }

    return true;
  }

  get placeholder() {
    // this is the default view, before any file is attached at all
    return (
      <View
        style={{
          // alignItems: "center",
          // flexDirection: "row",
          // justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Text
          bold
          mid
          style={{
            color: COLOUR_BLACK,
            marginBottom: 10,
          }}
        >
          {this.props.name == "Government Issued ID" ||
          this.props.name == "Passport" ||
          this.props.name == "Drivers License" ||
          this.props.name == "International Passport" ||
          this.props.name == "Voter's Card" ||
          this.props.name == "National Identification Number"
            ? "Upload ID"
            : "Upload Passport Photograph"}
        </Text>
        {this.props.name == "Government Issued ID" ||
        this.props.name == "Passport" ||
        this.props.name == "Drivers License" ||
        this.props.name == "International Passport" ||
        this.props.name == "Voter's Card" ||
        this.props.name == "National Identification Number" ? (
          <View
            style={{
              alignItems: "center",
              // flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
              backgroundColor: COLOUR_LIGHT_GREY,
              borderWidth: 1,
              borderColor: COLOUR_GREY,
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <Text
              big
              style={{
                color: COLOUR_BLACK,
                marginBottom: 10,
              }}
            >
              Upload a file or drag and drop
            </Text>
            <Text
              big
              style={{
                color: COLOUR_GREY,
                marginBottom: 10,
              }}
            >
              DOCX, DOC, PDF, upto 10MB
            </Text>
            {/* <Icon color={COLOUR_GREY} name="md-photos" size={75} type="ionicon" /> */}
            {/* <Text title>{this.props.name}</Text> */}
          </View>
        ) : (
          <View
            style={{
              alignItems: "center",
              // flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
              backgroundColor: COLOUR_LIGHT_GREY,
              borderWidth: 1,
              borderColor: COLOUR_GREY,
              // borderStyle: "dotted",
              borderStyle: "dashed",
              paddingVertical: 60,
              paddingHorizontal: 20,
              borderRadius: 8,
              width: "100%",
            }}
          >
            <Icon
              color={COLOUR_LINK_BLUE}
              name="md-photos"
              size={75}
              type="ionicon"
            />
            <Text
              big
              style={{
                color: COLOUR_LINK_BLUE,
                fontSize: 25,
                marginBottom: 10,
              }}
            >
              Tap here to upload photo
            </Text>
            {/* <Icon color={COLOUR_GREY} name="md-photos" size={75} type="ionicon" /> */}
            {/* <Text title>{this.props.name}</Text> */}
          </View>
        )}
        <View style={{ marginLeft: 10 }}>
          {!this.state.isUploadOngoing &&
            this.state.fieldIsValid === false &&
            this.props.validators.required && (
              <Text small red>
                File is required
              </Text>
            )}
        </View>

        {this.state.isUploadOngoing && <ActivityIndicator />}
      </View>
    );
  }

  get placeholderAttachment() {
    const { didUploadFail, isUploadOngoing } = this.state;
    const attachment = this.props.attachment;

    const documentExtension = attachment?.documentExtention;
    let fileIsDocument = DOCUMENT_EXTENSION.includes(documentExtension);
    let fileExtension = null;

    if (attachment && attachment.fileName) {
      const fileNameSplitted = attachment.fileName.split(".");
      fileExtension = fileNameSplitted[fileNameSplitted.length - 1];
      fileIsDocument = DOCUMENT_EXTENSION.includes(fileExtension);

      // console.log({fileExtension, fileIsDocument})
    }

    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            width: "60%",
          }}
        >
          {fileIsDocument ? (
            <Icon
              color={COLOUR_GREY}
              name="file-text"
              size={75}
              type="feather"
            />
          ) : (
            <ProgressiveImage
              thumbnailSource={{ uri: this.props.attachment.uri }}
              source={{ uri: this.props.attachment.uri }}
              style={{
                height: 75,
                width: 75,
              }}
              resizeMode="cover"
            />
          )}
          <View>
            <Text title>{this.props.name}</Text>
            {didUploadFail && (
              <Text small red>
                Upload failed
              </Text>
            )}
          </View>
        </View>

        {isUploadOngoing && (
          <ActivityIndicator
            style={{
              width: "10%",
            }}
          />
        )}

        {didUploadFail && (
          <Icon
            color={COLOUR_LINK_BLUE}
            containerStyle={{ marginLeft: 0, width: "10%" }}
            name="redo"
            onPress={() => this.props.retry()}
            type="material"
          />
        )}

        {Boolean(this.props.onRemove) && (
          <Icon
            containerStyle={{ marginLeft: 0, width: "10%" }}
            name="cancel"
            onPress={() => this.props.onRemove()}
            type="material"
          />
        )}
      </View>
    );
  }

  render() {
    const { didUploadFail, isUploadOngoing } = this.state;
    const attachment = this.props.attachment;
    let fileExtension = null;
    let fileIsDocument = null;

    if (attachment && attachment.fileName) {
      const fileNameSplitted = attachment.fileName.split(".");
      fileExtension = fileNameSplitted[fileNameSplitted.length - 1];
      fileIsDocument = DOCUMENT_EXTENSION.includes(fileExtension);

      // console.log({fileExtension, fileIsDocument})
    }

    // console.log({attachment});

    return this.props.placeholder ? (
      this.props.attachment ? (
        this.placeholderAttachment
      ) : (
        this.placeholder
      )
    ) : (
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {fileIsDocument ? (
            <Icon
              color={COLOUR_GREY}
              name="file-text"
              size={75}
              type="feather"
            />
          ) : (
            <ProgressiveImage
              thumbnailSource={{ uri: this.props.attachment.uri }}
              source={{ uri: this.props.attachment.uri }}
              style={{
                height: 75,
                marginRight: 10,
                width: 75,
              }}
              resizeMode="cover"
            />
          )}
          {/* <Image 
          source={{uri: this.props.attachment.uri}} 
          resizeMode="cover" 
          style={{
            height: 75,
            marginRight: 10,
            width: 75,
          }} 
        /> */}
          <View
            style={{
              flexDirection: "column",
              width: "70%",
            }}
          >
            <Text title>{this.props.attachment.fileName}</Text>
            {didUploadFail && <Text red>"Upload Failed"</Text>}
          </View>
        </View>

        {isUploadOngoing && <ActivityIndicator />}

        {didUploadFail && (
          <Icon
            color={COLOUR_LINK_BLUE}
            containerStyle={{ marginLeft: 0, width: "10%" }}
            name="redo"
            onPress={() => this.props.retry()}
            type="material"
          />
        )}

        <Icon
          containerStyle={{
            marginLeft: 0,
          }}
          name="cancel"
          onPress={() => this.props.onRemove()}
          type="material"
        />
      </View>
    );
  }
}
