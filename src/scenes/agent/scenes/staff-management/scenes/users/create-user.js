import React from 'react';
import {ScrollView, ToastAndroid, View} from 'react-native';
import {connect} from 'react-redux';

import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import {ERROR_STATUS, SUCCESS_STATUS} from '../../../../../../constants/api';
import {ACTIVE_STATUS_ID} from '../../../../../../constants/statuses';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';
import UserManagement from '../../../../../../services/api/resources/user-management';
import {doRefreshViewUsers} from '../../../../../../services/redux/actions/users-scene';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import {formatPhoneNumber} from '../../../../../../utils/formatters';
import UserForm from './forms/user';

class CreateUserScene extends React.Component {
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
    const formIsComplete =
      this.form.state.isComplete &&
      Object.values(this.form.state.form.role).length > 0;
    const formIsValid = this.form.state.isValid;

    console.log(formIsComplete, formIsValid);

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
    const isFormValid = this.checkFormValidity();

    if (!isFormValid) {
      return;
    }

    const {firstName, lastName, email, phone, role, countryShortCode} =
      this.form.state.form;

    this.setState({
      isLoadingSubmit: true,
    });

    const saveUserResponse = await this.platform.createUser({
      firstName,
      lastName,
      email,
      mobileNo: formatPhoneNumber(countryShortCode, phone),
      roleName: role.name,
      status: ACTIVE_STATUS_ID,
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
      this.props.doRefreshViewUsers();
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
          title={`New User`}
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
            role={null}
            roles={this.state.roles}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            email={this.state.email}
            phone={this.state.mobileNo}
            onSelect={this.onSelect}
            ref={form => (this.form = form)}
            propagateFormErrors={this.state.propagateFormErrors}
          />
          <Button
            containerStyle={{
              alignSelf: 'center',
              marginTop: 20,
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

function mapDispatchToProps(dispatch) {
  return {
    doRefreshViewUsers: () => dispatch(doRefreshViewUsers()),
  };
}

export default connect(null, mapDispatchToProps)(CreateUserScene);
