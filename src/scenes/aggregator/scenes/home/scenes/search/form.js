import React from 'react';
import { StyleSheet } from 'react-native';

import FormInput from '../../../../../../components/form-controls/form-input';
import {
  MIN_NAME_LENGTH
} from '../../../../../../constants/fields';
import BaseForm from '../../../../../../components/base-form';

export default class SearchForm extends BaseForm {

  requiredFields = ['applicantName'];

  state = {
    form: {

    },
    invalidFields: [],
  };

  render() {
    return <React.Fragment>
      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.applicantName}
        hideOptionalLabel={true}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(applicantName, isValid) => {
          this.updateFormField({ applicantName });
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
    </React.Fragment>
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    padding: 10,
  },
})
