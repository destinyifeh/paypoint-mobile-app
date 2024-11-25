import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

import Header from '../../../../../../components/header';
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_TITLE,
} from '../../../../../../constants/styles';
import SearchForm from './form';
import Hyperlink from '../../../../../../components/hyperlink';
import FormInput from '../../../../../../components/form-controls/form-input';
import { MIN_NAME_LENGTH } from '../../../../../../constants/fields';
import BaseForm from '../../../../../../components/base-form';


export default class SearchScene extends BaseForm {
  state = {
    form: {

    }
  };

  constructor() {
    super();

    this.checkFormValidity = this.checkFormValidity.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    console.log(formIsComplete, formIsValid);

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return
    }
    
    return true;
  }

  doSearch() {
    this.setState({
      errorMessage: null,
      isLoading: true,
    });

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return
    }
  }

  get searchButton() {
    return <Hyperlink
      onPress={this.doSearch}
    >
      Search
    </Hyperlink>
  }

  render() {
    return (
      <View 
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1
        }}
      >
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE
          }}
          leftComponent={<Icon
            color={COLOUR_WHITE}
            name="chevron-left"
            onPress={() => this.props.navigation.goBack()}
            size={40}
            type="material"
            underlayColor="transparent"
          />}
          navigationIconColor={COLOUR_WHITE}
          rightComponent={this.searchButton}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT
          }}
          title="Search Applications"
          titleStyle={{
            color: COLOUR_WHITE,
            fontSize: FONT_SIZE_TITLE,
            fontWeight: 'bold',
          }}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          withNavigator={this.props.withNavigator}
        />

        <FormInput
          autoCompleteType='name'
          defaultValue={this.state.form.applicantName}
          hideOptionalLabel={true}
          innerContainerStyle={styles.formInputInnerContainerStyle}
          onChangeText={(applicantName, isValid) => {
            this.updateFormField({applicantName});
            !isValid ? this.addInvalidField('applicantName') : this.removeInvalidField('applicantName');
          }}
          outerContainerStyle={styles.formInputOuterContainerStyle}
          placeholder='John Alabi'
          propagateError={this.props.propagateFormErrors}
          text="Applicant Name:"
          textInputRef={(input) => this.firstName = input}
          validators={{
            minLength: MIN_NAME_LENGTH,
            regex: 'name',
            required: true,
          }}
        />
      </View>
    )
  }
}
