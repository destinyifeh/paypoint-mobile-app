import React from 'react';

import { View, ScrollView } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Text from '../components/text';
import { APP_NAME } from '../constants';
import { COLOUR_LIGHT_GREY } from '../constants/styles';
import { Icon } from 'react-native-elements';
import ClickableListItem from '../components/clickable-list-item';
import ActivityIndicator from '../components/activity-indicator';


const AGENT_DOMAIN_TYPE_ID = 4;
const SERVICE_PROVIDER_TYPE_ID = 2;

const DOMAIN_TYPES = [
  null,
  'Platform Provider',
  'Service Provider',
  'Aggregator',
  'Agent',
  'Applicant',
];


export class RoleSerializer {
  constructor(props) {
    this.props = props;
  }

  get agentDescription() {
    return 'Sell airtime, send money, pay bills, check reports and other Quickteller Paypoint agent duties.';
  }

  get agentFriendlyRoleName() {
    return 'AGENT';
  }


  get fipDescription() {
    return 'Onboard agents to the Quickteller Paypoint platform, monitor and support onboarded agents and other Quickteller Paypoint FIP duties';
  }

  get fipFriendlyRoleName() {
    return 'FIP';
  }


  get description() {
    if (!this.isAgent && !this.isFip) {
      return `Perform ${this.friendlyRoleName} duties on the ${APP_NAME} platform.`;
    }

    return this.isAgent ? this.agentDescription : this.fipDescription;
  }

  get domainTypeName() {
    return DOMAIN_TYPES[this.props.domainTypeId];
  }

  get friendlyRoleName() {
    if (!this.isAgent && !this.isFip) {
      return this.domainTypeName;
    }

    return this.isAgent ? this.agentFriendlyRoleName : this.fipFriendlyRoleName;
  }


  get isAgent() {
    return this.props.domainTypeId === AGENT_DOMAIN_TYPE_ID;
  }
  
  get isFip() {
    return this.props.domainTypeId === SERVICE_PROVIDER_TYPE_ID && ['FIP', 'FIPS'].includes(this.props.roleName);
  }

  get data() {
    return {
      description: this.description,
      domainTypeName: this.domainTypeName,
      friendlyRoleName: this.friendlyRoleName,
      ...this.props
    };
  }
}


export default class SelectRoleMenu extends React.Component {
  state = {
    selectedOption: null
  }

  render() {
    const { isLoading, onSelect, ref_, roles } = this.props;

    return (
      <RBSheet
        animationType="fade"
        closeOnDragDown={true}
        duration={250}
        height={380}
        onClose={this.onCancelConfirmation}
        ref={ref_}
      >
        <View
          style={{
            alignContent: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingVertical: 10,
          }}
        >
          <Text bold>
            Select a Role
          </Text>
        </View>
        
        {isLoading 
          ? <ActivityIndicator /> 
          : <ScrollView>
            {roles?.map(value => {
              const serializer = new RoleSerializer(value);
              const { description, domainName, domainTypeId, friendlyRoleName } = serializer.data;
              return (
                <ClickableListItem
                  onPress={() => {
                    onSelect(domainTypeId)
                  }}
                  style={{
                    alignItems: 'center',
                    borderBottomColor: COLOUR_LIGHT_GREY,
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    minHeight: 120,
                    padding: 20
                  }}
                >
                  <View style={{flexDirection: 'column', justifyContent: 'space-evenly', width: '85%'}}>
                    <Text big lightBlue semiBold style={{letterSpacing: 1.7, textTransform: 'uppercase'}}>
                      {friendlyRoleName}
                    </Text>
                    {domainName !== friendlyRoleName && <Text bold mid>
                      {domainName}
                    </Text>}
                    {Boolean(description) && <Text grey small style={{width: '100%'}}>{description}</Text>}
                  </View>
 
                  <Icon 
                    name="chevron-right"
                    type="feather"
                  />
                </ClickableListItem>
              );
            })}
          </ScrollView>
        }
      </RBSheet>
    );
  }
}
