import React, {memo, useEffect, useState} from 'react';
import {
  Animated,
  Image,
  InteractionManager,
  Linking,
  ScrollView,
  SectionList,
  TouchableOpacity,
  View,
} from 'react-native';

import LottieView from 'lottie-react-native';
import Moment from 'moment';
import {Icon} from 'react-native-elements';
import Svg, {Path} from 'react-native-svg';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import TouchID from 'react-native-touch-id';
import ActivityIndicator from '../../../../../../../components/activity-indicator';
import AnimatedNumber from '../../../../../../../components/animated-number';
import Button from '../../../../../../../components/button';
import ClickableListItem from '../../../../../../../components/clickable-list-item';
import Header from '../../../../../../../components/header';
import Hyperlink from '../../../../../../../components/hyperlink';
import GradientIcon from '../../../../../../../components/icons/gradient-icon';
import Skeleton from '../../../../../../../components/skeleton';
import Text from '../../../../../../../components/text';
import {
  AGENT,
  AGENT_TYPE_ID,
  APPLICANT,
  APPLICATION,
  APP_NAME,
  BILLS,
  CONTACT_US_EMAIL,
  CONTACT_US_PHONE,
  CONTACT_US_WEBPAGE,
  COPIED_TO_CLIPBOARD,
  HAS_USER_RATED_APP_ON_THE_STORE,
  MMO,
  PENDING_SCENE_AFTER_APPLICATION_SUBMISSION,
  RECHARGE,
  SEND_MONEY,
  SHOW_STATUS_BAR,
  SUPER_AGENT,
  USER,
  WALLET,
  WINDOW_WIDTH,
  WITHDRAW,
} from '../../../../../../../constants';
import {
  ERROR_STATUS,
  HTTP_NOT_FOUND,
  SUCCESS_STATUS,
} from '../../../../../../../constants/api';
import {
  ENVIRONMENT,
  FUND_VIA_QUICKTELLER,
  PRODUCTION,
  SHOW_CBN_COMPLIANCE,
} from '../../../../../../../constants/api-resources';
import {
  BLOCKER,
  CASUAL,
  UNIMPORTANT,
} from '../../../../../../../constants/dialog-priorities';
import {
  APPLICATION_CURRENT_APPLICATION,
  APPLICATION_FROM_DASHBOARD,
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_LINK_BLUE,
  COLOUR_MID_GREY,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_MID,
  LINE_HEIGHT_MID,
} from '../../../../../../../constants/styles';
import Services from '../../../../../../../fixtures/services.json';
import amountField from '../../../../../../../fragments/amount-field';
import BVNAlertMenu from '../../../../../../../fragments/bvn-alert-menu';
import BVNAlertMenuSuspend from '../../../../../../../fragments/bvn-alert-menu-suspend';
import BVNAlertPendingVerification from '../../../../../../../fragments/bvn-alert-pending-verification';
import {CbnRequirementUpdate} from '../../../../../../../fragments/cbn-requirement-update';
import ContactUsOptionsMenu from '../../../../../../../fragments/contact-us-options-menu';
import EnableFingerprintPrompt from '../../../../../../../fragments/enable-fingerprint-prompt';
import FeatureFlag, {
  BEHAVIOURS,
} from '../../../../../../../fragments/feature-flag';
import FundingWalletOptionsMenu from '../../../../../../../fragments/funding-wallet-options-menu';
import NINRestrictedAccount from '../../../../../../../fragments/nin-account-restricted';
import NINAccountUpdate from '../../../../../../../fragments/nin-account-update';
import {NINAccountUpdateBanner} from '../../../../../../../fragments/nin-account-update-banner';
import RateThisAppMenu from '../../../../../../../fragments/rate-this-app-menu';
import AgentSerializer from '../../../../../../../serializers/resources/agent';
import ApplicationSerializer from '../../../../../../../serializers/resources/application';
import TransactionSerializer from '../../../../../../../serializers/resources/transaction';
import UserSerializer from '../../../../../../../serializers/resources/user';
import WalletSerializer from '../../../../../../../serializers/resources/wallet';
import UserManagement from '../../../../../../../services/api/resources/user-management';
import {
  hideNavigator,
  navigateTo,
  showNavigator,
} from '../../../../../../../services/redux/actions/navigation';
import {
  setIsFastRefreshPending,
  setScreenAfterLogin,
} from '../../../../../../../services/redux/actions/tunnel';
import {
  onboardingService,
  platformService,
  settlementService,
  transactionHistoryService,
  transactionService,
} from '../../../../../../../setup/api';
import {flashMessage} from '../../../../../../../utils/dialog';
import handleErrorResponse from '../../../../../../../utils/error-handlers/api';
import {getOnboardingProgress} from '../../../../../../../utils/metrics';
import {NavigationService} from '../../../../../../../utils/navigation-service';
import Settings from '../../../../../../../utils/settings';
import {
  deleteData,
  loadData,
  saveData,
} from '../../../../../../../utils/storage';
import StatementOfAccountRow from '../../../../reports/components/statement-of-account-row';
import TransactionRow from '../../../../reports/components/transaction-row';

const MMO_SUB_CATEGORY = Services[MMO];
MMO_SUB_CATEGORY.id = ENVIRONMENT === PRODUCTION ? 18 : 20;

const DISTRIBUTE_SERVICE_SUB_CATEGORY = Services['send-money'].find(
  ({name}) => name === 'Distribute',
);

const ItemRowResume = props => {
  return (
    <ClickableListItem
      disabled={props.disabled}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        opacity: props.disabled ? 0.4 : 1,
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#cccccc',
        marginBottom: 15,
      }}
      onPressOut={props.onPressOut}>
      <View style={{flex: 1}}>
        <Text bold>{props.title}</Text>
        <Text>{props.subTitle}</Text>
      </View>
      <Icon
        color={props?.declineReason ? COLOUR_RED : COLOUR_GREEN}
        name={
          props?.declineReason
            ? 'cancel'
            : props.completed
            ? 'check-circle'
            : 'circle'
        }
        size={18}
        type="feather"
      />
      <View style={{marginRight: 15}} />
    </ClickableListItem>
  );
};

class BalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      amount,
      containerStyle,
      didLoadBalanceFail,
      isLoading,
      retry,
      timestamp,
      title,
      showAccountNo,
      accountNo,
      bankName,
    } = this.props;

    const copyContentToClipboard = () => {
      Clipboard.setString(accountNo);

      flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
    };

    return (
      <View
        style={{
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          elevation: 5,
          height: 170,
          marginRight: 20,
          padding: 20,
          width: 0.75 * WINDOW_WIDTH,
          ...containerStyle,
        }}>
        <View>
          <Text semiBold>{`\n${title}`}</Text>
          <Text
            small
            style={{color: COLOUR_MID_GREY, lineHeight: LINE_HEIGHT_MID}}>
            as at {Moment(timestamp).format('MMMM Do, YYYY h:mma')}
          </Text>
        </View>

        {showAccountNo && (
          <>
            <View>
              <Text style={{height: 7}} />
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', JSON.stringify(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 32,
                  lineHeight: 32,
                }}
                value={amount}
              />
            </View>
            <View>
              <Text semiBold>{accountNo}</Text>
              <Text small style={{color: COLOUR_MID_GREY, lineHeight: 13}}>
                {bankName}
              </Text>
            </View>
          </>
        )}
        {!showAccountNo && (
          <>
            <View>
              <Text style={{height: 7}} />
              <AnimatedNumber
                blue
                steps={1}
                formatter={value =>
                  amountField('NGN', JSON.stringify(value || '0.00'))
                }
                semiBold
                style={{
                  fontSize: 35,
                  lineHeight: 40,
                }}
                value={amount}
              />
            </View>
            <View>
              <Text semiBold />
              <Text small style={{color: COLOUR_MID_GREY, lineHeight: 13}} />
            </View>
            {isLoading && (
              <ActivityIndicator
                containerStyle={{
                  position: 'absolute',
                  right: 20,
                  bottom: 20,
                }}
                size="small"
              />
            )}
            {didLoadBalanceFail && !isLoading && (
              <ClickableListItem
                onPress={retry}
                style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 18,
                }}>
                <Icon color={COLOUR_BLUE} name="refresh" size={24} />
              </ClickableListItem>
            )}
          </>
        )}
        {showAccountNo && (
          <ClickableListItem
            onPress={copyContentToClipboard}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 14,
            }}>
            {accountNo !== '...' && (
              <Icon
                color={COLOUR_BLUE}
                name="copy"
                type="font-awesome"
                size={20}
              />
            )}
          </ClickableListItem>
        )}

        {this.props.buttonTitle && (
          <Button
            disabled={this.props.isDisabled}
            buttonStyle={{
              backgroundColor: 'transparent',
              padding: 20,
              ...this.props.buttonStyle,
            }}
            containerStyle={{
              backgroundColor: 'transparent',
              flex: 0.4,
              position: 'absolute',
              top: 0,
              right: 0,
              ...this.props.buttonContainerStyle,
            }}
            title={this.props.buttonTitle}
            titleStyle={{
              color: COLOUR_RED,
              fontSize: 13,
              letterSpacing: 1.15,
              textAlign: 'right',
            }}
            onPressOut={() => this.props.buttonOnPressOut()}
          />
        )}
      </View>
    );
  }
}

