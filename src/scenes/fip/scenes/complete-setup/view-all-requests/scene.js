import React from 'react'
import { 
  FlatList,
  View 
} from 'react-native'
import { 
  Icon
} from 'react-native-elements'
import ClickableListItem from '../../../../../components/clickable-list-item'
import Header from '../../../../../components/header'
import { 
  COLOUR_BLUE,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_GREY
} from '../../../../../constants/styles'
import FormInput from '../../../../../components/form-controls/form-input'
import Text from '../../../../../components/text';
import ApplicationSerializer from '../../../../../utils/serializers/application'
import Onboarding from '../../../../../services/api/resources/onboarding'
import ActivityIndicator from '../../../../../components/activity-indicator'
import { ERROR_STATUS, DEFAULT_API_ERROR_MESSAGE } from '../../../../../constants/api'
import { flashMessage } from '../../../../../utils/dialog'
import { BLOCKER } from '../../../../../constants/dialog-priorities'


class RequestRow extends React.Component {

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

export default class ViewAllRequestsScene extends React.Component {
  onboarding = new Onboarding();
  state = {
    draftApplications: [],
    pageNo: 1,
  }

  constructor() {
    super();

    this.loadNextPage = this.loadNextPage.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  isCloseToBottom ({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  
  async fetchData() {
    this.setState({
      isLoading: true,
    });

    const { response, status } = await this.onboarding.searchApplications({
      applicationType: 0,
      pageNum: this.state.pageNo
    });

    this.setState({
      isLoading: false,
    });

    if (status === ERROR_STATUS) {
      return
    }

    console.log('ABOUT TO SLICE', response);

    this.setState({
      draftApplications: [
        ...this.state.draftApplications,
        ...response.content
      ]
    });
  }

  loadNextPage() {
    this.setState({
      pageNo: this.state.pageNo + 1
    })

    setTimeout(() => this.fetchData(), 0);
  }

  render() {
    return <View
      onTouchEnd={() => this.props.isNavigatorVisible ? this.props.hideNavigator() : null}
      style={{
        backgroundColor: COLOUR_SCENE_BACKGROUND,
        flex: 1
      }}>
      
      <Header 
        navigationIconColor={COLOUR_WHITE}
        containerStyle={{
          backgroundColor: COLOUR_BLUE
        }}
        hideNavigationMenu={this.props.hideNavigator}
        showNavigationMenu={this.props.showNavigator}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT
        }}
        title="Complete Setup"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold'
        }}
        withNavigator />
        
      <View style={{
        backgroundColor: COLOUR_OFF_WHITE, 
        justifyContent: 'space-between'
      }}>
        {/* <FormInput
          innerContainerStyle={{
            backgroundColor: COLOUR_WHITE,
            borderColor: COLOUR_WHITE,
            height: 50,
            marginTop: 5
          }}
          leftIcon='search'
          leftIconColor={COLOUR_BLUE}
          leftIconSize={32}
          onChangeText={(value) => this.setState({username: value})}
          outerContainerStyle={{
            alignSelf: 'center',
            height: 60,
            marginBottom: 10,
            width: '85%'
          }}
          placeholder='Enter Agent Number'
        />
        <Text style={{margin: 10}}>Recent Requests</Text> */}
        
        <FlatList
          keyExtractor={(item, index) => item + index}
          onScroll={({nativeEvent}) => {
            if (this.isCloseToBottom(nativeEvent)) {
              this.loadNextPage();
            }
          }}
          renderItem={({item, index, section}) => {
            const serializedApplication = new ApplicationSerializer(item);

            console.log('SERIALIZED', serializedApplication)

            return <RequestRow 
              application={serializedApplication}
              firstName={serializedApplication.firstName} 
              lastName={serializedApplication.surname} 
              id={serializedApplication.applicationId} 
              onPressOut={() => {
                flashMessage(
                  null,
                  'Loading... please wait.'
                );

                this.onboarding.getApplicationById(serializedApplication.applicationId).then(
                  ({response, status}) => {
                    if (status === ERROR_STATUS) {
                      flashMessage(
                        null,
                        DEFAULT_API_ERROR_MESSAGE,
                        BLOCKER
                      );

                      return
                    }
                
                    flashMessage(
                      null,
                      'Done!'
                    );
    
                    this.props.updateApplication(new ApplicationSerializer(response));
                    this.props.navigation.navigate('Application');
                  }
                )
              }} 
            />
          }}
          scrollEventThrottle={400}
          data={this.state.draftApplications}
        />
        
        <View
          style={{
            marginVertical: 20
          }}
        >
          <ActivityIndicator />
        </View>
        {/* {this.state.draftApplications.map(
          value => {
            const serializedApplication = new ApplicationSerializer(value);
            return <RequestRow 
              application={serializedApplication}
              firstName={serializedApplication.applicantDetails ? serializedApplication.applicantDetails.firstName : ''} 
              lastName={serializedApplication.applicantDetails ? serializedApplication.applicantDetails.surname : ''} 
              id={serializedApplication.applicationId} 
              onPressOut={() => {
                if (serializedApplication.applicationType === 'DRAFT') {
                  this.props.updateApplication(serializedApplication);
                  this.props.navigation.navigate('Application');
                  return
                }

                this.props.navigation.navigate('RequestConfirmation');
              }} 
            />
          }
        )} */}
      </View>
    </View>
  }
}
