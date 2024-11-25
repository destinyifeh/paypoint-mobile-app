import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import {Alert} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import Header from '../../../../../../components/header';
import Skeleton from '../../../../../../components/skeleton';
import Text from '../../../../../../components/text';
import {ERROR_STATUS, HTTP_NOT_FOUND} from '../../../../../../constants/api';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_OFF_WHITE,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import ApplicantOptionsMenu from '../../../../../../fragments/applicant-options-menu';
import {
  hideNavigator,
  showNavigator,
} from '../../../../../../services/redux/actions/navigation';
import {onboardingService} from '../../../../../../setup/api';
import handleErrorResponse from '../../../../../../utils/error-handlers/api';

const APPROVAL_STATUS = {
  1: 'DRAFT',
  2: 'AWAITING_VALIDATION',
  3: 'AWAITING_APPROVAL',
  4: 'APPROVED',
  5: 'REJECTED',
  6: 'CANCELLED',
};

export function ApplicantRow(props) {
  function renderSkeleton() {
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
          paddingBottom: 10,
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: COLOUR_OFF_WHITE,
            borderRadius: 17,
            height: 35,
            justifyContent: 'center',
            width: 35,
          }}
        />

        <View
          style={{
            flex: 0.8,
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

  const {isLoading} = props;

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <ClickableListItem
      onPressOut={props.onPressOut}
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_WHITE,
        borderBottomColor: COLOUR_OFF_WHITE,
        borderBottomWidth: 5,
        flex: 1,
        flexDirection: 'row',
        height: 80,
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10,
      }}>
      <View
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_BLUE,
          borderRadius: 17,
          height: 35,
          justifyContent: 'center',
          width: 35,
        }}></View>

      <View
        style={{
          flex: 0.75,
          height: '100%',
          justifyContent: 'space-evenly',
          marginVertical: 20,
        }}>
        <Text semiBold title>
          {props.businessName}
        </Text>
        {/* <Text mid semiBold>Phone No.: <Text mid>{props.phoneNumber}</Text></Text> */}
        <Text mid semiBold>
          Applicant Id: <Text mid>{props.applicationId}</Text>
        </Text>
        <Text isSuccessStatus={props.status === 'Active'} isStatus>
          {APPROVAL_STATUS[props.status]}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          flex: 0.15,
        }}>
        <Icon color={COLOUR_GREY} name="chevron-right" size={32} />
      </View>
    </ClickableListItem>
  );
}

function ViewApplicantsScene({
  navigation,
  hideNavigator,
  showNavigator,
  ...props
}) {
  const applicantOptionsMenuComponent = useRef();
  const [applicants, setApplicants] = useState([]);
  const [currentAgentDetails, setCurrentAgentDetails] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState();
  const [searchTextValue, setSearchTextValue] = useState('');

  const renderLoader = () => {
    if (applicants.length) {
      return <ActivityIndicator />;
    }

    return (
      <View>
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
        <Skeleton.TransactionRow />
      </View>
    );
  };

  const loadApplicants = async () => {
    setIsLoading(true);
    const filters = props.route?.params?.filters || null;

    let args = `pageNum=${pageNo}&pageSize=20`;
    if (filters !== null) {
      const {searchText, statusCodeInt} = filters;

      if (statusCodeInt !== undefined) {
        args += '&status=' + statusCodeInt;
        setStatusCode(statusCodeInt);
      }
      if (searchText !== undefined) {
        args += '&searchText=' + searchText;
        setSearchTextValue(searchText);
      }
      const {status, response, code} =
        await onboardingService.searchApplicationsAggregator(args);

      setIsLoading(false);
      if (status === ERROR_STATUS && code !== HTTP_NOT_FOUND) {
        setErrorMessage(await handleErrorResponse(response));
        return;
      }

      if (code === HTTP_NOT_FOUND) {
        Alert.alert('Not Records Found');
        setApplicants([]);
        return;
      }
      const content = [...applicants, ...response.content];
      setApplicants(content);

      return;
    }

    if (statusCode !== undefined) {
      args += '&status=' + statusCode;
      setStatusCode(statusCode);
    }
    if (searchTextValue !== undefined) {
      args += '&searchText=' + searchTextValue;
    }
    const {status, response, code} =
      await onboardingService.searchApplicationsAggregator(args);

    setIsLoading(false);
    if (status === ERROR_STATUS && code !== HTTP_NOT_FOUND) {
      setErrorMessage(await handleErrorResponse(response));
      return;
    }

    if (code === HTTP_NOT_FOUND) {
      Alert.alert('Not Records Found');
      setApplicants([]);
      return;
    }

    setApplicants(response.content);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const loadNextPage = () => {
    setPageNo(pageNo + 1);

    setTimeout(() => loadApplicants(), 0);
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  function rightComponent() {
    // const { isHistoricalData } = this.state;

    return (
      <View style={{flexDirection: 'row'}}>
        <Icon
          color={COLOUR_WHITE}
          name="tune"
          onPress={() => navigation.replace('ApplicantsFilter')}
          size={24}
          type="material"
          underlayColor="transparent"
        />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: '#F3F3F4',
        flex: 1,
      }}>
      <ApplicantOptionsMenu
        agentDetails={currentAgentDetails}
        navigation={navigation}
        ref_={applicantOptionsMenuComponent}
        requestClose={() => applicantOptionsMenuComponent.current.close()}
      />

      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        hideNavigationMenu={hideNavigator}
        showNavigationMenu={showNavigator}
        navigationIconColor={COLOUR_WHITE}
        rightComponent={rightComponent()}
        statusBarProps={{
          backgroundColor: 'transparent',
          barStyle: CONTENT_LIGHT,
        }}
        title="My Applications"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: 'bold',
        }}
        withNavigator
      />

      {applicants.length > 0 && (
        <FlatList
          data={applicants}
          keyExtractor={(item, index) => item + index}
          renderItem={({item, index}) => (
            <ApplicantRow
              {...item}
              key={index}
              onPressOut={() => {
                setCurrentAgentDetails(item);
                applicantOptionsMenuComponent.current.open();
              }}
            />
          )}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              loadNextPage();
            }
          }}
        />
      )}

      {isLoading && renderLoader()}
    </View>
  );
}

function mapStateToProps(state) {
  return {
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    // pendingUrl: state.navigation.pendingUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    showNavigator: () => dispatch(showNavigator()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewApplicantsScene);
