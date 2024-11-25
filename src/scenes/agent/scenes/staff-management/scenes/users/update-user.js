import React from 'react';
import {ScrollView, ToastAndroid, View} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';
import UserManagement from '../../../../../../services/api/resources/user-management';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import UserForm from './forms/user';

export default class UpdateUserScene extends React.Component {
  platform = new Platform();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    const item = this.props.route.params.item;

    console.log(item);

    this.state = {
      isLoading: true,
      roles: [],
      user: {},
      ...item,
    };

    this.loadLookups = this.loadLookups.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.loadLookups().then(this.loadData());
  }

  checkFormValidity() {
    const formIsComplete = this.form.state.isComplete;
    const formIsValid = this.form.state.isValid;

    if (!(formIsComplete && formIsValid)) {
      this.setState({
        isLoading: false,
        propagateFormErrors: true,
      });

      return;
    }

    return true;
  }

  async loadData() {
    const {status, response, code} = await this.platform.retrieveUserByEmail(
      this.state.email,
    );
    if (status === SUCCESS_STATUS) {
      console.log('RETRIEVE USER', response);

      this.setState({
        isLoading: false,
        user: response,
      });

      return;
    }

    this.setState({
      isLoading: false,
    });
  }

  async loadLookups() {
    this.setState({
      isLoading: true,
    });

    const {status, response, code} = await this.platform.retrieveRoles();

    if (status === ERROR_STATUS) {
      ToastAndroid.show(await handleErrorResponse(response), ToastAndroid.LONG);

      return;
    }

    this.setState({
      roles: response,
    });

    return;
  }

  async onSubmit() {
    const {form} = this.form.state;

    this.setState({
      isLoadingSubmit: true,
    });

    const saveUserResponse = await this.platform.editUserRole({
      username: form.email,
      roleName: form.role.name,
    });

    const saveUserResponseStatus = saveUserResponse.status;
    const saveUserResponseObj = saveUserResponse.response;

    if (saveUserResponseStatus === ERROR_STATUS) {
      ToastAndroid.show(
        await handleErrorResponse(saveUserResponseObj),
        ToastAndroid.LONG,
      );

      this.setState({
        isLoadingSubmit: false,
      });

      return;
    }

    this.setState({
      isLoadingSubmit: false,
      updateUserSuccessful: true,
    });
  }

  render() {
    if (this.state.updateUserSuccessful) {
      this.props.navigation.navigate('ViewUsers');
      return <React.Fragment />;
    }

    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }

    console.log('USER >>> ', this.state.user);

    return (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          flex: 1,
        }}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigation={this.props.navigation}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={`${this.state.firstName} ${this.state.lastName}`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          withNavigateBackIcon
        />

        <ScrollView
          contentContainerStyle={{
            padding: 20,
          }}>
          <UserForm
            roles={this.state.roles}
            firstName={this.state.firstName}
            isFirstNameDisabled={true}
            lastName={this.state.lastName}
            isLastNameDisabled={true}
            email={this.state.email}
            isEmailDisabled={true}
            phone={this.state.mobileNo}
            isPhoneDisabled={true}
            onDeselect={this.onDeselect}
            onSelect={this.onSelect}
            permissions={this.state.permissions}
            role={this.state.user.roleName}
            ref={form => (this.form = form)}
          />
          <Button
            containerStyle={{
              alignSelf: 'center',
              marginBottom: 10,
              width: '100%',
            }}
            loading={this.state.isLoadingSubmit}
            title="SUBMIT"
            onPressOut={this.onSubmit}
          />
        </ScrollView>
      </View>
    );
  }
}
