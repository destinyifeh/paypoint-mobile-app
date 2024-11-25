import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DefaultScene from './scene';
import CreateRole from './scenes/roles/create-role';
import UpdateRole from './scenes/roles/update-role';
import ViewRoles from './scenes/roles/view-roles';
import CreateUser from './scenes/users/create-user';
import UpdateUser from './scenes/users/update-user';
import ViewUsers from './scenes/users/view-users';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="DefaultScene" component={DefaultScene} />
    <Stack.Screen name="CreateRole" component={CreateRole} />
    <Stack.Screen name="CreateUser" component={CreateUser} />
    <Stack.Screen name="UpdateRole" component={UpdateRole} />
    <Stack.Screen name="UpdateUser" component={UpdateUser} />
    <Stack.Screen name="ViewRoles" component={ViewRoles} />
    <Stack.Screen name="ViewUsers" component={ViewUsers} />
  </Stack.Navigator>
);

export default AppNavigator;
