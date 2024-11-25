import React from 'react';
import BaseForm from '../../../../../../../components/base-form';
import FormInput from '../../../../../../../components/form-controls/form-input';
import FormMultiSelect from '../../../../../../../components/form-controls/form-multi-select';
import { 
  MIN_NAME_LENGTH
} from '../../../../../../../constants/fields';
import styles from './styles';

export default class RoleForm extends BaseForm {
  requiredFields = [
    'name',
    'permissions'
  ];

  constructor(props) {
    super(props);

    this.state = {
      form: {
        addedPermissions: [],
        deletedPermissions: [],
        initialName: props.name,
        name: props.name || null,
        permissions: props.permissions || [],
        initialPermissions: props.permissions
      },
      invalidFields: []
    };

    this.onDeselect = this.onDeselect.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }
  
  onDeselect(permission) {
    const permissionObj = this.props.allPermissions.find(
      value => value.id === permission
    );

    let permissions = this.state.form.permissions.filter(
      value => value.id !== permissionObj.id
    );

    this.setState({
      form: {
        ...this.state.form, 
        permissions
      }
    })
  }

  onSelect(permission) {
    const permissionObj = this.props.allPermissions.find(
      value => value.id === permission
    );

    this.setState({
      form: {
        ...this.state.form,   
        permissions: [
          ...this.state.form.permissions,
          permissionObj
        ]
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
    return <React.Fragment>
      <FormInput
        autoCompleteType='name'
        defaultValue={this.state.form.name}
        disabled={this.props.disableNameInput}
        editable={!this.props.disableNameInput}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onChangeText={(name, isValid) => {
          this.updateFormField({name});
          !isValid ? this.addInvalidField('name') : this.removeInvalidField('name');
        }}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        placeholder='Name'
        propagateError={this.props.propagateFormErrors}
        text="Name:"
        textInputRef={(input) => this.name = input}
        validators={{
          minLength: MIN_NAME_LENGTH,
          regex: 'name',
          required: true,
        }}
      />

      <FormMultiSelect
        choices={this.props.allPermissions.map(({id, name}) => ({
          label: name,
          value: id
        }))}
        defaultValue={this.state.form.relationship}
        innerContainerStyle={styles.formInputInnerContainerStyle}
        onDeselect={this.onDeselect}
        onSelect={this.onSelect}
        outerContainerStyle={styles.formInputOuterContainerStyle}
        propagateError={this.props.propagateFormErrors}
        selected={this.state.form.permissions}
        text="Permissions:"
        validators={{
          minLength: 1,
          required: true
        }} 
      />

    </React.Fragment>
  }
}
