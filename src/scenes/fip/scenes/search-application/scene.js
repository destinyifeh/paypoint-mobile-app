import React from 'react';
import { ScrollView, View } from 'react-native';

import { Icon } from 'react-native-elements';

import ActivityIndicator from '../../../../components/activity-indicator';
import ClickableListItem from '../../../../components/clickable-list-item';
import FormInput from '../../../../components/form-controls/form-input';
import Header from '../../../../components/header';
import Text from '../../../../components/text';
import { ERROR_STATUS } from '../../../../constants/api';
import { BLOCKER } from '../../../../constants/dialog-priorities';
import { MIN_NAME_LENGTH } from '../../../../constants/fields';
import { COLOUR_BLUE, COLOUR_GREY, COLOUR_OFF_WHITE, COLOUR_SCENE_BACKGROUND, COLOUR_WHITE, CONTENT_LIGHT } from '../../../../constants/styles';
import Onboarding from '../../../../services/api/resources/onboarding';
import { flashMessage } from '../../../../utils/dialog';
import handleErrorResponse from '../../../../utils/error-handlers/api';
import ApplicationSerializer from '../../../../utils/serializers/application';
import { validateEmail, validatePhone } from '../../../../validators/form-validators';


class ApplicationStrip extends React.Component {

  renderSkeleton() {
    return (
      <View
        style={{
          alignItems: 'center',
          borderBottomColor: COLOUR_OFF_WHITE,
          borderBottomWidth: 5,
          flex: 1,
          flexDirection: 'row',
          height: 90,
          padding: 15,
          paddingTop: 5,
          paddingBottom: 10
        }}
      >
        <View 
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_OFF_WHITE,
            borderRadius: 17,
            height: 35,
            justifyContent: 'center',
            width: 35
          }}
        />
      
        <View style={{
          flex: .8,
          height: '100%',
          justifyContent: 'space-evenly',
          marginVertical: 20,
          marginLeft: 20,
        }}>
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
          <View 
            style={{
              backgroundColor: COLOUR_OFF_WHITE,
              height: 17.5,
              width: '100%',
            }}
          />
        </View>

      </View>
    );
  }

  render () {
    const { isLoading } = this.props;

    if (isLoading) {
      return this.renderSkeleton()
    }

    return <ClickableListItem
      onPressOut={this.props.onPressOut}
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        borderBottomColor: COLOUR_OFF_WHITE,
        borderBottomWidth: 5,
        flex: 1,
        flexDirection: 'row',
        height: 90,
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10
      }}
    >
      <View 
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_BLUE,
          borderRadius: 17,
          height: 35,
          justifyContent: 'center',
          width: 35
        }}
      >
        <Text white>{this.props.firstName[0]}{this.props.lastName[0]}</Text>
      </View>
      
      <View style={{
        flex: .5,
        height: '100%',
        justifyContent: 'space-evenly',
        marginVertical: 20,
      }}>
        <Text bold>{this.props.firstName} {this.props.lastName}</Text>
        <Text bold small>Application ID: {this.props.id}</Text>
        <Text 
          isPendingStatus={this.props.isAwaitingValidation || this.props.isAwaitingApproval}
          isStatus
        >
          {this.props.application.cleanApprovalStatus || this.props.application.cleanApplicationType}
        </Text>
      </View>

      <View style={{
        alignItems: 'flex-end',
        flex: .4,
      }}>
        <Icon 
          color={COLOUR_GREY}
          name="chevron-right"
          size={32} />
      </View>
    </ClickableListItem>
  }
}


export default class SearchApplicationScene extends React.Component {
  onboarding = new Onboarding();

  state = {
    isLoading: false,
    searchResults: []
  }

  constructor() {
    super();

    this.doSearch = this.doSearch.bind(this);
  }
 
  async doSearch() {
    const { searchTerm } = this.state;

    this.setState({
      isLoading: true,
    });

    const searchParams = {};

    if (validateEmail(searchTerm)) {
      searchParams.emailAddress = searchTerm;
    }
    else if (validatePhone(searchTerm)) {
      searchParams.phoneNumber = searchTerm;
    }
    else {
      searchParams.applicantName = searchTerm;
    }

    const { response, status } = await this.onboarding.searchApplications(searchParams);

    if (status === ERROR_STATUS) {
      flashMessage(
        null,
        await handleErrorResponse(response),
        BLOCKER
      );

      return
    }

    console.log('>>>>', response)

    this.setState({
      isLoading: false,
      searchResults: response.content,
    })
  }

  render() {
    return (
      <View 
        style={{
          backgroundColor: COLOUR_SCENE_BACKGROUND,
          flex: 1
        }}
      >
        
        <Header 
          containerStyle={{
            backgroundColor: COLOUR_BLUE
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={<Icon 
            color={COLOUR_WHITE}
            name="chevron-left"
            onPress={() => this.props.navigation.goBack()}
            size={40}
            type="material"
            underlayColor="transparent"
          />}
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT
          }}
          title={`Search Applications`}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold'
          }} 
        />

        <View
          style={{
            padding: 15
          }}
        >
          <FormInput
            autoCompleteType='name'
            defaultValue={this.state.searchTerm}
            disabled={this.state.isLoadingApplication}
            focus={true}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            onChangeText={(searchTerm, isValid) => {
              // this.updateFormField({searchTerm});
              this.setState({searchTerm})
              // !isValid ? this.addInvalidField('searchTerm') : this.removeInvalidField('searchTerm');
            }}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            placeholder='Doe'
            propagateError={this.props.propagateFormErrors}
            onSubmitEditing={this.doSearch}
            text="Applicant Name, Email or Phone:"
            textInputRef={(input) => this.lastName = input}
            validators={{
              minLength: MIN_NAME_LENGTH,
              applicationSearchTerm: true,
              required: true,
            }}
          />
        </View>

        {this.state.isLoading || this.state.isLoadingApplication ? <ActivityIndicator /> : 
          <React.Fragment>
            <Text bold style={{
              marginHorizontal: 15,
              marginVertical: 7.5
            }}>Search Results</Text>
            <ScrollView>  
              {this.state.searchResults.map(value => {
                const serializedApplication = new ApplicationSerializer(value);

                return <ApplicationStrip 
                  application={serializedApplication}
                  firstName={serializedApplication.firstName} 
                  lastName={serializedApplication.surname} 
                  id={serializedApplication.applicationId} 
                  onPressOut={() => {
                    this.setState({
                      isLoadingApplication: true
                    })

                    this.onboarding.getApplicationById(
                      serializedApplication.applicationId,
                    ).then(
                      ({response, status}) => {
                        this.setState({
                          isLoadingApplication: false
                        });

                        if (status === ERROR_STATUS) {
                          return
                        }

                        const serializedApplication = new ApplicationSerializer(response);

                        if (serializedApplication.applicationType === 'DRAFT') {
                          this.props.updateApplication(serializedApplication);
                          this.props.navigation.navigate('Application', {byPassRefresh: true});
                          return
                        }

                        this.props.navigation.navigate('RequestConfirmation');

                      }
                    )
                  }} 
                />
              })}
            </ScrollView>
          </React.Fragment>
        }
      </View>
    );
  }
}
