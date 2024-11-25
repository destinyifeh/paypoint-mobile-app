import React from 'react';
import { View, FlatList } from 'react-native';

import { Icon } from 'react-native-elements';

import { COLOUR_WHITE, COLOUR_BLUE, COLOUR_RED, CONTENT_LIGHT, FONT_SIZE_TITLE } from '../../../../constants/styles';
import Header from '../../../../components/header';
import { onboardingService } from '../../../../setup/api';
import ActivityIndicator from '../../../../components/activity-indicator';
import ApplicationSerializer from '../../../../utils/serializers/application';
import { flashMessage } from '../../../../utils/dialog';
import { ERROR_STATUS } from '../../../../constants/api';
import handleErrorResponse from '../../../../utils/error-handlers/api';
import ApplicationStrip from '../../components/application-row';
import Button from '../../../../components/button';
import Text from '../../../../components/text';


export default class AllApplicationsScene extends React.Component {
  state = {
    animationsDone: true,
    isLoading: false,
    results: [],
  }

  constructor(props) {
    super(props);

    this.errorFallbackMessage = this.errorFallbackMessage.bind(this);
    this.fetchApplications = this.fetchApplications.bind(this);
    this.onboardingScreenContent = this.onboardingScreenContent.bind(this);
  }

  componentDidMount() {
    this.fetchApplications();
  }

  errorFallbackMessage() {
    const { errorMessage } = this.state;

    return (
      <View
        style={{alignItems: 'center', flex: .3, justifyContent: 'center', padding: 16}}
      >
        <Text big center>{errorMessage}</Text>
        <Button 
          containerStyle={{
            marginTop: 8
          }}
          onPress={this.fetchApplications} 
          transparent
          title="RETRY"
          titleStyle={{
            color: COLOUR_BLUE
          }}
        />
      </View>
    );
  }

  async fetchApplications() {
    this.setState({
      didErrorOccur: false,
      errorMessage: null,
      isLoading: true,
    });

    const { status, response } = await onboardingService.getMyApplications();

    this.setState({
      isLoading: false
    })

    if (status === ERROR_STATUS) {
      this.setState({
        didErrorOccur: true,
        errorMessage: await handleErrorResponse(response),
      })

      return
    }
    
    this.setState({
      results: [
        ...this.state.results,
        ...response
      ]
    });
  }

  loadingIndicator() {
    return <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={COLOUR_BLUE} />
    </View>
  }

  onboardingScreenContent() {
    return (
      <FlatList 
        data={this.state.results}
        renderItem={({item}) => {
          const serializedApplication = new ApplicationSerializer(item);

          return <ApplicationStrip 
            application={serializedApplication}
            firstName={serializedApplication.applicantDetails.firstName} 
            lastName={serializedApplication.applicantDetails.surname} 
            id={serializedApplication.applicationId} 
            onPressOut={() => {
              this.setState({
                isLoading: true
              });

              onboardingService.getApplicationById(
                serializedApplication.applicationId,
              ).then(
                ({response, status}) => {
                  this.setState({
                    isLoading: false
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
        }}
      />
    )
  }

  render() {
    let content = !this.state.animationsDone || this.state.isLoading 
      ? this.loadingIndicator
      : this.onboardingScreenContent;

    if (this.state.didErrorOccur) {
      content = this.errorFallbackMessage;
    }

    return <View 
      style={{
        backgroundColor: COLOUR_WHITE,
        flex: 1
      }}
    >
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        leftComponent={<Icon 
          color={COLOUR_WHITE}
          underlayColor="transparent"
          name="chevron-left"
          size={40}
          type="material"
          onPress={() => this.props.navigation.goBack()}
        />}
        navigationIconColor={COLOUR_WHITE}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="All Applications"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
          fontSize: FONT_SIZE_TITLE
        }}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        withNavigator={this.props.withNavigator}
      />

      {content()}
    </View>
  }
}
