import React from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import ActivityIndicator from "../components/activity-indicator";
import { COLOUR_BLACK, COLOUR_BLUE, COLOUR_GREY, COLOUR_LINK_BLUE, FONT_FAMILY_BODY_SEMIBOLD, FONT_SIZE_TITLE } from "../constants/styles";
import Text from "../components/text";
import ProgressiveImage from "../components/progressive-image";

const DOCUMENT_EXTENSION = ["pdf"];

export default class CacRegFilePreview extends React.Component {
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
        <>
          <Text
            style={{
              color: COLOUR_BLACK,
              fontFamily: FONT_FAMILY_BODY_SEMIBOLD,
              fontSize: FONT_SIZE_TITLE,
            }}
          >
            Upload {this.props.name} 
          </Text>
          <View
            style={{
              height: 132,
              width: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "#F3F5F6",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Icon color={COLOUR_BLUE} name="upload" size={16} type="feather" />
            {/* <Text bold>Tap here to upload your nin picture</Text> */}
            <View style={{ marginLeft: 10 }}>
              {/* <Text title>{this.props.name}</Text> */}
              {!this.state.isUploadOngoing &&
                this.state.fieldIsValid === false &&
                this.props.validators.required && (
                  <Text small red>
                    File is required
                  </Text>
                )}
            </View>
  
            {this.state.isUploadOngoing && <ActivityIndicator />}
            <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text bold>Tap here to upload your picture</Text>
              <Text>JPG or PNG. File size, no more than 1MB</Text>
            </View>
          </View>
        </>
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
      }
  
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