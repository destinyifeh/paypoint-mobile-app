import React from 'react';
import {ScrollView, ToastAndroid, View} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import Button from '../../../../../../components/button';
import Header from '../../../../../../components/header';
import {ERROR_STATUS} from '../../../../../../constants/api';
import {BLOCKER} from '../../../../../../constants/dialog-priorities';
import {
  COLOUR_BLUE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';
import UserManagement from '../../../../../../services/api/resources/user-management';
import {flashMessage} from '../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';
import RoleForm from './forms/role';

export default class UpdateRoleScene extends React.Component {
  platform = new Platform();
  userManagement = new UserManagement();

  constructor(props) {
    super(props);

    const item = this.props.route.params.item;

    this.state = {
      allPermissions: [],
      isLoading: true,
      permissions: [],
      ...item,
    };

    this.loadData = this.loadData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.loadLookups().then(response => this.loadData());
  }

  async fetchPermissions(pageNum, pageSize) {
    const getPermissionsResponse = await this.userManagement.getPermissions(
      pageNum,
      pageSize,
    );
    const getPermissionsResponseStatus = getPermissionsResponse.status;
    const getPermissionsResponseObj = getPermissionsResponse.response;

    if (getPermissionsResponseStatus === ERROR_STATUS) {
      return {count: 0, content: []};
    }

    return getPermissionsResponseObj;
  }

  async loadLookups() {
    let pageNum = 1;
    const pageSize = 20;

    while (true) {
      const getPermissionsResponse = await this.fetchPermissions(
        pageNum,
        pageSize,
      );

      const newPermissions = [
        ...this.state.allPermissions,
        ...getPermissionsResponse.content,
      ];

      this.setState({
        allPermissions: newPermissions,
      });

      if (newPermissions.length >= getPermissionsResponse.count) {
        this.setState({
          // isLoading: false,
        });
        break;
      }

      pageNum += 1;
    }
  }

  async loadData() {
    const {status, response, code} =
      await this.platform.retrieveRolePermissions(this.state.name);

    console.log('RETRIEVE ROLE PERMISSIONS RESPONSE', status, response, code);

    if (status === ERROR_STATUS) {
      this.setState({
        isLoading: false,
      });

      return;
    }

    this.setState({
      isLoading: false,
      permissions: response,
    });
  }

  onDeselect(permission) {
    this.setState({
      deletedPermissions: [...this.state.deletedPermissions, permission],
    });
  }

  onSelect(permission) {
    this.setState({
      addedPermissions: [...this.state.addedPermissions, permission],
    });
  }

  async onSubmit() {
    const {form} = this.form.state;

    this.setState({
      isLoadingSubmit: true,
    });

    if (form.initialPermissions.length) {
      const removeRolePermissionResponse =
        await this.platform.removeRolePermission(
          form.name,
          form.initialPermissions,
        );
      const removeRolePermissionResponseObj =
        removeRolePermissionResponse.response;
      const removeRolePermissionResponseStatus =
        removeRolePermissionResponse.status;

      if (removeRolePermissionResponseStatus === ERROR_STATUS) {
        this.setState({
          isLoadingSubmit: false,
        });

        ToastAndroid.show(
          await handleErrorResponse(removeRolePermissionResponseObj),
          ToastAndroid.LONG,
        );

        return;
      }
    }

    const saveRolePermissionResponse = await this.platform.createRole({
      name: form.name,
      permissions: form.permissions,
    });

    const saveRolePermissionResponseStatus = saveRolePermissionResponse.status;
    const saveRolePermissionResponseObj = saveRolePermissionResponse.response;

    if (saveRolePermissionResponseStatus === ERROR_STATUS) {
      this.setState({
        isLoadingSubmit: false,
      });

      ToastAndroid.show(
        await handleErrorResponse(saveRolePermissionResponseObj),
        ToastAndroid.LONG,
      );

      return;
    }

    this.setState({
      isLoadingSubmit: false,
      updateRoleSuccessful: true,
    });
  }

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }

    if (this.state.allPermissions.length === 0) {
      flashMessage(null, 'Error fetching permissions', BLOCKER);

      this.props.navigation.goBack();

      return <React.Fragment />;
    }

    if (this.state.updateRoleSuccessful) {
      this.props.navigation.goBack();
    }

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
          title={this.state.name.replace(/_/g, ' ')}
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
          <RoleForm
            allPermissions={this.state.allPermissions}
            disableNameInput={true}
            name={this.state.name.replace(/_/g, ' ')}
            onDeselect={this.onDeselect}
            onSelect={this.onSelect}
            permissions={this.state.permissions}
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
