import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

import { COLOUR_GREY, COLOUR_LINK_BLUE } from '../constants/styles';
import Text from './text';
import ActivityIndicator from './activity-indicator';
import ProgressiveImage from './progressive-image';


const DOCUMENT_EXTENSION = ['pdf'];


export default class FilePreview extends React.Component {
  state = {
    didUploadFail: false,
    fieldIsValid: null,
    isUploadOngoing: null,
    uploaded: false,
  }

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

    if (nextProps.propagateError !== this.props.propagateError && validators.required) {
      this.props.attachment === undefined && this.setState({
        errorMessage: 'Field is required',
        fieldIsValid: false
      })

      return true;
    }

    if (nextProps.attachment !== this.props.attachment && validators.required) {
      // console.log('THIS ATTACHMENT >>> ', nextProps.attachment)
      !nextProps.attachment && this.setState({
        errorMessage: 'Field is required',
        fieldIsValid: false
      })

      return true;
    }

    return true;
  }

  get placeholder() {
    // this is the default view, before any file is attached at all
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 10
          }}
        >
          <Icon
            color={COLOUR_GREY}
            name="md-photos"
            size={75}
            type="ionicon"
          />
          <View style={{marginLeft: 10}}>
            <Text title>{this.props.name}</Text>
            {!this.state.isUploadOngoing && this.state.fieldIsValid === false && this.props.validators.required && <Text small red>File is required</Text>}
          </View>
            
          {this.state.isUploadOngoing && <ActivityIndicator />}
        </View>
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
      const fileNameSplitted = attachment.fileName.split('.');
      fileExtension = fileNameSplitted[fileNameSplitted.length - 1];
      fileIsDocument = DOCUMENT_EXTENSION.includes(fileExtension);

      // console.log({fileExtension, fileIsDocument})
    }

    return <View 
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
      }}>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        width: '60%'
      }}>
        {fileIsDocument ? <Icon 
          color={COLOUR_GREY}
          name="file-text"
          size={75}
          type="feather"
        /> : <ProgressiveImage
          thumbnailSource={{ uri: this.props.attachment.uri }}
          source={{ uri: this.props.attachment.uri }}
          style={{  
            height: 75,
            width: 75
          }}
          resizeMode="cover"
        />}
        <View>
          <Text title>
            {this.props.name}
          </Text>
          {didUploadFail && <Text small red>
            Upload failed
          </Text>}
        </View>
      </View>
      
      {isUploadOngoing && <ActivityIndicator style={{
        width: '10%',
      }} />}

      {didUploadFail && <Icon 
        color={COLOUR_LINK_BLUE}
        containerStyle={{marginLeft: 0, width: '10%'}}
        name='redo'
        onPress={() => this.props.retry()}
        type='material'
      />}

      {Boolean(this.props.onRemove) && <Icon 
        containerStyle={{marginLeft: 0, width: '10%'}}
        name='cancel'
        onPress={() => this.props.onRemove()}
        type='material' />}
    </View>
  }

  render () {
    const { didUploadFail, isUploadOngoing } = this.state;
    const attachment = this.props.attachment;
    let fileExtension = null;
    let fileIsDocument = null;

    if (attachment && attachment.fileName) {
      const fileNameSplitted = attachment.fileName.split('.');
      fileExtension = fileNameSplitted[fileNameSplitted.length - 1];
      fileIsDocument = DOCUMENT_EXTENSION.includes(fileExtension);

      // console.log({fileExtension, fileIsDocument})
    }

    // console.log({attachment});

    return this.props.placeholder ? (
      this.props.attachment ? 
      this.placeholderAttachment : this.placeholder
    ) : <View 
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
      }}>
        {fileIsDocument ? <Icon 
          color={COLOUR_GREY}
          name="file-text"
          size={75}
          type="feather"
        /> : <ProgressiveImage
          thumbnailSource={{ uri: this.props.attachment.uri }}
          source={{ uri: this.props.attachment.uri }}
          style={{  
            height: 75,
            marginRight: 10,
            width: 75
          }}
          resizeMode="cover"
        />}
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
            flexDirection: 'column',
            width: '70%'
          }}
        >
          <Text 
            title
          >
            {this.props.attachment.fileName}
          </Text>
          {didUploadFail && <Text red>"Upload Failed"</Text>}
          
        </View>

      </View>
        
      {isUploadOngoing && <ActivityIndicator />}

      {didUploadFail && <Icon 
        color={COLOUR_LINK_BLUE}
        containerStyle={{marginLeft: 0, width: '10%'}}
        name='redo'
        onPress={() => this.props.retry()}
        type='material'
      />}

      <Icon 
        containerStyle={{
          marginLeft: 0,
        }}
        name='cancel'
        onPress={() => this.props.onRemove()}
        type='material'
      />
    </View>
  }
}
