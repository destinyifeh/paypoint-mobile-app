import React from 'react';

export default class BaseForm extends React.Component {
  addInvalidField(fieldName) {
    const newInvalidFields = [
      ...this.state.invalidFields,
      fieldName
    ];

    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0
    });
  }

  clear() {
    this.setState({
      form: {},
      invalidFields: [],
    });
  }

  removeInvalidField(fieldName) {
    const newInvalidFields = this.state.invalidFields.filter(value => value !== fieldName);

    this.setState({
      invalidFields: newInvalidFields,
      isValid: newInvalidFields.length === 0
    });
  }

  resetFormField() {
    const newForm = this.state.form;
    const ignore = ["paymentItemCode", "serviceName", "amount"]
    Object.keys(newForm).map(key=>{
      if (!ignore.includes(key)) {
        newForm[key]="";
      }
    })
    this.setState({form: newForm, isComplete: false});
  }
  
  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params
    };

    const isComplete = this.requiredFields?.find(
      fieldName => newForm[fieldName] === null || newForm[fieldName] === undefined
    ) === undefined;

    this.setState({
      form: newForm,
      isComplete,
    });
  }

  render() {
    return <React.Fragment />
  }

}
