import React from 'react';
import BaseForm from '../../../../../../../components/base-form';
import FormInput from '../../../../../../../components/form-controls/form-input';
import {
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH
} from '../../../../../../../constants/fields';
import styles from './styles';
import FormPicker from '../../../../../../../components/form-controls/form-picker';
import FormPhone from '../../../../../../../components/form-controls/form-phone';
import { NIGERIA_SHORT_CODE } from '../../../../../../../constants';

export default class UserForm extends BaseForm {
  requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'role'
  ];

  constructor(props) {
    super(props);

    this.state = {
      form: {
        countryShortCode: NIGERIA_SHORT_CODE,
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        phone: props.phone,
        role: props.role || {},
        initialName: props.name,
        name: props.name || null,
        roles: props.roles || [],
        initialPermissions: props.roles
      },
      invalidFields: []
    };

    this.onSelectRole = this.onSelectRole.bind(this);
  }

  onSelectRole(role) {
    if (!role) {
      return
    }

    const roleObj = this.props.roles.find(
      value => value.id === role
    );

    console.log('SELECTED', role, roleObj);

    this.setState({
      form: {
        ...this.state.form,   
        role: roleObj
      }
    })
  }

  serializeApiData(nextOfKinDetails) {
    const {
      firstName,
      surname,
      phoneNumber,
      gender,
      relationship,
      address,
    } = nextOfKinDetails;

    return {
      firstName,
      lastName: surname,
      phone: `0${phoneNumber.slice(3)}`,
      gender,
      relationship,
      address
    };
  }

  serializeFormData() {
    const {
      firstName,
      lastName, 
      phone, 
      gender, 
      relationship, 
      address
    } = this.state.form;

    return {
      firstName,
      surname: lastName,
      phoneNumber: `+234${phone}`,
      gender,
      relationship,
      address,
    };
  }

  render() {
    const roleObj = this.props.roles.find(
      value => value.name === this.state.form.role || value.name === this.state.form.role.name
    );

    return <React.Fragment>
      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.firstName}
        disabled={this.props.isFirstNameDisabled}
        editable={!this.props.isFirstNameDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(firstName, isValid) => {
          this.updateFormField({firstName});
          !isValid ? this.addInvalidField('firstName') : this.removeInvalidField('firstName');
        }}
        onSubmitEditing={
          () => this.lastName.focus()
        }
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='First Name'
        propagateError={this.props.propagateFormErrors}
        text="First Name:"
        textInputRef={(input) => this.firstName = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'name',
          required: true,
        }}
      />

      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.lastName}
        disabled={this.props.isLastNameDisabled}
        editable={!this.props.isLastNameDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(lastName, isValid) => {
          this.updateFormField({lastName});
          !isValid ? this.addInvalidField('lastName') : this.removeInvalidField('lastName');
        }}
        onSubmitEditing={
          () => this.email.focus()
        }
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Last Name'
        propagateError={this.props.propagateFormErrors}
        text="Last Name:"
        textInputRef={(input) => this.lastName = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'sentence',
          required: true,
        }}
      />

      <FormInput
        autoCapitalize='none'
        autoCompleteType='email'
        defaultValue={this.state.form.email}
        disabled={this.props.isEmailDisabled}
        editable={!this.props.isEmailDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='email-address'
        leftIcon='mail'
        onChangeText={(email, isValid) => {
          this.updateFormField({email});
          !isValid ? this.addInvalidField('email') : this.removeInvalidField('email');
        }}
        onSubmitEditing={
          () => this.phone.focus()
        }
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='johndoe@example.com'
        propagateError={this.props.propagateFormErrors}
        text="Email:"
        textContentType="emailAddress"
        textInputRef={(input) => this.email = input}
        validators={{
          email: true,
          required: true,
        }}
      />

      <FormPhone
        autoCompleteType='tel'
        defaultValue={this.state.form.phone}
        disabled={this.props.isPhoneDisabled}
        editable={!this.props.isPhoneDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        keyboardType='number-pad'
        leftIcon='phone'
        onChangeText={(phone, isValid) => {
          this.updateFormField({phone});
          !isValid ? this.addInvalidField('phone') : this.removeInvalidField('phone');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='08012345678'
        propagateError={this.props.propagateFormErrors}
        text="Phone number:"
        textInputRef={(input) => this.phone = input}
        validators={{
          length: MIN_NIGERIA_PHONE_LENGTH,
          required: true,
        }}
      />

      <FormPicker
        choices={this.props.roles.map(({id, name}) => ({
          label: name.replace(/_/g, ' '),
          value: id
        }))}
        defaultValue={roleObj ? roleObj.id : null}
        disabled={this.props.isRoleDisabled}
        editable={!this.props.isRoleDisabled}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onSelect={(role, isValid) => {
          this.onSelectRole(role);
          !isValid ? this.addInvalidField('role') : this.removeInvalidField('role');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        selected={this.state.form.role ? this.state.form.role.id : null}
        text="Role:"
        validators={{
          required: true
        }} 
      />

    </React.Fragment>
  }
}