class ServiceThumbnail extends React.Component {
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.isDisabled}
        onPress={this.props.onPress}
        style={{
          alignItems: 'center',
          height: 100,
          width: this.props.width || 90,
        }}>
        <GradientIcon
          colors={
            this.props.isDisabled ? ['#D2D2D3', '#D2D2D3'] : this.props.colours
          }
          icon={this.props.icon}
          iconType={this.props.iconType}
          style={{
            backgroundColor: this.props.colours[0],
            borderRadius: 5,
            height: 50,
            marginBottom: 4,
            width: 60,
          }}
        />
        <Text center style={{width: 100}}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

export class StatusCard extends React.Component {
  // TODO work on Awaiting Validation, Awaiting Approval, Setup in Progress
  constructor() {
    super();

    this.state = {
      levelPercentage: 0,
      requirements: [],
      currentApplication: {},
    };

    this.loadData = this.loadData.bind(this);
    this.showWalletFundingOptions = this.showWalletFundingOptions.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.application !== this.props.application) {
      this.loadData();
    }
  }

  async loadData() {
    const {application} = this.props;
    await deleteData('agentSignupData');

    const onboardingProgress = await getOnboardingProgress(
      application ? undefined : 100,
    );
    this.setState({
      ...onboardingProgress,
      currentApplication: application,
    });

    console.log('ONBOARDING PROGRESS', onboardingProgress);
    console.log('ONBOARDING PROGRESS APPLICATION', application);
  }

  get approvalStatusCard() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          borderRadius: 4,
          elevation: 2,
          height: 370,
          justifyContent: 'space-around',
          margin: 20,
          marginBottom: 40,
          padding: 20,
          paddingVertical: 20,
        }}>
        <Svg
          fill="none"
          height="110"
          width="130"
          style={{position: 'absolute', top: 0, right: 0}}>
          <Path
            opacity="0.063399"
            d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
            stroke={COLOUR_BLUE}
            strokeWidth="65"
          />
        </Svg>

        <Svg
          width="48"
          height="59"
          style={{position: 'absolute', top: 190, left: 0}}
          fill="none">
          <Path
            opacity="0.063399"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
            stroke="#D81E1E"
            strokeWidth="22"
          />
        </Svg>

        <Text
          center
          style={{
            color: COLOUR_RED,
            fontSize: 12,
          }}>
          {this.props.application.isAwaitingValidation
            ? 'Awaiting Validation'
            : 'Awaiting Approval'}
        </Text>

        <Text
          big
          bold
          center
          style={{
            color: COLOUR_BLACK,
          }}>
          We are currently reviewing your application.
        </Text>

        <Text mid>
          {
            'Your application is currently being reviewed. An email notification will be sent to you once approved and your status would be updated on the dashboard. For questions or feedback, reach out to us on any of the channels below:'
          }
        </Text>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Email: `}</Text>
          <Hyperlink
            onPress={() =>
              Linking.openURL(`mailto:${this.props.contactUsEmail}`)
            }
            style={{
              fontSize: 14,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {this.props.contactUsEmail}
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Help Portal: `}</Text>
          <Hyperlink
            onPress={() => Linking.openURL(this.props.contactUsWebpage)}
            style={{
              fontSize: 14,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {this.props.contactUsWebpage}
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Contact Centre: `}</Text>
          <Hyperlink
            onPress={() => Linking.openURL(`tel:${this.props.contactUsPhone}`)}
            style={{
              fontSize: 14,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            {this.props.contactUsPhone}
          </Hyperlink>
        </View>
      </View>
    );
  }

  get newAgentStatusCard() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          borderRadius: 4,
          elevation: 4,
          height: 370,
          justifyContent: 'space-evenly',
          margin: 20,
          marginBottom: 40,
          padding: 20,
          paddingVertical: 20,
        }}>
        <Svg
          fill="none"
          height="110"
          width="130"
          style={{position: 'absolute', top: 0, right: 0}}>
          <Path
            opacity="0.063399"
            d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
            stroke={COLOUR_BLUE}
            strokeWidth="65"
          />
        </Svg>

        <Svg
          width="48"
          height="59"
          style={{position: 'absolute', top: 190, left: 0}}
          fill="none">
          <Path
            opacity="0.063399"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
            stroke="#D81E1E"
            strokeWidth="22"
          />
        </Svg>

        <Text
          center
          small
          style={{
            color: COLOUR_RED,
          }}>
          Hello!
        </Text>

        <Text
          bigger
          bold
          center
          style={{
            color: COLOUR_BLACK,
          }}>
          Welcome to {`\n`}Quickteller Paypoint.
        </Text>

        <Text mid>
          You have no transactions yet. To start transacting, fund your wallet
          via any of the channels below:
        </Text>

        <Text mid>
          • By clicking the “Fund Wallet” button.{'\n'}• Using Paydirect at any
          Bank Branch nationwide.{'\n'}• Using Quickteller within your bank’s
          Internet Banking Platform.
        </Text>

        <Button
          disabled={this.props.isDisabled}
          buttonStyle={{
            backgroundColor: COLOUR_RED,
            padding: 10,
            ...this.props.buttonStyle,
          }}
          containerStyle={{
            backgroundColor: 'transparent',
            flex: 0.4,
            marginTop: 20,
            padding: 5,
            width: 250,
            ...this.props.buttonContainerStyle,
          }}
          title={'Fund Wallet'}
          onPress={this.showWalletFundingOptions}
          onPressOld={() =>
            this.props.navigation.navigate(
              FUND_VIA_QUICKTELLER
                ? 'FundWalletQuickteller'
                : 'FundWalletInApp',
            )
          }
        />

        <FundingWalletOptionsMenu
          navigation={this.props.navigation}
          ref_={component => (this.fundingWalletOptionsMenu = component)}
          requestClose={() => this.fundingWalletOptionsMenu.close()}
        />
      </View>
    );
  }

  get setupInProgressStatusCard() {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: COLOUR_WHITE,
          borderRadius: 4,
          elevation: 4,
          height: 470,
          justifyContent: 'space-evenly',
          margin: 20,
          marginBottom: 40,
          padding: 20,
          paddingVertical: 20,
        }}>
        <Svg
          fill="none"
          height="110"
          width="130"
          style={{position: 'absolute', top: 0, right: 0, zIndex: 5}}>
          <Path
            opacity="0.063399"
            d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
            stroke={COLOUR_BLUE}
            strokeWidth="65"
          />
        </Svg>

        <Svg
          width="48"
          height="59"
          style={{position: 'absolute', top: 190, left: 0, zIndex: 5}}
          fill="none">
          <Path
            opacity="0.063399"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
            stroke="#D81E1E"
            strokeWidth="22"
          />
        </Svg>

        <LottieView
          autoPlay={true}
          loop={false}
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            height: 200,
            width: 200,
            // right: 0,
            top: 12,
          }}
          source={require('../../../../../../../animations/16372-gears.json')}
        />

        <Text
          mid
          bold
          center
          style={{
            color: COLOUR_BLACK,
          }}>
          Setup in Progress.
        </Text>

        <Text
          big
          center
          style={{
            color: COLOUR_BLACK,
            marginBottom: 8,
            marginTop: 125,
          }}>
          {`We are currently setting you up on ${APP_NAME}. Please check back in 24 hours.`}
        </Text>

        <Text>
          {`For questions or feedback, reach out to us on any of the channels below:`}
        </Text>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Email: `}</Text>
          <Hyperlink
            onPress={() => Linking.openURL(`mailto:${CONTACT_US_EMAIL}`)}
            style={{
              fontSize: 14,
            }}>
            {CONTACT_US_EMAIL}
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Help Portal: `}</Text>
          <Hyperlink
            onPress={() => Linking.openURL(CONTACT_US_WEBPAGE)}
            style={{
              fontSize: 14,
            }}>
            {CONTACT_US_WEBPAGE}
          </Hyperlink>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            // marginTop: 2,
            width: '100%',
          }}>
          <Text mid>{`Contact Centre: `}</Text>
          <Hyperlink
            onPress={() => Linking.openURL(`tel:${CONTACT_US_PHONE}`)}
            style={{
              fontSize: 14,
            }}>
            {CONTACT_US_PHONE}
          </Hyperlink>
        </View>
      </View>
    );
  }

  get rejectedApplicationCard() {}

  showWalletFundingOptions() {
    this.fundingWalletOptionsMenu.open();
  }

  getIconFor(name) {
    return {
      'Phone Verification': 'phone',
      'Agent Information': 'paperclip',
      'Email Verification': 'mail',
    }[name];
  }

  render() {
    const nextPage = application => {
      if (!application?.applicantDetails) return 'SelfOnboardingPreSetupAgent';
      if (application?.nextOfKin || application?.applicantDetails?.nextOfKin)
        return 'SelfOnboardingApplicationPreview';
      if (application?.businessDetails) return 'SelfOnboardingNOKScene';
      if (application?.applicantDetails?.identificationType)
        return 'SelfOnboardingBusinessScene';
      if (application?.applicantDetails) return 'SelfOnboardingKYCScene';
    };
    const {agent, application, makeCallToAgentsMe, user} = this.props;

    const {levelPercentage, requirements} = this.state;

    if (
      application &&
      (application.isAwaitingApproval || application.isAwaitingValidation)
    ) {
      return this.approvalStatusCard;
    }

    if (makeCallToAgentsMe) {
      if (agent && agent.isSetupComplete == false) {
        return this.setupInProgressStatusCard;
      }

      if (agent && agent.isNew == true) {
        return this.newAgentStatusCard;
      }

      if (agent && agent.isActive) {
        return <React.Fragment />;
      }
    } else {
      if (user && user.isDomainNew) {
        return this.newAgentStatusCard;
      }

      if ((user && user.isDomainActive) || user.isApplicant == false) {
        return <React.Fragment />;
      }
    }

    return this.props.isHardLoading == true ? (
      <React.Fragment />
    ) : (
      <View
        style={{
          backgroundColor: COLOUR_WHITE,
          borderRadius: 12,
          elevation: 6,
          minHeight: 300,
          margin: 20,
          marginTop: 40,
          marginBottom: 40,
          padding: 20,
        }}>
        <Text
          center
          blue
          big
          bold
          style={{
            marginBottom: 10,
          }}>
          {this.state.currentApplication?.approvalStatus == 'REJECTED'
            ? 'Application Rejected'
            : 'Application Resumption'}
        </Text>
        {this.state.currentApplication?.approvalStatus == 'REJECTED' ? null : (
          <Text
            center
            small
            black
            style={{
              marginBottom: 15,
            }}>
            Complete your application to start carrying out transactions on
            Quickteller Paypoint .
          </Text>
        )}
        {this.state.currentApplication?.approvalStatus == 'REJECTED' && (
          <Text
            center
            red
            small
            // style={{
            //   marginBottom: 15,
            // }}
          >
            Reason for rejection: {this.state.currentApplication?.declineReason}
          </Text>
        )}

        {/* <Text biggest blue bold center>
          {Math.round(levelPercentage)}%
        </Text> */}
        <View
          style={{
            elevation: 10,
            justifyContent: 'space-evenly',
            // height: 35,
            margin: 20,
            border: '5px solid red',
            'border-radius': '8px',
          }}>
          <ItemRowResume
            colors={['#6FEBF5', '#0BBDE0']}
            style={{
              marginBottom: 30,
            }}
            title="Personal Details"
            subTitle="Provide agent's personal details"
            completed={this.state.currentApplication?.applicantDetails}
            // completed={this.state.currentApplication.applicantDetails}
            onPressOut={() => {
              this.props.navigation.replace('SelfOnboardingPreSetupAgent');
            }}
            disabled={this.state.currentApplication?.applicantDetails}
          />

          <ItemRowResume
            colors={['#6FEBF5', '#0BBDE0']}
            style={{
              marginBottom: 30,
            }}
            title="KYC Information"
            subTitle="Kindly provide agent's documentation"
            declineReason={this.state.currentApplication?.declineReason}
            // disabled={
            //   !this.state.currentApplication?.applicantDetails ||
            //   this.state.currentApplication?.applicantDetails?.identificationType
            // }
            completed={
              this.state.currentApplication?.applicantDetails
                ?.identificationType
            }
            onPressOut={async () => {
              await AsyncStorage.setItem(
                APPLICATION_FROM_DASHBOARD,
                JSON.stringify(true),
              );
              this.props.navigation.replace('SelfOnboardingKYCScene', {
                isFromDashboard: true,
                selfOnboarding: false,
                isBackButton: false,
                resumeApplicationDetails: this.state.currentApplication,
                declineReason: this.state.currentApplication?.declineReason,
              });
            }}
          />

          <ItemRowResume
            colors={['#6FEBF5', '#0BBDE0']}
            style={{
              marginBottom: 30,
            }}
            title="Business Details"
            subTitle="Tell us about agent's business"
            disabled={
              !this.state.currentApplication?.applicantDetails
                ?.identificationType
            }
            completed={this.state.currentApplication?.businessDetails}
            onPressOut={async () => {
              await AsyncStorage.setItem(
                APPLICATION_FROM_DASHBOARD,
                JSON.stringify(true),
              );
              this.props.navigation.replace('SelfOnboardingBusinessScene', {
                isFromDashboard: true,
                isBackButton: false,
                resumeApplicationDetails: this.state.currentApplication,
                declineReason: this.state.currentApplication?.declineReason,
              });
            }}
          />

          <ItemRowResume
            colors={['#6FEBF5', '#0BBDE0']}
            style={
              {
                // marginBottom: 30,
              }
            }
            title="Next of Kin Details"
            subTitle="Kindly provide agent's next of kin"
            disabled={!this.state.currentApplication?.businessDetails}
            completed={
              this.state.currentApplication?.applicantDetails?.nextOfKin
            }
            onPressOut={async () => {
              await AsyncStorage.setItem(
                APPLICATION_FROM_DASHBOARD,
                JSON.stringify(true),
              );
              this.props.navigation.replace('SelfOnboardingNOKScene', {
                isFromDashboard: true,
                isBackButton: false,
                resumeApplicationDetails: this.state.currentApplication,
              });
            }}
          />
        </View>

        {application && application.isDraftApplication && (
          <Button
            // containerStyle={{ marginTop: 30 }}
            title="Complete Your Application"
            // onPressOut={this.props.navigateToApplication}
            onPress={() =>
              this.props.navigation.replace(
                nextPage(this.state.currentApplication),
                {
                  isFromDashboard: true,
                  resumeApplicationDetails: this.state.currentApplication,
                },
              )
            }
          />
        )}

        {/* {!application && user && !user.isEmailVerified && (
          <Button
            containerStyle={{ marginTop: 30 }}
            title="Resend Email"
            onPressOut={() => {}}
          />
        )} */}
      </View>
    );
  }
}

function ServicesRow({
  enable_account_opening: enableAccountOpeningRemoteConfig,
  account_opening_pilot_group,
  enable_card_linking: enableCardLinkingRemoteConfig,
  enable_cash_in,
  enable_pay_bills,
  enable_send_money,
  enable_sell_airtime,
  enable_sell_data,
  enable_sell_epin,
  enable_pos_request,
  internalAgents,
  isDisabled,
  navigation,
  ...props
}) {
  const [enable_card_linking, setEnableCardLinking] = useState(
    enableCardLinkingRemoteConfig,
  );
  const [enable_account_opening, setEnableAccountOpening] = useState(
    enableAccountOpeningRemoteConfig,
  );
  const [userIsAnInternalAgent, setUserIsAnInternalAgent] = useState(false);
  const [userIsSuperAgent, setUserIsSuperAgent] = useState(false);
  const [serializedUser, setSerializedUser] = useState({});

  useEffect(() => {
    loadData(USER).then(userData => {
      userData_ = new UserSerializer(JSON.parse(userData));
      setSerializedUser(userData_);

      setEnableAccountOpening(
        enableAccountOpeningRemoteConfig ||
          account_opening_pilot_group.includes(userData_.username),
      );

      setEnableCardLinking(
        enableCardLinkingRemoteConfig ||
          account_opening_pilot_group.includes(userData_.username),
      );

      setUserIsAnInternalAgent(internalAgents.includes(userData_.username));
    });
  }, [account_opening_pilot_group]);

  const agentServices = () => {
    return (
      <React.Fragment>
        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="pay-a-bill-service-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={
                featureProps.isDisabled ||
                isDisabled ||
                enable_pay_bills === false
              }
              icon="credit-card"
              colours={['#9483FA', '#9F4FF5']}
              category="Pay a Bill"
              text={`Pay\nBills`}
              onPress={() =>
                navigation.navigate('SelectSubCategory', {
                  category: BILLS,
                })
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>
        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="send-money-service-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={
                featureProps.isDisabled ||
                isDisabled ||
                (enable_sell_airtime === false && enable_sell_data === false)
              }
              icon="tag"
              colours={['#83F4FA', '#00B8DE']}
              category="Sell Airtime"
              text="Airtime &&nbsp;Data"
              onPress={() =>
                navigation.navigate('SelectSubCategory', {
                  category: RECHARGE,
                })
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>
        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="card-linking-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={featureProps.isDisabled || isDisabled}
              colours={['#F64F5A', '#EF3430']}
              icon="money"
              text="Cardless Cash Out"
              onPress={() =>
                navigation.navigate('SelectSubCategory', {
                  category: WITHDRAW,
                })
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>
        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="send-money-service-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={
                featureProps.isDisabled ||
                isDisabled ||
                enable_send_money === false
              }
              icon="money"
              colours={['#FACB83', '#F5834F']}
              category="Send Money"
              text={`Send\nMoney`}
              onPress={() =>
                navigation.navigate('SelectSubCategory', {
                  category: SEND_MONEY,
                })
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>

        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="pay-mmo-service-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={featureProps.isDisabled || isDisabled}
              icon="credit-card"
              colours={['#FFA69E', '#861657']}
              //category="Pay a Bill"
              text={`Transfer\nTo MMO`}
              onPress={() =>
                navigation.navigate('SelectProduct', {
                  category: MMO,
                  subCategory: MMO_SUB_CATEGORY,
                })
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>

        <FeatureFlag
          behaviour={BEHAVIOURS.DISABLE}
          requiredDomains={[AGENT, APPLICANT]}
          uid="register-cac-service-thumbnail">
          {featureProps => (
            <ServiceThumbnail
              isDisabled={featureProps.isDisabled || isDisabled}
              icon="briefcase"
              colours={['#2CBC65', '#2CBC65']}
              //category="Pay a Bill"
              text={`Register\nwith CAC`}
              onPress={() =>
                // navigation.replace("CacBusinessNameDetails", {
                //   cacRegType: "assisted",
                // })
                flashMessage('Stay tuned!', 'Coming soon', BLOCKER)
              }
              {...props}
              {...featureProps}
            />
          )}
        </FeatureFlag>
      </React.Fragment>
    );
  };

  const superAgentServices = () => {
    return (
      <React.Fragment>
        <FeatureFlag
          requiredDomain={SUPER_AGENT}
          uid="distribute-service-thumbnail">
          {featureProps => (
            <React.Fragment>
              <ServiceThumbnail
                isDisabled={isDisabled || enable_send_money === false}
                icon="money"
                colours={['#FACB83', '#F5834F']}
                category="Send Money"
                text="Top-up Agent Wallet"
                width={100}
                onPress={() =>
                  navigation.navigate('ProductPayment', {
                    category: SEND_MONEY,
                    subCategory: DISTRIBUTE_SERVICE_SUB_CATEGORY,
                  })
                }
                {...props}
                {...featureProps}
              />
              <ServiceThumbnail
                isDisabled={isDisabled || enable_send_money === false}
                icon="money"
                colours={['#FACB83', '#F5834F']}
                category="Send Money"
                text="Setup New Agent"
                onPress={() => {
                  navigation.navigate('AggregatorLanding');
                  // this.props.resetApplication();
                }}
                {...props}
                {...featureProps}
              />

              <ServiceThumbnail
                isDisabled={isDisabled || enable_send_money === false}
                colours={['#fff', '#fff']}
                text=""
                width={100}
              />
            </React.Fragment>
          )}
        </FeatureFlag>
      </React.Fragment>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'flex-end',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        height: 250,
        flexDirection: 'row',
        padding: 25,
        paddingBottom: 16,
        minWidth: '100%',
      }}
      horizontal>
      {serializedUser.isSuperAgent ? superAgentServices() : agentServices()}
      <FeatureFlag requiredDomain={AGENT} uid="more-service-thumbnail">
        {() => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Services');
            }}
            style={{
              alignItems: 'center',
              backgroundColor: COLOUR_WHITE,
              borderWidth: 2,
              borderColor: COLOUR_LINK_BLUE,
              borderRadius: 36,
              elevation: 2,
              height: 72,
              justifyContent: 'center',
              marginBottom: 24,
              marginLeft: 12,
              width: 72,
            }}>
            <Text
              bold
              center
              style={{
                color: COLOUR_LINK_BLUE,
              }}>
              More
            </Text>
          </TouchableOpacity>
        )}
      </FeatureFlag>
    </ScrollView>
  );
}

export const ServicesRow_ = memo(ServicesRow);

class HomeTab extends React.PureComponent {
  onboarding = onboardingService;
  platform = platformService;
  settlement = settlementService;
  transaction = transactionService;
  transactionHistory = transactionHistoryService;

  userManagement = new UserManagement();
  transactionSerializer = new TransactionSerializer();

  static navigationOptions = {
    tabBarIcon: ({focused, horizontal, tintColor}) => {
      let IconComponent = Icon;

      return (
        <IconComponent name="grid" type="feather" size={25} color={tintColor} />
      );
    },
  };

  state = {
    activeSlide: 0,
    makeCallToAgentsMe: false, //MAKE_CALL_TO_AGENTS_ME,
    wallet: new WalletSerializer(),
    hardReloadFailed: null,
    isFetchingStatementOfAccount: false,
    isOnboarded: null,
    isLoadingWallet: false,
    overlayErrorViewScale: new Animated.Value(0),
    scrollY: new Animated.Value(0),
    pendingState: {},
    statementOfAccountTransactions: [],
    transactions: [],
    isHardLoading: false,
    showPosBanner: false,
    showNinUpdateBanner: false,
    kycCheckList: '',
    showCbnPromptModal: false,
    showProvideKycModal: false,
  };

  persistenceKeyPos = 'persistenceKey';
  ninAccountUpdateAlertMenu = React.createRef();
  ninRestrictedAccountAlertMenu = React.createRef();

  constructor() {
    super();

    this.renderTransactionHistory = this.renderTransactionHistory.bind(this);

    this.doHardRefresh = this.doHardRefresh.bind(this);
    this.doSoftRefresh = this.doSoftRefresh.bind(this);
    this.navigateToApplication = this.navigateToApplication.bind(this);
    this.tryShowingBVNMenu = this.tryShowingBVNMenu.bind(this);
    this.onFundWalletPress = this.onFundWalletPress.bind(this);
    this.onHardRefresh = this.onHardRefresh.bind(this);
    this.redirectToScreenAfterLogin =
      this.redirectToScreenAfterLogin.bind(this);
    this.tryShowingRateThisAppMenu = this.tryShowingRateThisAppMenu.bind(this);

    this._loadWallet = this._loadWallet.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderStatementOfAccountTransactions =
      this.renderStatementOfAccountTransactions.bind(this);
    this.openCbnPromptModal = this.openCbnPromptModal.bind(this);
    this.confirmPOSDeliveryStatus = this.confirmPOSDeliveryStatus.bind(this);
    this.kycModalNextButton = this.kycModalNextButton.bind(this);
    this.kycModalSkipButton = this.kycModalSkipButton.bind(this);
    this.clearRegType = this.clearRegType.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });

    this.confirmPOSDeliveryStatus();
    this.clearRegType();

    loadData(SHOW_STATUS_BAR).then(response => {
      this.setState({
        showStatusCard: response,
        showProvideKycModal: true,
      });
      console.log('showProvideKycModal1', this.state.showprovideKycModal);
    });

    this.redirectToScreenAfterLogin();

    const doHardLoadUser = false;
    const doHardLoadAgent = this.state.makeCallToAgentsMe;
    this.doHardRefresh(true, true).then(
      // this.doHardRefresh(doHardLoadUser, doHardLoadAgent).then(
      this.onHardRefresh(),
    );

    this.tryShowingBiometricLoginPrompt();
    //this.getNinUpdateStatus();
    this.openCbnPromptModal();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isFastRefreshPending !== prevProps &&
      this.props.isFastRefreshPending
    ) {
      this.doFastRefresh();
      this.props.setIsFastRefreshPending(false);
    }

    console.log('homeNavState', this.props);
    console.log('homeCurrentScreen', prevProps.navigationState.currentScreen);

    if (
      this.props.navigationState.currentScreen !==
      prevProps.navigationState.currentScreen
    ) {
      console.log('SUPPOSED TO DO STUFF HERE.');
      console.log('navigationState', this.props);

      this.isDashboardInFocus() &&
        setTimeout(
          () =>
            this.setState({
              ...this.state.pendingState,
            }),
          800,
        );
    }
  }

  async clearRegType() {
    const savedCacRegType = JSON.parse(await loadData('CAC REG TYPE'));
    console.log('CACREGTYPE1', savedCacRegType);
    if (savedCacRegType === 'assisted') {
      console.log('CACREGTYPE2', savedCacRegType);
      await saveData('CAC REG TYPE', '');
      const savedCacRegType2 = JSON.parse(await loadData('CAC REG TYPE'));
      console.log('CACREGTYPE3', savedCacRegType2);
    }
  }

  onHardRefresh() {
    this.tryShowingRateThisAppMenu();
  }

  async openCbnPromptModal() {
    try {
      const currentAgentResponse = await this.platform.getCurrentAgent();
      console.log('kycCheckList1', currentAgentResponse);
      const currentAgentResponseStatus = currentAgentResponse.status;
      const currentAgentResponseObj = currentAgentResponse.response;
      const {agentTypeId, kycCheckList, kycStatus} = currentAgentResponseObj;

      this.setState({
        kycCheckList: kycCheckList,
      });

      if (agentTypeId === 4 && kycStatus !== 'COMPLETED') {
        this.setState({
          showCbnPromptModal: true,
        });
      } else {
        this.setState({
          showCbnPromptModal: false,
        });
      }
    } catch (err) {
      console.log(err, 'kycChecklist err');
    }
  }

  updateCbnPromptModal = () => {
    this.setState({
      showCbnPromptModal: false,
    });
  };

  skipCbnPromptModal = () => {
    this.setState({
      showCbnPromptModal: false,
    });
  };

  async tryShowingBiometricLoginPrompt() {
    const settings = new Settings();

    const isBiometricLoginEnabled = await settings.getBiometricLogin();
    const doesDeviceHaveBiometricLogin = await TouchID.isSupported();
    const isUserBlacklistedFromBiometricLogin =
      await settings.checkIfCurrentUserIsBlacklistedFromBiometricLogin();
    const hasUserSelectedBiometricLogin =
      await settings.checkIfCurrentUserHasSelectedBiometricLogin();

    console.warn({
      isUserBlacklistedFromBiometricLogin,
      isBiometricLoginEnabled,
      doesDeviceHaveBiometricLogin,
      hasUserSelectedBiometricLogin,
    });

    if (
      !isBiometricLoginEnabled &&
      doesDeviceHaveBiometricLogin &&
      !isUserBlacklistedFromBiometricLogin &&
      !hasUserSelectedBiometricLogin
    ) {
      setTimeout(() => {
        this.enableFingerprintPrompt?.open();
      }, 2500);
    }
  }

  async tryShowingRateThisAppMenu() {
    if (!this.props.remoteConfig.show_rate_this_app_menu) {
      return;
    }

    const currentUser = new UserSerializer(JSON.parse(await loadData(USER)));
    const hasUserRatedAppOnTheStore = JSON.parse(
      await loadData(HAS_USER_RATED_APP_ON_THE_STORE),
      'false',
    );

    let toShow = false;

    if (!currentUser.isApplicant) {
      const randomNumber = Math.random();
      const diceThrow = randomNumber <= 0.25;
      toShow = diceThrow && !hasUserRatedAppOnTheStore;

      console.log({diceThrow, toShow});
    }

    if (toShow) {
      this.rateThisAppMenu.open();
    }
  }

  kycModalNextButton = () => {
    this.setState({showprovideKycModal: false}, () => {
      this.props.navigation.navigate('CacTinDetails');
      console.log('showProvideKycModal2', this.state.showprovideKycModal);
    });
  };

  kycModalSkipButton = () => {
    this.setState({showprovideKycModal: false}, () => {
      console.log('showProvideKycModa3', this.state.showprovideKycModal);
    });
  };

  daydifference(dt1) {
    const currentDate = new Date().getTime();
    let day1 = new Date(dt1).getTime();
    return parseInt((day1 - currentDate) / (1000 * 3600 * 24));
  }

  async tryShowingBVNMenu(currentAgent) {
    const currentUser = new UserSerializer(JSON.parse(await loadData(USER)));
    //const bvnStatusField = `${BVN_STATUS}${currentAgent.businessPhoneNo}`;
    //const bvnStatus = await loadData(bvnStatusField);

    // if(!bvnStatus){
    //   return;
    // }

    if (!currentUser.isApplicant) {
      if (currentAgent.bvnVerificationStatus === 'VERIFIED') {
        await saveData(bvnStatusField, true);
      } else if (
        currentAgent.bvnVerificationStatus === 'SUSPENDED' ||
        currentAgent.bvnVerificationStatus === 'NOT_VERIFIED'
      ) {
        this.bvnAlertMenuSuspend.open();
      } else if (
        currentAgent.bvnVerificationStatus === 'PENDING_VERIFICATION'
      ) {
        // confirm if the agent still has days left
        if (this.daydifference(currentAgent.bvnGracePeriod) < 0) {
          this.bvnAlertPendingVerification.open();
        }
      } else if (
        currentAgent.bvnVerificationStatus === 'VERIFICATION_FAILED' ||
        currentAgent.bvnVerificationStatus === 'VERIFIED_PARTIALLY'
      ) {
        this.bvnAlertMenu.open();
      }
    }
  }
  checkNinUpdatePeriod = () => {
    const currentDate = new Date();
    const mainDate = new Date(2024, 1, 29);
    return currentDate > mainDate;
  };

  async getNinUpdateStatus() {
    const currentAgentResponse = await this.platform.getCurrentAgent();
    const currentAgentResponseStatus = currentAgentResponse.status;
    const currentAgentResponseObj = currentAgentResponse.response;
    const {agentClass, ninVerificationStatus} = currentAgentResponseObj;

    const theAgentClass =
      agentClass === 'STANDARD' || agentClass === 'PRESTIGE';

    const verificationStatus =
      !ninVerificationStatus || ninVerificationStatus !== 'VERIFIED';

    if (currentAgentResponseStatus === ERROR_STATUS) {
      this.setState({
        hardReloadFailed: true,
      });
    } else if (
      this.props.navigationState.previousScreen !== 'Login' &&
      !this.checkNinUpdatePeriod() &&
      verificationStatus &&
      theAgentClass
    ) {
      this.ninAccountUpdateAlertMenu.current?.close();
      // this.setState({ showNinUpdateBanner: true });
    } else if (
      !this.checkNinUpdatePeriod() &&
      this.props.navigationState.previousScreen === 'Login' &&
      verificationStatus &&
      theAgentClass
    ) {
      // this.ninAccountUpdateAlertMenu.current?.open();
      //this.setState({ showNinUpdateBanner: true });
      this.setState({showNinUpdateBanner: false});
    } else if (
      this.checkNinUpdatePeriod() &&
      theAgentClass &&
      verificationStatus
    ) {
      // this.ninRestrictedAccountAlertMenu.current?.open();
      this.ninRestrictedAccountAlertMenu.current?.close();
    } else {
      this.ninRestrictedAccountAlertMenu.current?.close();
      this.ninAccountUpdateAlertMenu.current?.close();
    }
  }
  async redirectToScreenAfterLogin() {
    const user = new UserSerializer(JSON.parse(await loadData(USER)));
    if (user.isDisabled || user.isDomainDisabled) {
      return;
    }

    console.log('REDIRECTING TO', this.props.screenAfterLogin);

    if (this.props.screenAfterLogin) {
      this.props.navigation.navigate(
        this.props.screenAfterLogin.screenName,
        this.props.screenAfterLogin.navigationParams,
      );

      this.props.setScreenAfterLogin(null);
    }
  }

  async _loadAgent() {
    // if (!this.state.makeCallToAgentsMe) {
    //   return null;
    // }

    const savedAgentData = JSON.parse(await loadData(AGENT));

    if (savedAgentData === null) {
      return;
    }

    const currentAgent = new AgentSerializer(savedAgentData);

    this.setState({
      currentAgent,
    });

    console.log('NUGAGEE AGENT 2', currentAgent);

    return currentAgent;
  }

  async _loadApplication() {
    const currentApplicationData = JSON.parse(await loadData(APPLICATION));

    console.log(
      {currentApplicationData},
      'NUGAGEE CURRENT APPLICATION RESPONSE',
    );

    if (!currentApplicationData) {
      return;
    }

    const currentApplication = new ApplicationSerializer(
      currentApplicationData,
    );

    await AsyncStorage.setItem(
      APPLICATION_CURRENT_APPLICATION,
      JSON.stringify(currentApplication),
    );

    console.log({currentApplication}, 'NUGAGEE CURRENT APPLICATION SERIALIZED');

    this.setState({
      currentApplication,
    });

    return currentApplication;
  }

  async _loadUser() {
    const currentUser = new UserSerializer(JSON.parse(await loadData(USER)));

    this.setState({
      currentUser,
    });

    console.log('CURRENT USER NUGAGEE', currentUser);

    const agentTypeId = currentUser.domainTypeId;
    console.log('CHECKTYPEID', agentTypeId);

    if (agentTypeId === 4) {
      this.setState({
        showCbnPrompt: true,
      });
    }

    return currentUser;
  }

  async _loadWallet(currentAgent, currentUser, isFastRefresh = false) {
    let oldWallet = await loadData(WALLET + currentUser.businessMobileNo);
    console.log('oldWallet', oldWallet);
    try {
      oldWallet = JSON.parse(oldWallet) || {};
    } catch {
      oldWallet = oldWallet || {};
    }

    this.setState({
      isLoadingWallet: !isFastRefresh,
      wallet: oldWallet,
    });

    let walletBalance = {};
    let settlementBalance = null;

    if (this.state.makeCallToAgentsMe) {
      settlementBalance = await this.settlement.getWalletUnsettledBalanceByRef(
        currentAgent.walletRef,
      );
      walletBalance = await this.transaction.getWalletBalanceByPost({
        businessPhoneNo: currentAgent.phoneNumber,
      });
    } else {
      // settlementBalance = await this.settlement.getWalletUnsettledBalance(currentUser.mobileNo);
      walletBalance = await this.transaction.getWalletBalance();
    }

    const walletSerializer = new WalletSerializer({
      commissionWalletBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.commissions_earned * 100
          : walletBalance.response.commissionWalletBalance,
      ledgerBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.ledger_balance * 100
          : walletBalance.response.ledgerBalance,
      transactionWalletBalance:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.current_balance * 100
          : walletBalance.response.transactionWalletBalance,
      unsettledCommission:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.unsettled_balance * 100
          : walletBalance.response.unsettledWalletBalance,
      walletBalanceTimestamp:
        walletBalance?.status !== SUCCESS_STATUS
          ? oldWallet.walletBalanceTimestamp
          : new Date(),
    });

    const wallet = walletSerializer.asJson();

    await saveData(WALLET + currentUser.businessMobileNo, wallet);

    const pendingState = {
      wallet,
    };

    this.setState({
      wallet: this.isDashboardInFocus() ? wallet : this.state.wallet,
      isLoadingWallet: false,
      isLoading: false,
      didLoadWalletBalanceFail: walletBalance.status === ERROR_STATUS,
      pendingState: this.isDashboardInFocus() ? null : pendingState,
    });

    console.log('isLoadingWallet', this.state.isLoadingWallet);
  }

  isDashboardInFocus() {
    const {
      navigationState: {currentScreen},
    } = this.props;
    return ['Agent', 'Dashboard'].includes(currentScreen);
  }

  async doSoftRefresh() {
    let isDisabled = false;

    const currentUser = await this._loadUser();
    isDisabled =
      isDisabled || currentUser.isDisabled || currentUser.isDomainDisabled;

    console.log('User based isDisabled', isDisabled);
    let currentAgent = null;

    if (currentUser.isAgent) {
      currentAgent = await this._loadAgent();

      console.log('DID HARD RELOAD FAIL', this.state.hardReloadFailed);

      if (true) {
        //currentAgent
        this._loadWallet(currentAgent, currentUser);
        this.hardLoadTransactionHistory();
        this.hardLoadStatementOfAccount();
        this.hardLoadAgent();

        // TODO this could go as soon as currentUser.domainStatus can return NEW
        // isDisabled = isDisabled || currentAgent?.isDisabled;
        // console.log('Agent based isDisabled', isDisabled);
      }
    } else if (currentUser.isSuperAgent) {
      this._loadWallet(null, currentUser);
      this.hardLoadTransactionHistory();
      this.hardLoadStatementOfAccount();
    } else if (currentUser.isApplicant) {
      const currentApplication = await this._loadApplication();

      isDisabled = isDisabled || currentApplication?.isDisabled;
    }
    console.log({currentAgent}, 'CURRENT AGENT IN SOFT RELOAD');

    console.log({currentUser}, 'CURRENT USER IN SOFT RELOAD');
    console.log(
      currentAgent?.isSetupComplete,
      'CURRENT USER IN SOFT RELOAD 22',
    );
    console.log(currentAgent?.isNew, 'CURRENT USER IN SOFT RELOAD 666');
    console.log(
      currentAgent?.isSetupComplete,
      'CURRENT USER IN SOFT RELOAD 777',
    );
    console.log(currentUser?.isDomainNew, 'CURRENT USER IN SOFT RELOAD 11');
    console.log(currentUser?.isDomainActive, 'CURRENT USER IN SOFT RELOAD 444');
    console.log(currentUser?.isApplicant, 'CURRENT USER IN SOFT RELOAD 555');
    console.log(currentUser?.isOnboarded, 'CURRENT USER IN SOFT RELOAD 33');

    this.setState({
      isNewUser: currentUser?.isDomainNew,
      isOnboarded: currentUser?.isOnboarded,
      isSetupComplete: !currentAgent ? false : currentAgent?.isSetupComplete,
      isDisabled,
    });
  }

  async doFastRefresh() {
    const currentAgent = null,
      currentUser = null,
      isFastRefresh = true;

    this._loadWallet(currentAgent, currentUser, isFastRefresh);
    setTimeout(() => {
      this.hardLoadTransactionHistory(isFastRefresh);
      this.hardLoadStatementOfAccount(isFastRefresh);
    }, 3000);
  }

  async confirmPOSDeliveryStatus() {
    const {code, response} = await this.userManagement.getActivePosRequests();

    if (code == '200') {
      this.setState({
        showPosBanner: true,
      });
      AsyncStorage.setItem(
        this.persistenceKeyPos,
        JSON.stringify(response.data.requestId),
      );
    } else {
      this.setState({
        showPosBanner: false,
      });
      AsyncStorage.setItem(this.persistenceKeyPos, JSON.stringify(null));
    }
  }

  get modalContent() {
    return (
      <View
        style={{
          justifyContent: 'space-evenly',
        }}>
        <Text big>Agent has been added.</Text>
        <Text>
          You can <Hyperlink href="">complete setup</Hyperlink> or
        </Text>
      </View>
    );
  }

  async hardLoadAgent() {
    const currentAgentResponse = await this.platform.getCurrentAgent();
    const currentAgentResponseStatus = currentAgentResponse.status;
    const currentAgentResponseObj = currentAgentResponse.response;

    if (currentAgentResponseStatus === ERROR_STATUS) {
      this.setState({
        hardReloadFailed: true,
      });

      return new AgentSerializer(JSON.parse(await loadData(AGENT)));
    }

    const currentAgent = new AgentSerializer(currentAgentResponseObj);

    this.setState({
      currentAgent,
    });

    await saveData('theLoggedInAgent', currentAgent);

    await saveData(AGENT, currentAgentResponseObj);
    this.tryShowingBVNMenu(currentAgentResponseObj);

    return currentAgent;
  }

  async hardLoadApplication() {
    const userData = JSON.parse(await loadData(USER));
    const {firstName, lastName, mobileNo, email} = userData;

    let currentApplicationResponse =
      await onboardingService.getApplicationByEmailOrPhone(mobileNo);
    const currentApplicationResponseCode = currentApplicationResponse.code;
    const currentApplicationResponseStatus = currentApplicationResponse.status;
    let currentApplicationResponseObj = currentApplicationResponse.response;

    if (currentApplicationResponseCode === HTTP_NOT_FOUND) {
      currentApplicationResponse = await this.onboarding.createApplication({
        agentTypeId: AGENT_TYPE_ID,
        applicantDetails: {
          firstName,
          surname: lastName,
          phoneNumber: mobileNo,
          emailAddress: email,
        },
        howYouHeardAboutUs: 'Radio',
      });
      currentApplicationResponseObj = currentApplicationResponse.response;
    } else if (currentApplicationResponseStatus === ERROR_STATUS) {
      const previouslySavedApplication = JSON.parse(
        await loadData(APPLICATION),
      );

      this.setState({
        hardReloadFailed: !previouslySavedApplication,
      });

      return previouslySavedApplication;
    }

    await saveData(APPLICATION, currentApplicationResponseObj);
  }

  async hardLoadSuperAgent() {}

  async hardLoadTransactionHistory(isFastRefresh = false) {
    this.setState({
      isFetchingTransactions: true, //!isFastRefresh,
      transactions: isFastRefresh ? this.state.transactions : [],
    });

    const {code, response, status} =
      await this.transactionHistory.retrieveTransactions(
        this.state.currentUser.domainCode,
      );

    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), UNIMPORTANT);

      this.setState({
        isFetchingTransactions: false,
        transactions: code === HTTP_NOT_FOUND ? [] : null,
      });

      return;
    }

    this.setState({
      isFetchingTransactions: false,
      transactions: this.sortTransactions(
        response.content.filter(
          value => value.statusCode.toUpperCase() !== 'INITIATED',
        ),
      ),
    });
  }

  async hardLoadStatementOfAccount(isFastRefresh = false) {
    this.setState({
      isFetchingStatementOfAccount: true, //!isFastRefresh,
      statementOfAccountTransactions: isFastRefresh
        ? this.state.statementOfAccountTransactions
        : [],
    });

    const pageNumber = 1;
    const pageSize = 10;
    const walletJournalTypeId = 1;
    const order = 'descending';

    const {code, response, status} =
      await this.transactionHistory.getStatementOfAccount(
        pageNumber,
        pageSize,
        null,
        null,
        walletJournalTypeId,
        order,
      );
    console.log(response, status, 'dondon');
    if (status === ERROR_STATUS) {
      flashMessage(null, await handleErrorResponse(response), UNIMPORTANT);

      this.setState({
        isFetchingStatementOfAccount: false,
        statementOfAccountTransactions: code === HTTP_NOT_FOUND ? [] : null,
      });

      return;
    }

    this.setState({
      isFetchingStatementOfAccount: false,
      statementOfAccountTransactions: this.sortStatementOfAccountTransactions(
        response.content,
      ),
    });
  }

  sortStatementOfAccountTransactions(transactions) {
    let sections = [];

    transactions?.map((value, index) => {
      const serializedTransaction =
        this.transactionSerializer.serializeStatementOfAccountData(value);

      if (
        sections.find(
          value => value.title === serializedTransaction.formattedDate,
        )
      ) {
        sections.map(section => {
          if (section.title === serializedTransaction.formattedDate) {
            section.data.push(serializedTransaction);
            return;
          }
        });

        return;
      }

      sections.push({
        title: serializedTransaction.formattedDate,
        data: [serializedTransaction],
      });
    });

    return sections;
  }

  sortTransactions(transactions) {
    let sections = [];

    transactions?.map((value, index) => {
      const serializedTransaction = this.state.isHistoricalData
        ? this.transactionSerializer.serializeHistoricalData(value)
        : this.transactionSerializer.serializeApiData(value);

      if (
        sections.find(
          value => value.title === serializedTransaction.formattedDate,
        )
      ) {
        sections.map(section => {
          if (section.title === serializedTransaction.formattedDate) {
            section.data.push(serializedTransaction);
            return;
          }
        });

        return;
      }

      sections.push({
        title: serializedTransaction.formattedDate,
        data: [serializedTransaction],
      });
    });

    return sections;
  }

  async hardLoadUser() {
    const currentUserResponse = await this.platform.getCurrentUser();
    const currentUserResponseStatus = currentUserResponse.status;
    const currentUserResponseObj = currentUserResponse.response;

    if (currentUserResponseStatus === ERROR_STATUS) {
      this.setState({
        hardReloadFailed: true,
      });

      return new UserSerializer(JSON.parse(await loadData(USER)));
    }

    const currentUser = new UserSerializer(currentUserResponseObj);

    this.setState({
      currentUser,
    });

    console.log('HARDLOAD USER NUGAGEE', currentUser);

    await saveData(USER, currentUserResponseObj);

    return currentUser;
  }

  async doHardRefresh(doHardLoadUser = true, doHardLoadAgent = true) {
    this.setState({
      hardReloadFailed: null,
      isLoading: true,
      isHardLoading: true,
    });

    // flashMessage(null, 'Please, hold on...', CASUAL);
    // hard-load user because domain might have changed from APPLICANT
    const serializedUser = doHardLoadUser
      ? await this.hardLoadUser()
      : await this._loadUser();

    console.log({serializedUser}, 'SERIALIZED USER INSIDE HARDLOAD AGENT');

    if (serializedUser.isAgent) {
      if (!doHardLoadAgent) {
        this.setState({
          isLoading: false,
        });
      } else {
        await this.hardLoadAgent();
      }
      this._loadWallet(this._loadAgent(), this._loadUser());
    }

    if (serializedUser.isSuperAgent) {
      if (!doHardLoadAgent) {
        this.setState({
          isLoading: false,
        });
      } else {
        await this.hardLoadSuperAgent();
      }
    }

    if (serializedUser.isApplicant) {
      await this.hardLoadApplication();
    }

    await this.doSoftRefresh();

    this.setState({
      isLoading: false,
      isHardLoading: false,
    });
  }

  async navigateToApplication() {
    await saveData(PENDING_SCENE_AFTER_APPLICATION_SUBMISSION, 'HomeTabs');
    this.props.navigation.navigate('AggregatorLanding', {
      isAssisted: true,
    });

    // this.props.navigation.navigate("Application");
  }

  onFundWalletPress() {
    this.fundingWalletOptionsMenu.open();
  }

  renderItem(item, index) {
    return (
      <TransactionRow
        isHistoricalData={this.state.isHistoricalData}
        onPressOut={() =>
          this.props.navigation.navigate('TransactionSummary', {
            transaction: item,
          })
        }
        transaction={item}
      />
    );
  }

  renderSectionHeader(item) {
    return (
      <Text
        style={{
          backgroundColor: '#F3F3F4',
          lineHeight: 32,
          marginLeft: 0,
          paddingLeft: 16,
        }}>
        {item}
      </Text>
    );
  }

  renderStatementOfAccountItem(item, index) {
    return (
      <StatementOfAccountRow
        onPressOut={() =>
          this.props.navigation.navigate('StatementOfAccountDetails', {
            transaction: item,
          })
        }
        transaction={item}
      />
    );
  }

  renderStatementOfAccountTransactions() {
    if (this.state.isFetchingStatementOfAccount) {
      return (
        <View>
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
        </View>
      );
    }

    if (this.state.statementOfAccountTransactions === null) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    return !this.state.statementOfAccountTransactions.length ? (
      <View
        style={{
          padding: 20,
        }}>
        <Text center>Nothing to display.</Text>
      </View>
    ) : (
      <SectionList
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) =>
          this.renderStatementOfAccountItem(item, index)
        }
        renderSectionHeader={({section: {title}}) =>
          this.renderSectionHeader(title)
        }
        scrollEventThrottle={400}
        sections={this.state.statementOfAccountTransactions}
      />
    );
  }

  renderTransactionHistory() {
    if (this.state.isFetchingTransactions) {
      return (
        <View>
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
          <Skeleton.TransactionRow />
        </View>
      );
    }

    if (this.state.transactions === null) {
      return (
        <View
          style={{
            padding: 20,
          }}>
          <Text center>Something went wrong. Please, refresh the page.</Text>
        </View>
      );
    }

    return !this.state.transactions.length ? (
      <View
        style={{
          padding: 20,
        }}>
        <Text center>Nothing to display.</Text>
      </View>
    ) : (
      <SectionList
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index, section}) => this.renderItem(item, index)}
        renderSectionHeader={({section: {title}}) =>
          this.renderSectionHeader(title)
        }
        scrollEventThrottle={400}
        sections={this.state.transactions}
      />
    );
  }

  renderCarouselPagination() {
    const {activeSlide} = this.state;
    return (
      <Pagination
        dotsLength={2}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: COLOUR_WHITE,
          elevation: 1,
          paddingVertical: 20,
          paddingBottom: 10,
          marginTop: 0,
          marginBottom: 0,
        }}
        dotStyle={{
          width: 18,
          height: 18,
          borderRadius: 9,
          marginHorizontal: 8,
          backgroundColor: COLOUR_BLUE,
        }}
        inactiveDotOpacity={0.45}
        inactiveDotScale={0.7}
      />
    );
  }

  render() {
    const {
      account_opening_pilot_group,
      enable_account_opening,
      enable_card_linking,
      enable_sell_airtime,
      enable_sell_data,
      enable_sell_epin,
      enable_send_money,
      enable_pay_bills,
      enable_cash_in,
      internal_agents,
    } = this.props.remoteConfig;

    const statementOfAccountView = () => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingBottom: 2,
          }}>
          <Text bold>Ministatement</Text>
          <Hyperlink
            bold
            onPress={() => {
              this.props.navigation.navigate('StatementOfAccount', {
                category: 'Transactions',
              });
            }}>
            More
          </Hyperlink>
        </View>

        {this.renderStatementOfAccountTransactions()}
      </View>
    );

    const transactionHistoryView = () => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingBottom: 2,
          }}>
          <Text bold>Last transactions</Text>
          <Hyperlink bold href="ReportTransactions">
            More
          </Hyperlink>
        </View>

        {this.renderTransactionHistory()}
      </View>
    );

    return (
      <View
        style={{
          flex: 1,
        }}
        onTouchEnd={() =>
          this.props.isNavigatorVisible ? this.props.hideNavigator() : null
        }>
        <ContactUsOptionsMenu
          ref_={component => (this.contactUsOptionsMenu = component)}
          requestClose={() => this.contactUsOptionsMenu.close()}
        />

        <FundingWalletOptionsMenu
          navigation={this.props.navigation}
          ref_={component => (this.fundingWalletOptionsMenu = component)}
          requestClose={() => this.fundingWalletOptionsMenu.close()}
        />

        <EnableFingerprintPrompt
          ref_={component => (this.enableFingerprintPrompt = component)}
          requestClose={() => this.enableFingerprintPrompt.close()}
        />

        <RateThisAppMenu
          navigation={this.props.navigation}
          ref_={component => (this.rateThisAppMenu = component)}
          requestClose={() => this.rateThisAppMenu.close()}
        />
        {SHOW_CBN_COMPLIANCE && (
          <CbnRequirementUpdate
            navigation={this.props.navigation}
            kycCheckList={this.state.kycCheckList}
            updateCbnPromptModal={this.updateCbnPromptModal}
            showCbnPromptModal={this.state.showCbnPromptModal}
            onSkip={this.skipCbnPromptModal}
          />
        )}
        <BVNAlertMenu
          navigation={this.props.navigation}
          ref_={component => (this.bvnAlertMenu = component)}
          requestClose={() => this.bvnAlertMenu.close()}
        />

        <BVNAlertMenuSuspend
          navigation={this.props.navigation}
          ref_={component => (this.bvnAlertMenuSuspend = component)}
          requestClose={() => this.bvnAlertMenuSuspend.close()}
        />

        <BVNAlertPendingVerification
          navigation={this.props.navigation}
          ref_={component => (this.bvnAlertPendingVerification = component)}
          requestClose={() => this.bvnAlertPendingVerification.close()}
        />

        <NINAccountUpdate
          navigation={this.props.navigation}
          ref_={this.ninAccountUpdateAlertMenu}
          requestClose={() => this.ninAccountUpdateAlertMenu?.current?.close()}
        />

        <NINRestrictedAccount
          navigation={this.props.navigation}
          ref_={this.ninRestrictedAccountAlertMenu}
          requestClose={() =>
            this.ninRestrictedAccountAlertMenu.current?.close()
          }
        />
        {/* <ProvideKycModal
          navigation={this.props.navigation}
          showprovideKycModal={this.state.showprovideKycModal}
          onPressNext={() => {
            this.setState({ showprovideKycModal: false });
            this.props.navigation.navigate("CacBusinessNameDetails");
          }}
          onSkip={() => {
            this.setState({ showprovideKycModal: false });
          }}
        /> */}

        <View
          nativeID=""
          style={{
            backgroundColor: COLOUR_BLUE,
            flex: 1,
            height: '100%',
            position: 'absolute',
            width: '100%',
          }}>
          <Svg height="800" width="400" style={{top: 0}}>
            <Path
              d="M0 0H165C165 0 70.8098 30.7186 62.7442 95.4958C54.6785 160.273 150 257 150 257H0V0Z"
              fill={COLOUR_RED}
            />
          </Svg>

          <Svg
            fill="none"
            height="110"
            width="130"
            style={{position: 'absolute', top: 0, right: 0}}>
            <Path
              opacity="0.063399"
              d="M109 77C150.974 77 185 42.9736 185 1C185 -40.9736 150.974 -75 109 -75C67.0264 -75 33 -40.9736 33 1C33 42.9736 67.0264 77 109 77Z"
              stroke="white"
              strokeWidth="65"
            />
          </Svg>

          <Svg
            fill="none"
            height="105"
            width="60"
            style={{position: 'absolute', top: 0, left: 0}}>
            <Path
              clipRule="evenodd"
              d="M-10.5 90C20.1518 90 45 65.1518 45 34.5C45 3.8482 20.1518 -21 -10.5 -21C-41.1518 -21 -66 3.8482 -66 34.5C-66 65.1518 -41.1518 90 -10.5 90Z"
              fillRule="evenodd"
              stroke="#D81E1E"
              strokeWidth="30"
            />
          </Svg>

          <Svg
            width="48"
            height="59"
            style={{position: 'absolute', top: 190, left: 0}}
            fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.5 48C28.7173 48 37 39.7173 37 29.5C37 19.2827 28.7173 11 18.5 11C8.28273 11 0 19.2827 0 29.5C0 39.7173 8.28273 48 18.5 48Z"
              stroke="#D81E1E"
              strokeWidth="22"
            />
          </Svg>
        </View>

        <Header
          navigationIconColor={COLOUR_WHITE}
          rightComponent={
            <ClickableListItem
              onPress={() => this.doHardRefresh(true, true)}
              style={{
                alignItems: 'center',
                backgroundColor: '#ffffff35',
                borderRadius: 4,
                flexDirection: 'row',
                alignSelf: 'flex-end',
                justifyContent: 'center',
                // margin: 20,
                padding: 20,
                paddingLeft: 10,
                paddingVertical: 5,
                width: 110,
              }}>
              <Icon
                color={COLOUR_WHITE}
                name="refresh"
                size={22}
                containerStyle={{marginRight: 5}}
              />
              <Text white mid>
                Refresh
              </Text>
            </ClickableListItem>
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Dashboard"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
          withNavigator
        />

        {this.state.showNinUpdateBanner && (
          <NINAccountUpdateBanner navigation={this.props.navigation} />
        )}
        {/* Content */}
        <Animated.ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
          scrollEventThrottle={16}>
          {/* Top Section */}
          {(this.state.isOnboarded == false ||
            this.state.isSetupComplete == false ||
            this.state.isNewUser) && (
            <StatusCard
              agent={this.state.currentAgent}
              application={this.state.currentApplication}
              contactUsEmail={this.props.remoteConfig.contact_us_email_address}
              contactUsPhone={this.props.remoteConfig.contact_us_phone_number}
              contactUsWebpage={this.props.remoteConfig.contact_us_webpage}
              dismiss={() => {
                saveData(SHOW_STATUS_BAR, false);
                this.setState({
                  showStatusCard: false,
                });
              }}
              makeCallToAgentsMe={this.state.makeCallToAgentsMe}
              navigateToApplication={this.navigateToApplication}
              navigation={this.props.navigation}
              user={this.state.currentUser}
              isHardLoading={this.state.isHardLoading}
            />
          )}

          <View
            style={{
              justifyContent: 'flex-end',
              flex: 0.6,
              marginTop: 80,
              marginBottom: 10,
              paddingTop: 40,
            }}>
            <ServicesRow_
              account_opening_pilot_group={account_opening_pilot_group}
              enable_account_opening={enable_account_opening}
              enable_cash_in={enable_cash_in}
              enable_pay_bills={enable_pay_bills}
              enable_send_money={enable_send_money}
              enable_sell_airtime={enable_sell_airtime}
              enable_sell_data={enable_sell_data}
              enable_sell_epin={enable_sell_epin}
              enable_card_linking={enable_card_linking}
              internalAgents={account_opening_pilot_group}
              isDisabled={this.state.isDisabled || this.props.isDisabled}
              navigation={this.props.navigation}
            />

            <View
              style={{
                bottom: 140,
                position: 'absolute',
                height: 220,
                zIndex: 2,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Text
                  bold
                  style={{
                    borderLeftWidth: 5,
                    borderColor: 'white',
                    color: COLOUR_WHITE,
                    fontSize: FONT_SIZE_MID,
                    paddingLeft: 15,
                  }}>
                  My Balances
                </Text>
              </View>

              <ScrollView
                persistentScrollbar={true}
                contentContainerStyle={{
                  paddingBottom: 20,
                  paddingLeft: 20,
                  paddingTop: -10,
                }}
                contentOffset={{x: 15}}
                horizontal={true}
                snapToInterval={0.8 * WINDOW_WIDTH}>
                <BalanceCard
                  didLoadBalanceFail={this.state.didLoadWalletBalanceFail}
                  isDisabled={this.state.isDisabled}
                  isLoading={this.state.isLoadingWallet}
                  retry={() =>
                    this._loadWallet(this._loadAgent(), this._loadUser())
                  }
                  title="Ledger Balance"
                  amount={
                    this.state.wallet
                      ? this.state.wallet.ledger_balance
                      : '0.00'
                  }
                  buttonTitle="Fund"
                  buttonOnPressOut={this.onFundWalletPress}
                  timestamp={this.state.wallet.walletBalanceTimestamp}
                  key="ledgerBalance"
                  showAccountNo={
                    this.state.currentAgent?.staticAccounts ? true : false
                  }
                  accountNo={
                    this.state.currentAgent?.staticAccounts &&
                    this.state.currentAgent?.staticAccounts[0]?.accountNumber
                  }
                  bankName={
                    this.state.currentAgent?.staticAccounts &&
                    this.state.currentAgent?.staticAccounts[0]?.bankName
                  }
                  // accountNo={this.state.staticAccountNo || "123456789099"}
                  // bankName={this.state.staticAccountName  || "Wema Bank"}
                />
                <BalanceCard
                  didLoadBalanceFail={this.state.didLoadWalletBalanceFail}
                  isDisabled={this.state.isDisabled}
                  isLoading={this.state.isLoadingWallet}
                  retry={() =>
                    this._loadWallet(this._loadAgent(), this._loadUser())
                  }
                  title="Available Amount"
                  amount={
                    this.state.wallet
                      ? this.state.wallet.current_balance
                      : '0.00'
                  }
                  timestamp={this.state.wallet.walletBalanceTimestamp}
                  key="currentBalance"
                />
                <BalanceCard
                  didLoadBalanceFail={this.state.didLoadWalletBalanceFail}
                  isDisabled={this.state.isDisabled}
                  isLoading={this.state.isLoadingWallet}
                  retry={() =>
                    this._loadWallet(this._loadAgent(), this._loadUser())
                  }
                  title="Commissions Earned"
                  amount={
                    this.state.wallet
                      ? this.state.wallet.commissions_earned
                      : '0.00'
                  }
                  buttonTitle="Unload"
                  buttonOnPressOut={() =>
                    this.props.navigation.navigate('UnloadCommission')
                  }
                  timestamp={this.state.wallet.walletBalanceTimestamp}
                />
                <BalanceCard
                  didLoadBalanceFail={this.state.didLoadSettlementBalanceFail}
                  isDisabled={this.state.isDisabled}
                  isLoading={this.state.isLoadingWallet}
                  retry={() =>
                    this._loadWallet(this._loadAgent(), this._loadUser())
                  }
                  title="Unsettled Commission"
                  amount={
                    this.state.wallet
                      ? this.state.wallet.unsettled_balance
                      : '0.00'
                  }
                  buttonTitle="Transactions"
                  buttonOnPressOut={() =>
                    this.props.navigation.navigate('CommissionsEarned')
                  }
                  timestamp={this.state.wallet.walletBalanceTimestamp}
                />
              </ScrollView>
            </View>
          </View>

          {this.state.showPosBanner &&
            this.props.remoteConfig.enable_pos_request === true && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#EBF8FE',
                  maxHeight: '15%',
                  paddingVertical: 20,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  marginBottom: 15,
                  marginHorizontal: 15,
                  borderRadius: 5,
                }}>
                <View
                  style={{
                    width: '30%',
                    height: '100%',
                    transform: [{scale: 1.3}],
                  }}>
                  <Image
                    source={require('../../../../../../../assets/media/images/pos.png')}
                    style={{
                      resizeMode: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </View>
                <View
                  style={{
                    width: '70%',
                  }}>
                  <Text bold big style={{color: COLOUR_BLACK, marginBottom: 5}}>
                    Received your POS?
                  </Text>
                  <Text style={{color: COLOUR_BLACK, marginBottom: 10}}>
                    Enter your terminal ID to activate your POS
                  </Text>
                  <ClickableListItem
                    onPress={() => {
                      this.props.navigation.navigate(
                        'PosConcorConfirmationScene',
                      );
                    }}>
                    <Text
                      bold
                      big
                      style={{
                        color: '#00B8DE',
                        textDecorationLine: 'underline',
                        textDecorationStyle: 'solid',
                        textDecorationColor: '#00B8DE',
                      }}>
                      Activate Here
                    </Text>
                  </ClickableListItem>
                </View>
              </View>
            )}
          {this.renderCarouselPagination()}

          <Carousel
            data={[transactionHistoryView, statementOfAccountView]}
            onSnapToItem={index => this.setState({activeSlide: index})}
            ref={c => {
              this._carousel = c;
            }}
            renderItem={({item: viewFunc}) => (
              <>
                <View
                  style={{
                    backgroundColor: 'white',
                    flex: 0.4,
                  }}>
                  {viewFunc()}
                </View>
              </>
            )}
            sliderWidth={WINDOW_WIDTH}
            itemWidth={WINDOW_WIDTH}
          />
        </Animated.ScrollView>

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
        {/* this.state.hardReloadFailed ===  */}
        {this.state.hardReloadFailed === true && !this.state.isLoading && (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: `${COLOUR_BLUE}CC`,
              height: '100%',
              justifyContent: 'center',
              padding: 20,
              position: 'absolute',
              width: '100%',
              zIndex: 1,
            }}>
            <Text bold center white>
              Oops!
            </Text>
            <Text bigger bold center white>
              An error occured. {'\n'}Please, try again.
            </Text>

            <Button
              containerStyle={{
                alignSelf: 'center',
                backgroundColor: 'white',
                marginTop: 30,
                width: '80%',
              }}
              loading={this.state.isLoading}
              title="RETRY"
              titleStyle={{
                color: COLOUR_BLUE,
              }}
              onPressOut={this.doHardRefresh}
            />
            <Button
              containerStyle={{
                alignSelf: 'center',
                backgroundColor: 'white',
                // marginTop: 30,
                width: '80%',
              }}
              loading={this.state.isLoading}
              title="Contact Support"
              transparent
              onPressOut={() => this.contactUsOptionsMenu.open()}
            />

            <View
              style={{
                bottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                width: '100%',
              }}>
              <Button
                onPress={() => {
                  this.setState({hardReloadFailed: null});
                  NavigationService.replace('Logout');
                }}
                title="Logout"
                transparent
              />
              <Button
                onPress={() => this.setState({hardReloadFailed: null})}
                title="Cancel"
                transparent
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFastRefreshPending: state.tunnel.isFastRefreshPending,
    isNavigatorVisible: state.navigation.isNavigatorVisible,
    navigationState: state.tunnel.navigationState,
    screenAfterLogin: state.tunnel.screenAfterLogin,
    remoteConfig: state.tunnel.remoteConfig,
    requeryTransactionBucket: state.tunnel.requeryTransactionBucket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideNavigator: () => dispatch(hideNavigator()),
    setIsFastRefreshPending: value => dispatch(setIsFastRefreshPending(value)),
    setScreenAfterLogin: screen => dispatch(setScreenAfterLogin(screen)),
    showNavigator: () => dispatch(showNavigator()),
    navigateTo: message => dispatch(navigateTo(message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
