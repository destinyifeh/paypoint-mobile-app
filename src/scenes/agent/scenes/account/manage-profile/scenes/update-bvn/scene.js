import Moment from 'moment';
import React from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  failedAnimation,
  successAnimation,
} from '../../../../../../../animations';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import Button from '../../../../../../../components/button';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import {ConfirmationBottomSheet} from '../../../../../../../components/confirmation';
import FormDate from '../../../../../../../components/form-controls/form-date';
import FormInput from '../../../../../../../components/form-controls/form-input';
import FormPhone from '../../../../../../../components/form-controls/form-phone';
import Header from '../../../../../../../components/header';
import Text from '../../../../../../../components/text';
import {
  AGENT,
  APP_NAME,
  INVALID_FORM_MESSAGE,
} from '../../../../../../../constants';
import {ERROR_STATUS, HTTP_FORBIDDEN} from '../../../../../../../constants/api';
import {BLOCKER} from '../../../../../../../constants/dialog-priorities';
import {
  BVN_LENGTH,
  MIN_NAME_LENGTH,
  MIN_NIGERIA_PHONE_LENGTH,
  PAST_DATE,
} from '../../../../../../../constants/fields';
import {
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../constants/styles';
import BvnAgentSerializer from '../../../../../../../serializers/resources/bvnAgent';
import {platformService} from '../../../../../../../setup/api';
import {computePastDate} from '../../../../../../../utils/calendar';
import {flashMessage} from '../../../../../../../utils/dialog';
import NavigationService from '../../../../../../../utils/navigation-service';
import {loadData} from '../../../../../../../utils/storage';

export default class BVNInformationScene extends React.Component {
  state = {
    expand: null,
    isLoading: false,
    form: {
      dateOfBirth: null,
    },
    confirmationFields: {},
    errorMessage: null,
    showConfirmationTab: false,
    propagateFormErrors: null,
    showAnimation: false,
    validationStatus: null,
    message: null,
  };

  platform = platformService;

  componentDidMount() {
    this.loadData();
  }

  showConfirmationTab() {
    setTimeout(() => this.confirmationBottomSheet.open(), 100);
  }

  closeConfirmationSheet() {
    console.log('cancel');
    this.confirmationBottomSheet?.close();
  }

  failedAnimationView() {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 16,
        }}>
        {animation ? animation({style: {height: 400, width: 400}}) : null}
        <Text bigger bold center>
          {/* Operation failed */}
          {this.state.validationStatus}
        </Text>
        <Text center>{`${this.state.message}\n\n`}</Text>
        <Button
          containerStyle={{
            width: 150,
          }}
          title="LOGOUT"
          onPress={() => NavigationService.replace('Logout')}
        />
      </View>
    );
  }

  successfulAnimationView() {
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 16,
        }}>
        {animation ? animation({style: {height: 400, width: 400}}) : null}
        <Text bigger bold center>
          Operation Successful
        </Text>
        <Text center>{`${this.state.message}\n\n`}</Text>
        {/* <Text center>{`BVN verified successfully\n\n`}</Text> */}

        <View
          style={{
            flexDirection: 'row',
          }}>
          <Button
            containerStyle={{
              width: 110,
              backgroundColor: COLOUR_GREEN,
            }}
            title="HOME"
            onPress={() => {
              // this.props.navigation.reset(
              //   [NavigationActions.navigate({ routeName: "Agent" })],
              //   0
              // );
              this.props.navigation.reset({
                index: 0,
                routes: [{name: 'Agent'}],
              });
            }}
          />
          <Text>&nbsp;</Text>
          <Button
            containerStyle={{
              width: 110,
            }}
            title="LOGOUT"
            onPress={() => NavigationService.replace('Logout')}
          />
        </View>
      </View>
    );
  }
  animationView = () => {
    const isTransactionSuccessful = this.state.isTransactionSuccessful;
    if (isTransactionSuccessful) {
      animation = successAnimation;
      return this.successfulAnimationView();
    } else {
      animation = failedAnimation;
      return this.failedAnimationView();
    }
  };

  showTheAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Home',
          onPress: () =>
            // this.props.navigation.reset(
            //   [NavigationActions.navigate({routeName: 'Agent'})],
            //   0,
            // ),
            this.props.navigation.reset({
              index: 0,
              routes: [{name: 'Agent'}],
            }),
        },
        {
          text: 'Try Again',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Logout',
          onPress: () => NavigationService.replace('Logout'),
        },

        {
          text: 'Try Again',
          onPress: () => {},
          style: 'cancel',
        },
      ],

      {cancelable: false},
    );
  }

  async proceed() {
    this.setState({
      isLoading: true,
    });
    this.closeConfirmationSheet();

    this.proceedResponseObj = await this.platform.updateBvn({
      bvnDateOfBirth: Moment(this.state.form.dateOfBirth, 'DD-MM-YYYY').format(
        'YYYY-MM-DD',
      ),
      bvnFirstName: this.state.form.firstName,
      bvnLastName: this.state.form.lastName,
      bvnNumber: this.state.form.bvn,
      bvnPhoneNumber: `234${this.state.form.businessMobileNo.slice(-10)}`,
      id: this.state.form.agentId,
    });
    console.log(this.proceedResponseObj, 'response');
    if (this.proceedResponseObj.code === HTTP_FORBIDDEN) {
      NavigationService.replace('Logout');
    } else if (this.proceedResponseObj.status === ERROR_STATUS) {
      this.setState({
        isTransactionSuccessful: false,
        isLoading: false,
      });

      this.showAlert(
        'BVN Validation Failed',
        this.proceedResponseObj.response.message,
      );
    } else if (
      this.proceedResponseObj.response.validationStatus !== 'VERIFIED' &&
      this.proceedResponseObj.response.validationStatus !== 'VERIFIED_PARTIALLY'
    ) {
      this.setState({
        isTransactionSuccessful: false,
        isLoading: false,
      });

      this.showAlert(
        'BVN Validation Failed',
        this.proceedResponseObj.response.message,
      );
    } else if (
      this.proceedResponseObj.response.validationStatus === 'VERIFIED_PARTIALLY'
    ) {
      this.setState({
        isTransactionSuccessful: false,
        isLoading: false,
      });

      this.showTheAlert(
        'Your BVN Data Is Partially Verified',
        this.proceedResponseObj.response.message,
      );
    } else {
      this.setState({
        showAnimation: true,
        isTransactionSuccessful: true,
        isLoading: false,
        message: this.proceedResponseObj.response.message,
        validationStatus: this.proceedResponseObj.response.validationStatus,
      });
    }
  }

  async loadData() {
    const agentInformation = JSON.parse(await loadData(AGENT));
    const bvnAgentResponse = await this.platform.getBvn(
      agentInformation?.agentCode,
    );
    console.log(agentInformation, 'agentino');
    const serializedAgentInformation = new BvnAgentSerializer(
      bvnAgentResponse?.response?.data,
    );
    //serializedAgentInformation.
    serializedAgentInformation['phoneNumber'] =
      '0' + serializedAgentInformation.bvnPhoneNumber.slice(-10);
    serializedAgentInformation['dateOfBirth'] = Moment(
      serializedAgentInformation.bvnDateOfBirth,
      'YYYY-MM-DD',
    ).format('DD-MM-YYYY');

    this.setState({
      form: {
        ...this.state.form,
        ...serializedAgentInformation,
      },
    });
  }

  addInvalidField() {}

  removeInvalidField() {}

  serializeApiData(apiData) {
    return {
      ...apiData,
      dateOfBirth: Moment(apiData.dateOfBirth, 'YYYY-MM-DD').format(
        'DD-MM-YYYY',
      ),
      gender: apiData.businessContact.gender,
      motherMaidenName: apiData.businessContact.motherMadienName,
    };
  }

  renderItem(item, index) {
    return (
      <ClickableListItem
        key={index}
        onPressOut={() =>
          this.setState({
            expand: this.state.expand === item.time ? null : item.time,
          })
        }
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          marginBottom: 1,
        }}>
        <View
          style={{flex: 0.8, justifyContent: 'space-evenly', paddingLeft: 20}}>
          <Text black>{item.name}</Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            flex: 0.2,
            justifyContent: 'center',
          }}>
          <Icon
            name="chevron-right"
            color={'#B4B7BF'}
            type="material"
            size={50}
          />
        </View>
      </ClickableListItem>
    );
  }

  renderSectionHeader(item) {
    return (
      <Text style={{lineHeight: 32, marginLeft: 10, marginTop: 30}}>
        {item}
      </Text>
    );
  }

  updateFormField(params) {
    const newForm = {
      ...this.state.form,
      ...params,
    };

    this.setState({
      form: newForm,
    });
  }

  async syncFormData() {
    this.setState({
      confirmationFields: [
        {
          'First Name': this.state.form.firstName,
        },
        {
          'Last Name': this.state.form.lastName,
        },
        {
          'Phone Number': this.state.form.businessMobileNo,
        },
        {
          'Date of Birth': this.state.form.dateOfBirth,
        },
        {
          'Bank Verification Number': this.state.form.bvn,
        },
      ],
    });
  }

  checkFormValidity() {
    if (
      this.state.form.businessMobileNo.length === 11 &&
      this.state.form.bvn.length === BVN_LENGTH &&
      this.state.form.dateOfBirth &&
      this.state.form.firstName.length >= MIN_NAME_LENGTH &&
      this.state.form.lastName.length >= MIN_NAME_LENGTH &&
      this.state.form.bvn &&
      this.state.form.businessMobileNo
    ) {
      return true;
    }
    return false;
  }

  async showPreviewPage() {
    this.syncFormData();

    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      flashMessage(APP_NAME, INVALID_FORM_MESSAGE, BLOCKER);

      return;
    }

    this.showConfirmationTab();
    //setShowConfirmationTab(true);
    return;
  }

  render() {
    return !this.state.showAnimation ? (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
        {
          <ConfirmationBottomSheet
            form={this.state.form}
            category={'BVN Verification'}
            onClose={this.closeConfirmationSheet}
            isLoading={true}
            requestClose={() => this.closeConfirmationSheet()}
            onSubmit={() => this.proceed()}
            sheetRef={sheet => (this.confirmationBottomSheet = sheet)}
            fields={this.state.confirmationFields}
          />
        }
        {this.state.isLoading && (
          <ActivityIndicator
            color={COLOUR_WHITE}
            containerStyle={{
              alignItems: 'center',
              backgroundColor: `${COLOUR_BLUE}AA`,
              height: '100%',
              justifyContent: 'center',
              position: 'absolute',
              width: '100%',
              zIndex: 1,
            }}
          />
        )}
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
              //onPress={() => this.props.navigation.goBack()}
              onPress={() =>
                // this.props.navigation.reset(
                //   [NavigationActions.navigate({routeName: 'Agent'})],
                //   0,
                // )
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'Agent'}],
                })
              }
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="BVN Form"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}>
          <FormInput
            autoCompleteType="name"
            defaultValue={this.state.form.bvnFirstName}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(firstName, isValid) => {
              this.updateFormField({firstName});
              !isValid
                ? this.addInvalidField('firstName')
                : this.removeInvalidField('firstName');
            }}
            onSubmitEditing={() => {
              this.lastName.focus();
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="First name"
            propagateError={this.props.propagateFormErrors}
            text="First Name:"
            textInputRef={input => (this.firstName = input)}
            validators={{
              minLength: MIN_NAME_LENGTH,
              regex: 'name',
              required: true,
            }}
            disabled={
              this.state.form.bvnVerificationStatus === 'VERIFIED_PARTIALLY' ||
              this.state.form.bvnVerificationStatus === 'SUSPENDED' ||
              this.state.form.bvnVerificationStatus === 'NOT_VERIFIED'
                ? false
                : true
            }
          />

          <FormInput
            autoCompleteType="name"
            defaultValue={this.state.form.bvnLastName}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(lastName, isValid) => {
              this.updateFormField({lastName});
              !isValid
                ? this.addInvalidField('lastName')
                : this.removeInvalidField('lastName');
            }}
            onSubmitEditing={() => {
              this.phone.focus();
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="Last name"
            propagateError={this.props.propagateFormErrors}
            text="Last Name:"
            textInputRef={input => (this.lastName = input)}
            validators={{
              minLength: MIN_NAME_LENGTH,
              regex: 'name',
              required: true,
            }}
            disabled={
              this.state.form.bvnVerificationStatus === 'VERIFIED_PARTIALLY' ||
              this.state.form.bvnVerificationStatus === 'SUSPENDED' ||
              this.state.form.bvnVerificationStatus === 'NOT_VERIFIED'
                ? false
                : true
            }
          />

          <FormPhone
            disabled={
              this.state.form.bvnVerificationStatus === 'VERIFIED_PARTIALLY' ||
              this.state.form.bvnVerificationStatus === 'SUSPENDED' ||
              this.state.form.bvnVerificationStatus === 'NOT_VERIFIED'
                ? false
                : true
            }
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType="number-pad"
            defaultValue={this.state.form.phoneNumber}
            onChangeText={(businessMobileNo, isValid) => {
              this.updateFormField({businessMobileNo});
              !isValid
                ? this.addInvalidField('businessMobileNo')
                : this.removeInvalidField('businessMobileNo');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="xxxxxxxxx"
            propagateError={this.props.propagateFormErrors}
            text="Phone:"
            textInputRef={input => (this.phone = input)}
            validators={{
              length: MIN_NIGERIA_PHONE_LENGTH,
              required: true,
            }}
          />

          <FormInput
            disabled={
              this.state.form.bvnVerificationStatus === 'VERIFIED_PARTIALLY' ||
              this.state.form.bvnVerificationStatus === 'SUSPENDED' ||
              this.state.form.bvnVerificationStatus === 'NOT_VERIFIED'
                ? false
                : true
            }
            autoCompleteType="tel"
            innerContainerStyle={styles.formInputInnerContainerStyle}
            keyboardType="number-pad"
            onChangeText={(bvn, isValid) => {
              this.updateFormField({bvn});
              !isValid
                ? this.addInvalidField('bvn')
                : this.removeInvalidField('bvn');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="xxxxxxxxxx"
            propagateError={this.props.propagateFormErrors}
            defaultValue={this.state.form.bvn}
            text="BVN:"
            textInputRef={input => (this.bvn = input)}
            validators={{
              length: BVN_LENGTH,
              required: true,
            }}
          />

          <FormDate
            defaultValue={this.state.form.dateOfBirth}
            disabled={
              this.state.form.bvnVerificationStatus === 'VERIFIED_PARTIALLY' ||
              this.state.form.bvnVerificationStatus === 'SUSPENDED' ||
              this.state.form.bvnVerificationStatus === 'NOT_VERIFIED'
                ? false
                : true
            }
            innerContainerStyle={styles.formInputInnerContainerStyle}
            maxDate={computePastDate(18, 'years')}
            minDate={computePastDate(PAST_DATE)}
            onDateSelect={(dateOfBirth, isValid) => {
              this.updateFormField({dateOfBirth});
              !isValid
                ? this.addInvalidField('dateOfBirth')
                : this.removeInvalidField('dateOfBirth');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder="Pick date"
            propagateError={this.props.propagateFormErrors}
            text="Date of Birth:"
            validators={{
              required: true,
            }}
          />
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 12,
          }}>
          <Button
            containerStyle={{
              width: 150,
            }}
            loading={this.state.isLoading}
            title="SUBMIT"
            onPress={() => this.showPreviewPage()}
          />
        </View>
      </View>
    ) : (
      this.animationView()
    );
  }
}

const styles = StyleSheet.create({
  formInputOuterContainerStyle: {
    marginTop: 20,
  },
});
