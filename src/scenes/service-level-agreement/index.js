import React from 'react';
import {ScrollView, View} from 'react-native';

import moment from 'moment';
import {CheckBox, Icon} from 'react-native-elements';

import {AsyncStorage} from 'react-native';
import Button from '../../components/button';
import Header from '../../components/header';
import Modal from '../../components/modal';
import Text from '../../components/text';
import {APPLICATION} from '../../constants';
import {SUCCESS_STATUS} from '../../constants/api';
import {CASUAL} from '../../constants/dialog-priorities';
import {
  APPLICATION_FROM_DASHBOARD,
  APPLICATION_SELF_ONBOARDING,
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_WHITE,
  CONTENT_LIGHT,
  FONT_SIZE_MID,
} from '../../constants/styles';
import Onboarding from '../../services/api/resources/onboarding';
import {flashMessage} from '../../utils/dialog';
import {loadData} from '../../utils/storage';

export default class ServiceLevelAgreement extends React.Component {
  onboarding = new Onboarding();

  async componentDidMount() {
    const {selfOnboarding, isFromDashboard} = this.props.route?.params || {};
    this.setState({
      selfOnboarding,
      isFromDashboard,
    });
    this.loadApplicationToState();
    const applicationFromDashboard = await AsyncStorage.getItem(
      APPLICATION_FROM_DASHBOARD,
    );
    this.setState({
      applicationFromDashboard: JSON.parse(applicationFromDashboard),
    });
  }

  constructor() {
    super();

    this.state = {
      application: null,
      iAgree: false,
      isLoading: true,
      selfOnboarding: false,
      isFromDashboard: false,
      showSuccessModal: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.loadApplicationToState = this.loadApplicationToState.bind(this);
  }

  async loadApplicationToState() {
    const application = JSON.parse(
      await loadData(
        this.state.selfOnboarding == true
          ? APPLICATION_SELF_ONBOARDING
          : APPLICATION,
      ),
    );
    console.log('APPLICATION IS: ', application);

    this.setState({
      application,
      isLoading: false,
    });
  }

  async onSubmit() {
    this.setState({
      isLoading: true,
    });

    const application = await loadData(
      this.state.selfOnboarding == true
        ? APPLICATION_SELF_ONBOARDING
        : APPLICATION,
    );

    console.log(application, 'NUGAGEE APPLICATION SUBBMISION FORM');
    const {status, response, code} = await this.onboarding.submit(
      application,
      this.state.selfOnboarding,
    );

    console.log({status, response, code}, 'NUGAGEE SUBMISSION RESPONSE');

    if (status === SUCCESS_STATUS) {
      if (this.state.selfOnboarding == true) {
        this.setState({
          isLoading: false,
          showSuccessModal: true,
        });
      } else {
        this.setState({
          isLoading: false,
          successfullySubmitted: true,
        });
      }

      return;
    }
    flashMessage(null, response.description, CASUAL);
    this.setState({
      isLoading: false,
    });
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({showSuccessModal: false});
              this.state.applicationFromDashboard == true
                ? this.props.navigation.replace('Agent')
                : this.props.navigation.replace('Login');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
              backgroundColor: COLOUR_BLUE,
            },
            title:
              this.state.applicationFromDashboard == true
                ? 'Continue to Dashboard'
                : 'Continue to Login',
          },
        ]}
        content={
          <View
            style={{
              flex: 0.6,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <Text big center style={{textAlign: 'center'}}>
              Congratulations!{' '}
            </Text>
            <Text mid center style={{textAlign: 'center', color: COLOUR_GREY}}>
              You are now a Quickteller Agent.{' '}
            </Text>
          </View>
        }
        image={require('../../assets/media/images/clap.png')}
        isModalVisible={true}
        size="md"
        title="Sign up"
        withButtons
        hideCloseButton
      />
    );
  }

  render() {
    const currentDate = moment();

    const currentDayNumberFormatted = currentDate.format('Do');
    const currentMonthNameFull = currentDate.format('MMMM');
    const currentYearFull = currentDate.format('YYYY');

    if (this.state.successfullySubmitted) {
      try {
        // this.props.navigation.replace("Login");
        this.props.navigation.replace('Agent');
      } catch {
        null;
      }

      try {
        this.props.navigation.replace('HomeTabs');
      } catch {
        null;
      }

      return <React.Fragment />;
    }

    return (
      <View style={{flex: 1}}>
        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="Service Level Agreement"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        {this.state.showSuccessModal && this.successModal}

        <ScrollView contentContainerStyle={{padding: 10}}>
          <View>
            <Text>
              <Text bold>THIS IFIS AGENT SERVICE LEVEL AGREEMENT</Text>("This
              Agreement") is made this day {currentDayNumberFormatted} day of{' '}
              {currentMonthNameFull} {currentYearFull} BETWEEN:
            </Text>
          </View>
          <View>
            <Text>
              <Text bold>Interswitch Financial Inclusion Services</Text> a
              limited liability company incorporated under the laws of the
              Federal Republic of Nigeria and having its principal office at 15B
              Oko Awo Street, Victoria Island, Lagos State, (hereinafter
              referred to as “IFIS” which expression shall include its
              successors in title and assigns); AND{' '}
              {this.state.application
                ? this.state.application.applicantDetails.firstName
                : null}
              ,{' '}
              {this.state.application
                ? this.state.application.applicantDetails.surname
                : null}{' '}
              (Hereinafter referred to as “the Agent” and which expression shall
              include the Agent’s successors in title and permitted assigns).
              (IFIS and the Agent shall be collectively referred to as “the
              Parties” or individually as “a Party”).{'\n\n'}
            </Text>
          </View>
          <View>
            <Text bold>WHEREAS{'\n'}</Text>
            <Text>
              A. IFIS is duly licensed by the Central Bank of Nigeria (CBN) as a
              super-agent under Super Agent Banking regulations to provide
              financial services relating to registration of customers, cash-in,
              cash-out, bills payments, airtime recharge, funds transfer and
              other services that may be rolled out under the scheme from time
              to time.{'\n'}
            </Text>
            <Text>
              B. The CBN through its guidelines has provided for agent banking
              as a delivery channel for banking and related Authorized Services.
              {'\n'}
            </Text>
            <Text>
              C. The Agent is an entity that has been contracted to provide
              banking and related services under the guidelines of agent
              banking.{'\n'}
            </Text>
            <Text>
              D. The Agent has represented that it has the requisite skills,
              knowledge, experience, capability and all necessary personnel and
              facilities and are competent to provide the Authorized Services
              within the specified geographical area.{'\n'}
            </Text>
            <Text>
              E. The Parties wish to enter into this Agreement to set out the
              rights and obligations of each party under the Agent Banking
              Business.{'\n'}
            </Text>
            <Text>
              NOW, THEREFORE, in consideration of these recitals, the Parties
              agree as follows:{'\n'}
            </Text>
            <Text>
              <Text bold>1. DEFINITIONS{'\n'}</Text>
              In this Agreement unless the context otherwise requires, the
              following words and expressions shall have the following meanings;
              {'\n'}
            </Text>
            <Text>
              <Text> 1.1.“Agent’s Account”</Text> means the account established
              for the transactions and payment of Commissions in respect of the
              Services as hereinafter detailed.{'\n'}
              <Text>1.2. “Agreement Period” </Text>shall mean the initial period
              of twelve (12) months from the Effective Date and thereafter,
              renewed automatically annually unless earlier terminated in
              accordance with the provisions of this Agreement.{'\n'}
            </Text>
            <Text>
              <Text>1.3. "Applicable Law"</Text> means applicable laws of the
              Federal Republic of Nigeria including statutes, regulations,
              regulatory guidelines and judicial or administrative
              interpretations, any rules or requirements established by IFIS
              including any amendments or enactments thereto and any
              corresponding earlier enactment still in force, and subordinate
              legislation made under a statutory provision.{'\n'}
            </Text>
            <Text>
              <Text>1.4. “Authorization” </Text>means a process through which a
              transaction is approved, or confirmation is provided to the Agent
              that a transaction is successfully completed.{'\n'}
              <Text />
              <Text>1.5. “Authorization Code” </Text> means a code provided to
              the Agent to indicate approval.{'\n'}
            </Text>
            <Text>
              <Text>1.6. “Authorized Services”</Text> means the services the
              Agent is authorized to offer in accordance with the provisions of
              this Agreement.{'\n'}
            </Text>
            <Text>
              <Text>1.7. “Commissions” </Text>means the detailed transaction
              charges for the Services and the approved commissions to be earned
              by the Agent in the course of providing the Services as agreed by
              the Parties.{'\n'}
            </Text>
            <Text>
              <Text>1.8. “Confidential Information”</Text> means all information
              and data provided under this Agreement by any person or entity,
              whether or not in material form, whatsoever and howsoever derived
              or acquired relating to agency banking and Services and all other
              confidential or secret information disclosed by or on behalf of
              either party to the other including the terms of this Agreement.
              {'\n'}
            </Text>
            <Text>
              <Text>1.9. “Customers” </Text>shall mean any users of the agency
              banking service.{'\n'}
            </Text>
            <Text>
              <Text>1.10. “Customer Data"</Text> means all information, whether
              personally identifiable or in aggregate, that is submitted and/or
              obtained as a result of a Customer relationship.{'\n'}
            </Text>
            <Text>
              <Text>1.11. “Effective Date” </Text>means the date of execution of
              this Agreement.{'\n'}
            </Text>
            <Text>
              <Text>1.12. “E-value” </Text>means the electronic value recorded
              in an IFIS Agent’s account, which shall represent the Agent’s
              entitlements to an equivalent amount of the cash amount held in
              the settlement bank account{'\n'}
            </Text>
            <Text>
              <Text>1.13. "Marketing Materials” </Text>means badges, links,
              sponsored e-mails, micro-sites, splash pages, other placements on
              the web sites, and trade, broadcast or banner advertisements,
              press communications, and any elements, physical or otherwise,
              designed to promote the agent banking and financial inclusion
              services.{'\n'}
            </Text>
            <Text>
              1.14. “User’s ID” means a person’s original Nigerian Identity Card
              or original Passport or any other acceptable ID.{'\n'}
            </Text>
            <Text>
              1.15. “Outlet(s)” means the physical address(es) of each place of
              business from which the Agent may provide the Services to
              Customers, which addresses shall be mutually agreed between the
              Parties.{'\n'}
            </Text>
            <Text>
              1.16. “Trademarks & Trade names” shall include without limitation
              all associated trademarks and logos which have been assigned to
              the Services which may only be used by the Agent in accordance
              with the terms of this Agreement.{'\n'}
            </Text>
            <Text>
              1.17. “Transactions” means (as the context requires) receiving
              cash or e-value from Customers and paying out cash sums or e-value
              credits to Customers in accordance with agency guidelines and
              shall also include, fund transfers and liquidation of tokens that
              require exchange of cash on the IFIS platform.{'\n'}
            </Text>
            <Text>
              1.18. “Transaction Limits” means the cash limits placed on the
              transactions that may be effected by Agents from specific Outlets
              as specified.{'\n\n'}
            </Text>
            <Text>
              <Text bold>2. APPOINTMENT{'\n'}</Text>
              2.1. IFIS hereby appoints the Agent to offer the Authorized
              Services on its behalf for the duration of the Agreement Period at
              the Agent’s authorized Outlet(s) and geographical area of
              operation, as may be specified from time to time. The Agent shall
              be required to obtain written consent, which consent shall not be
              unreasonably withheld and is subject to the CBN’s approval, at
              least forty-five (45) days before effecting change of Outlet(s)
              and/or geographical area of operation.{'\n'}
            </Text>
            <Text>
              2.2. The Agent shall designate a particular counter within each
              Outlet for agent banking and financial inclusion services. The
              counter shall be manned by a designated authorized primary
              operator who shall be duly authorized to conduct the operations of
              the Agency business. The application for authorization shall be
              done by completing and submitting to IFIS the Agent Application
              form.{'\n'}
            </Text>
            <Text>
              2.3. It is understood by the Parties that the Agent shall not hold
              out itself as an agent or representative of IFIS. The Agent will
              ensure that it conforms to all the existing Applicable Laws.
              {'\n\n'}
            </Text>
            <Text>
              <Text bold>3. CUSTOMER SERVICE STANDARDS{'\n'}</Text>
              3.1. The Agent shall be required to comply with the Customer
              Services Standards and rules in respect of the Authorized Services
              as provided by IFIS from time to time.{'\n'}
            </Text>
            <Text>
              3.2. Upon seven (7) days’ notice to the Agent to remedy breach of
              the customer service standards as provided or any other breaches,
              IFIS reserves the right to terminate the Agent’s appointment
              immediately for noncompliance with the stipulated customer service
              standards.{'\n\n'}
            </Text>
            <Text>
              <Text bold>4. TERMS OF APPROVAL OF A TRANSACTION{'\n'}</Text>
              4.1. A Transaction shall be deemed to be successful once the
              notification as stipulated in the procedure has been duly received
              by the Agent.{'\n'}
            </Text>
            <Text>
              4.2. In the event of a dispute between the Agent and a customer on
              whether a transaction was successful or unsuccessful, the Agent
              shall refer the matter to IFIS who shall confirm whether the
              transaction was successful or not and determine the appropriate
              action.{'\n'}
            </Text>
            <Text>
              4.3. In the event that any costs or loss is incurred and arises
              from such disputed Transactions as a result of the Agent’s
              non-compliance with the laid down procedures herein, the Agent
              will indemnify IFIS and any other party that shall have suffered
              such loss as a result of the Agent’s acts or omissions.{'\n\n'}
            </Text>
            <Text>
              <Text bold>5. VERIFICATION OF CUSTOMER’S IDENTITY{'\n'}</Text>
              5.1. The Agent shall apply diligence in validating a Customer’s
              identity and Transactions to avoid entering into fraudulent
              transactions or dealing with fraudsters.{'\n'}
            </Text>
            <Text>
              5.2. The Agent shall comply with the prescribed customer
              identification procedures.{'\n\n'}
            </Text>
            <Text>
              <Text bold>6. RECORD KEEPING{'\n'}</Text>
              All Agents are required to keep proper records in relation to
              their provision of the Authorized Services, including the
              registration particulars of each Customer for a minimum period of
              five (5) years after consummation of each transaction.{'\n\n'}
            </Text>
            <Text>
              <Text bold>7. TRANSACTION LIMIT{'\n'}</Text>
              7.1. The Agent shall comply with the cash Transaction limit with
              regard to a single Transaction and daily limit in line with
              regulatory provisions.{'\n'}
            </Text>
            <Text>
              7.2. Any Transactions above the allowable Transaction limit shall
              be declined.{'\n'}
            </Text>
            <Text>
              7.3. Where a Customer wishes to transact above the Agents
              specified limit, the Agent shall refer the Customer to IFIS.{'\n'}
            </Text>
            <Text>
              7.4. The Agent shall not set any Transaction limits other than the
              specified Agent Transaction limits under the Agreement.{'\n\n'}
            </Text>
            <Text>
              <Text bold>8. AGENT PROHIBITED ACTIVITIES{'\n'}</Text>
              8.1. The Agent shall NOT engage in any of the following prohibited
              activities:{'\n'}
              8.1.1. Operate when there is communication or network failure in
              the system.{'\n'}
              8.1.2. Subcontract another entity to carry out Agent banking on
              its behalf without obtaining prior consent from IFIS.{'\n'}
              8.1.3. Carry out offline Transactions or carry out a Transaction
              when a transactional receipt or acknowledgement cannot be
              generated.{'\n'}
              8.1.4. Charge fees outside the specified tariffs directly to the
              customers{'\n'}
              8.1.5. Carry on business when the Agents existing business has
              ceased or the turnovers have, in the opinion of IFIS,
              significantly diminished.{'\n'}
              8.1.6. Offer any type of guarantee in favour of the Customers.
              {'\n'}
              8.1.7. Offer banking services on its own accord (i.e. it shall not
              provide on its own account financial/banking services similar to
              those provided by it under the agency contract).{'\n'}
              8.1.8. Provide, render or hold itself out to be providing or
              rendering any banking service which is not specifically permitted
              under this Agreement.{'\n'}
              8.1.9. Continue with the agency business when the Agent [or any of
              its directors] has a criminal record or disciplinary case
              involving fraud, dishonesty or any other financial impropriety.
              {'\n'}
              8.1.10. Approve any loan on behalf of a bank.{'\n'}
              8.1.11. Maintain a till in excess of N100,000 at any particular
              point in time.{'\n'}
              8.1.12. Accept cheque deposits from customers and cash cheque(s).
              {'\n'}
              8.1.13. Transact in foreign currency or decline any transactions
              on the basis of race, age, religion, gender, or politics.{'\n'}
              8.1.14. Provide cash advances.{'\n'}
              8.1.15. Hire an existing IFIS or related enterprises employee or
              associate to run or manage its business without prior written
              consent of IFIS.{'\n'}
              8.1.16. Paying cash to any staff or representative of IFIS for
              deposit into the Agent’s wallet, POS terminal and/or any IFS-
              related service.{'\n\n'}
            </Text>
            <Text>
              <Text bold>9. THE AGENT SHALL:{'\n'}</Text>
              9.1. Fulfil all documentary submissions requested and commit to
              such being true and dependable.{'\n'}
              9.2. Ensure that its respective electronic money accounts are
              funded.{'\n'}
              9.3. Use only recommended channels to make payment for IFIS
              services.{'\n'}
              9.4. Furthermore, the Agent shall display the following in a
              conspicuous location in the Agents Outlet(s):{'\n'}
              9.4.1. The Agent ID.{'\n'}
              9.4.2. A list of the Services offered by the Agent as approved in
              writing.{'\n'}
              9.4.3. A notice to the effect that the Authorized Services shall
              be provided subject to availability of funds.{'\n'}
              9.4.4. A notice to the effect that if the electronic system is
              down, no transaction shall be carried out.{'\n'}
              9.4.5. The certificate of appointment for the commercial activity
              being undertaken by the Agent.{'\n'}
              9.4.6. The tariff guide applicable from time to time and payable
              to the scheme provider by the Customers.{'\n'}
              9.4.7. Days and hours of operation.{'\n'}
              9.4.8. IFIS’ dedicated customer service telephone number.{'\n'}
              9.4.9. Must report any suspicious transaction observed.{'\n'}
              9.5. The Agent shall from time to time provide such required
              information for purposes of complying with regulatory reporting
              obligations, or any other information that may be reasonably
              required concerning the activities under this Agreement. The
              information should be supplied within the requested timelines and
              in the specified format.{'\n'}
            </Text>
            <Text>
              9.6. The Agent shall be required to maintain a transaction record
              book, being evidence of every Transaction undertaken in the
              specified format or in such manner as shall be required. The
              transaction record book shall be the property of IFIS and shall be
              returned by the Agent upon the termination of this Agreement or
              when it is full before a new transaction record book is issued.
              {'\n'}
            </Text>
            <Text>
              9.7. The Agent shall retain the transaction data for a period of
              five (5) years from the transaction date or such period as shall
              be advised to the Agent from time to time. The record shall
              contain the following information;{'\n'}
            </Text>
            <Text>
              9.7.1. Date;{'\n'}
              9.7.2. Agent ID;{'\n'}
              9.7.3. Transaction ID (from the electronic or printed receipt);
              {'\n'}
              9.7.4. Transaction type;{'\n'}
              9.7.5. Transaction Value;{'\n'}
              9.7.6. Customer name and ID; and{'\n'}
              9.7.7. Customer’s signature.{'\n'}
              9.8. The Agent shall take all reasonable steps to protect the good
              name and reputation of IFIS and the Authorized Services.{'\n'}
            </Text>
            <Text>
              9.9. The Agent shall promote the products and the Authorized
              Services in order to help IFIS grow its agent banking services.
              {'\n'}
            </Text>
            <Text>
              9.10. The Agent shall not directly or indirectly be involved or
              knowingly or recklessly or negligently permit any other person to
              be involved in any fraud and shall notify the IFIS immediately
              upon becoming aware of any fraud or suspicious activities.{'\n'}
            </Text>
            <Text>
              9.11. The Agent will implement, without delay, and comply with
              such procedures and rules concerning fraud as shall be advised by
              IFIS from time to time to protect the integrity of IFIS and the
              provision of the Services. IFIS affirms its right to authorize
              withholding Agent payments pending investigation where fraudulent
              activity is suspected or confirmed. Such withheld funds will be
              used to offset fraud-related chargebacks from Customers.{'\n'}
            </Text>
            <Text>
              9.12. The Agent agrees to hold in confidence this Agreement and
              all information, documentation, data and know-how disclosed to it
              by IFIS and/or in pursuance of the Service and shall not disclose
              to any third party or use Confidential Information other than in
              connection with the performance of this Agreement or any part
              thereof without the prior consent of IFIS.{'\n'}
            </Text>
            <Text>
              9.13. The Agent shall not use the information obtained from the
              Customers who subscribe to the Services in any other way other
              than in furtherance of this Agreement.{'\n'}
            </Text>
            <Text>
              9.14. The Agent shall not split a transaction by requiring the
              customer to undertake numerous transactions in place of a single
              transaction requested by the customer in order to increase the
              Agents’ commissions.{'\n'}
            </Text>
            <Text>
              9.15. The Agent shall only use Trademarks and Trade names for the
              purpose of promoting and providing the Authorized Services during
              the Agreement Period and for no other purpose whatsoever.{'\n'}
            </Text>
            <Text>
              9.16. The Agent shall comply with the terms of all Schedules to
              this Agreement as may be updated from time to time.{'\n\n'}
            </Text>
            <Text>
              <Text bold>10. FEES AND COMMISSIONS{'\n'}</Text>
              10.1. Transaction fees chargeable to customers for the Authorized
              Services shall be charged in accordance with the tariff guide on
              fees and commission.{'\n'}
            </Text>
            <Text>
              10.2. The Agent shall receive commissions due to it at such
              interval as shall be determined by IFIS. The commission structure
              is attached as an annexure to this Agreement.{'\n'}
            </Text>
            <Text>
              10.3. The Agent agrees that a right of set off shall exist against
              the Agent’s Account for any amounts owed by the Agent to IFIS.
              {'\n'}
            </Text>
            <Text>
              <Text bold>11. SECURITY AND INSURANCE{'\n'}</Text>
              11.1. The Agent shall be responsible for maintaining such security
              safeguards to ensure the operating environment is secure as well
              as to obtain suitable and secure safes, cabinets as are necessary
              for the Authorized Services offered.{'\n'}
              11.2. The Agent will keep in its care material and equipment
              entrusted to it by IFIS.{'\n'}
              11.3. The Agent will mark or identify the materials as the
              property of IFIS and shall be responsible for its safe keeping.
              {'\n'}
              11.4. IFIS may from time to time stipulate the minimum-security
              standards.{'\n'}
              11.5. IFIS shall take out necessary insurance policy to safeguard
              cash-in in possession of the Agent at Agent locations in line with
              the provisions of agency banking guidelines.{'\n'}
              11.6. IFIS shall not be liable for any loss suffered by the Agent
              arising from insecurity or any other means not covered by IFIS’
              insurance policy taken on the Agent’s business.{'\n\n'}
            </Text>
            <Text>
              <Text bold>12. MARKETING AND PROMOTION{'\n'}</Text>
              12.1. IFIS shall ensure the supply to the Agent of branding and
              advertising support materials such as external signage, the banks’
              posters and internal point of sale material for the Authorized
              Services.{'\n'}
              12.2. For the avoidance of doubt, materials that have been
              supplied to the Agent shall not be deemed the property of the
              Agent and shall be returned to IFIS upon demand or upon
              termination of this Agreement.{'\n'}
              12.3. The Agent shall conspicuously display the logos and the
              branding relating to the Authorized Services as prescribed herein
              within and outside the Outlets of the Agent and at the counter
              designated for the Agency program.{'\n'}
              12.4. The Agency Program Operator should also be easily
              identifiable from any customer or any other person within the
              agent premises.{'\n'}
              12.5. The Agent shall not use any promotional material whatsoever
              to advertise the Services unless such material is supplied by or
              approved in writing.{'\n\n'}
            </Text>
            <Text>
              <Text bold>13. TERMINATION{'\n'}</Text>
              13.1. Without prejudice to any rights of the Parties in respect of
              any breach of any of the provisions herein contained, this
              Agreement shall terminate if either of the Parties shall have
              served on the other in writing thirty (30) days prior notice of
              termination and all financial issues and accounts are settled by
              and with the Agent.{'\n'}
              13.2. This Agreement shall terminate forthwith upon occurrence of
              any of the following events:{'\n'}
              13.2.1. If the Agent becomes bankrupt or insolvent or convenes a
              meeting of, or makes or proposes to make, any arrangement or
              composition with its creditors or has a liquidator, receiver,
              administrator, manager, trustee similar officer appointed over any
              of its assets or is either compulsory or voluntarily wound up; or
              {'\n'}
              13.2.2. If the Agent ceases or threatens to cease to carry on
              business for whatever reason or the Agent’s account becomes
              dormant;{'\n'}
              13.2.3. If the Agent breaches any terms of the agreement as agreed
              between IFIS and the Agent;{'\n'}
              13.2.4. If the Agent violates a provision of the guidelines
              prohibiting carrying on business;{'\n'}
              13.2.5. When the Agent’s commercial activity has ceased;{'\n'}
              13.2.6. Where the Agent is guilty of a criminal offence involving
              fraud, dishonesty or other financial impropriety;{'\n'}
              13.2.7. When the agent sustains a loss or damage (financial or
              material) to such a degree as to make it impossible in IFIS’ sole
              discretion for the agent to gain his financial soundness within
              one month from the date of the damage or loss;{'\n'}
              13.2.8. If an agent who is a natural person dies or becomes
              mentally incapacitated;{'\n'}
              13.2.9. If an Agent transfers, relocates or closes its place of
              agent banking business without prior written consent of IFIS;
              {'\n'}
              13.2.10. If an Agent fails to hold or renew a valid business
              license;{'\n'}
              13.2.11. If the Central Bank of Nigeria terminates the Agreement
              in the exercise of its powers under the Central Bank of Nigeria
              Act 2007, Banks and Other Financial Institutions Act, applicable
              Agency Guidelines issued by the CBN or any other applicable law;
              or{'\n'}
              13.2.12. If in the opinion of IFIS, the Agent does not have the
              capacity to separate the business lines of each separate agent
              network from the Services contemplated under this Agreement.{'\n'}
              13.3 The rights to terminate this Agreement given by this clause
              shall be without prejudice to any other right or remedy of either
              party in respect of the breach concerned (if any) or any other
              breach.{'\n\n'}
            </Text>
            <Text>
              <Text bold>14. PROCESS UPON TERMINATION{'\n'}</Text>
              14.1. Upon the breach, termination or expiration of this
              Agreement, the provisions of this sub-section shall apply and,
              consistent with the following:{'\n'}
              14.1.1. The Agent and IFIS shall work together to ensure an
              orderly termination of the Agency Program and to settle all
              financial issues and accounts.{'\n'}
            </Text>
            <Text>
              14.1.2. The Agent shall promptly return to IFIS any equipment
              and/or materials that have been supplied to the Agent.{'\n'}
              14.1.3. Each Party shall promptly reconcile its accounts and pay
              any monies owed to the other Party.{'\n'}
              14.1.4. IFIS reserves the right to advice the public of the
              termination of the Agent in its network.{'\n'}
              14.1.5. The Agent shall not claim against IFIS for any loss of
              goodwill or profits.{'\n'}
              14.1.6. The clauses on intellectual property, confidentiality and
              warranties and indemnities shall survive such termination.{'\n'}
              14.2. The failure of either Party to enforce or to exercise at any
              time or for any period any term of or any right pursuant to this
              Agreement shall not be construed as a waiver of any term or right
              and shall in no way affect that party’s right later to enforce or
              exercise it.{'\n'}
              14.3. Any rights of either Party accrued at the time of
              termination of the Agreement or the enforcement of any breaches of
              the Agreement shall survive the termination of the Agreement.
              {'\n\n'}
            </Text>
            <Text>
              <Text bold>15. NOTICES/APPROVALS{'\n'}</Text>
              15.1. All notices and approvals required under this Agreement
              shall be in writing, and shall be deemed delivered to the Agent
              when sent by either of the following means:{'\n'}
              15.1.1. By letter through registered mail to the address provided
              in the Agreement;{'\n'}
              15.1.2. A confirmed postal address;{'\n'}
              15.1.3. Short message service (SMS) to the number provided by the
              Agent{'\n'}
              15.1.4. Sent to the e-mail address provided by the Agent.{'\n'}
              15.1.5. Notices sent by registered mail shall be deemed to be
              served three (3) Working Days following the day of posting.{'\n'}
              15.1.6. Notices sent by e-mail or short message service shall be
              deemed to be served on the day of transmission.{'\n'}
              15.1.7. Notice to IFIS shall be in writing and sent by letter and
              shall be deemed to be delivered when hand delivered to the
              attention of Head, Business Value Realization, IFIS, 15B Oko Awo
              Street, Victoria Island, Lagos.{'\n\n'}
            </Text>
            <Text>
              <Text bold>16. NO GUARANTEED INCOME{'\n'}</Text>
              No warranties or representations are made with regard to potential
              revenues that may be earned by the Agent from the provision of the
              Agent Banking and no reliance should be placed on any statements
              or projections provided by IFIS, whether verbally or in writing in
              this respect.{'\n\n'}
            </Text>
            <Text>
              <Text bold>17. RIGHT OF SET-OFF{'\n'}</Text>
              17.1. IFIS or its principal bank shall have the right at all times
              to offset any sums owed to it by the Agent against any sums due
              from IFIS or its principal bank to the Agent under this Agreement.
              {'\n\n'}
            </Text>
            <Text>
              <Text bold>18. DISCLAIMER{'\n'}</Text>
              18.1. Agent’s Wallet PIN, Password and One-time-Password (OTP) are
              personal to the Agent and should never be shared with any third
              party, staff of IFIS or anybody claiming to be a staff or
              representative of IFIS or any of its affiliates. IFIS and its
              affiliates will never request or send staff or representatives to
              request for Agent’s PIN, OTP, card details, wallet details and/or
              other personal confidential information. IFIS and its affiliates
              shall not be liable for any loss or fraud arising out of the
              Agent’s disclosure of his/her Wallet PIN, Password, OTP and
              personal details.{'\n\n'}
            </Text>
            <Text>
              <Text bold>19. GOVERNING LAW AND ARBITRATION{'\n'}</Text>
              19.1. This Agreement shall be governed by, construed under and
              interpreted and enforced in all respects by the Laws of the
              Federal Republic of Nigeria, alongside the Agency rules and
              regulations issued by the CBN under which the Agent’s operate. In
              the event of any dispute or claim, whether based on contract or
              tort, arising out of or in connection with this Agreement, the
              Parties will endeavor to resolve such dispute through good faith
              negotiations as follows.{'\n'}
              19.1.1. In the event of any dispute arising in respect of any
              provisions hereof, the Parties shall meet in a timely manner and
              negotiate in good faith towards a mutual settlement of the dispute
              or issue.{'\n'}
              19.1.2. Where a dispute cannot be mutually resolved by the Parties
              in accordance with Clause 18.2.1 above within fourteen (14) days,
              either Party may institute an action for a resolution of the
              dispute at a court of competent jurisdiction in the Federal
              Republic of Nigeria.{'\n\n'}
            </Text>
            <Text>
              <Text bold>20. PRIVACY POLICY{'\n'}</Text>
              20.1 As a Customer, you accept this Privacy Policy when you sign
              up for, access, or use our products, services, content, features,
              technologies or functions offered on our website and all related
              sites, applications, and services (collectively referred to as
              “Interswitch Services”). This Privacy Policy is intended to govern
              the use of Interswitch Services by users (including, without
              limitation those who use these Interswitch Services in the daily
              course of their trade, practice or business) unless otherwise
              agreed through contract. Users reserve the right to exercise their
              data protection rights as listed under the Customer Data
              Protection Rights. We collect Personally Identifiable Information
              (PII), otherwise known as Personal Information or Personal Data.
              They include Name, email address, phone number, contact address,
              limited financial information, location data, device data, etc.
              {'\n'}
              20.2 How We Collect Personal Information Customers’ data is
              collected electronically and manually when they visit our website
              and register to use any of our services. This is collected
              electronically with exchanges between your system (Computer,
              Server, Mobile Device) or service provider’s system and our
              system.{'\n'}We collect Customers’ data manually when they
              complete our product and services registration forms in
              registering to use any of our services. Similar data are also
              collected when customers or visitors’ visit our physical locations
              for inquiries or business relationship. We collect information
              from or about customers from other sources, such as through your
              contact with us, including our Customer Support interfaces –
              email, portal, phone calls, social media, and other communication
              channels; Customer support teams, Customer response to surveys,
              Training programmes, Corporate Social Responsibility events,
              Promotional events, and interactions with members of the
              Interswitch Group or other companies (subject to their privacy
              policies and applicable law). We may also obtain information about
              you from third parties such as credit bureaus and identity
              verification services.{'\n'}
              20.3 Protection And Storage Of Personal Information: We store and
              process your personal information on our computers in Lagos,
              Nigeria and anywhere else where our facilities are located. We
              protect your information using physical, technical, and
              administrative security measures to reduce the risks of loss,
              misuse, unauthorized access, disclosure, and alteration. Some of
              the safeguards we use are firewalls and data encryption, physical
              access controls to our data centers, and information access
              authorization controls. We have also taken additional measures by
              ensuring our system complies with industry information security
              standards.{'\n'}
              20.4 Marketing: We do not sell or rent your personal information
              to third parties for their marketing purposes without your
              explicit consent. We may combine customer’s information with
              information collected from other companies and use it to improve
              and personalize Interswitch Services, content, and advertising. We
              have also included an opportunity for customers that had initially
              subscribed to receiving notification or information about their
              activities in relation to the use of Interswitch’s service to
              unsubscribed or request to be removed from applicable databases.
              {'\n'}
              20.5 Sharing Personal Information With Other Interswitch Users
              When transacting with others, we may provide those parties with
              information to complete the transaction, such as your name,
              account ID, contact details, shipping and billing address, or
              other information needed to promote the reliability and security
              of the transaction. If a transaction is held, fails, or is later
              invalidated, we may also provide details of the unsuccessful
              transaction. To facilitate dispute resolution, we may provide a
              buyer with the seller’s address so that goods can be returned to
              the seller. The receiving party is not allowed to use this
              information for unrelated purposes, such as to directly market to
              you, unless you have agreed to it. Contacting users with unwanted
              or threatening messages is not authorized by Interswitch.{'\n'}
              We may provide or display customer information to a third-party
              while consummating transactions to validate that transactions are
              being exchanged with valid receivers.We work with third parties,
              including merchants, to enable them to accept or send payments
              from or to Customers using Interswitch Services. In doing so, a
              third party may share information about customers with us, such as
              email address or mobile phone number, to inform such customer that
              a payment has been sent. We use this information to confirm that
              users are Interswitch customer and that Interswitch as a form of
              payment can be enabled, or to send customer notification of
              payment status. Also, we may oblige a request to validate that a
              customer transacts business with Interswitch. Customer’s card
              information may be available for their reuse subsequent if they
              chose to be remembered at previous attempts. Do note that
              merchants, sellers, and users involved in transactions may have
              their own privacy policies, and Interswitch does not allow the
              other transacting party to use this information for anything other
              than providing Interswitch Services, Interswitch is not
              responsible for their actions, including their information
              protection practices.{'\n'}
              Interswitch will not disclose your credit/ debit card number or
              bank account number to anyone or with the third parties that offer
              or use Interswitch Services, except with customers’ express
              permission or if we are required to do so to comply with
              credit/debit card rules, a subpoena, or other legal processes.
              {'\n'}
              20.6 Sharing Personal Information With Third Parties: We may share
              customers’ personal information with:{'\n'}
              Members of the Interswitch group to provide joint content,
              products, and services (such as registration, transactions and
              customer support), to help detect and prevent potentially illegal
              acts and violations of our policies, and to guide decisions about
              their products, services, and communications. This information
              will only be used for marketing communications only if customers
              have requested for the services. Financial institutions that we
              partner with to jointly create and offer a product may only use
              this information to market Interswitch related products unless the
              customer has given consent for other uses.
              {'\n\n'}
              Credit bureaus and collection agencies to report account
              information, as permitted by law. Banking partners as required by
              credit/ debit card association rules for inclusion on their list
              of terminated merchants.
              {'\n\n'}
              Companies that we plan to merge with or are acquired by. (Should
              such a combination occur, we will require that the new combined
              entity follow this Privacy Policy with respect to customer
              personal information. Customers will receive prior notice if
              personal information would be used contrary to this policy). Law
              enforcement, government officials, or other third parties pursuant
              to a subpoena, court order, or other legal process or requirement
              applicable to Interswitch or one of its affiliates; when we need
              to do so to comply with law or credit/debit card rules; or when we
              believe, in our sole discretion, that the disclosure of personal
              information is necessary to prevent physical harm or financial
              loss, to report suspected illegal activity or to investigate
              violations of our User Agreement.
              {'\n\n'}
              Other unaffiliated third parties, for the following purposes: •
              Fraud Prevention and Risk Management: to help prevent fraud or
              assess and manage risk.{'\n'}• Customer Service: for customer
              service purposes, including to help service your accounts or
              resolve disputes.{'\n'}• Shipping: in connection with shipping and
              related services for purchases made using Interswitch Services.
              {'\n'}• Legal Compliance: to help them comply with anti-money
              laundering and counter-terrorist financing verification
              requirements.{'\n'}• Service Providers: to enable service
              providers under contract with us to support our business
              operations, such as fraud prevention, bill collection, marketing,
              customer service and technology services. Our contracts dictate
              that these service providers only use customer information in
              connection with the services they perform for us and not for their
              own benefit.{'\n'}Other third parties with your consent or
              direction to do so.{'\n'}• Please note that these third parties
              may be in other countries where the laws on processing personal
              information may be less stringent than in our country of primary
              jurisprudence.{'\n'}• If customers open any of our products and
              services or related wallet account directly on a third-party
              website or via a third-party application, any information that are
              entered on such systems (and not directly on an Interswitch
              website) will be shared with the owner of the third-party website
              or application. These sites are governed by their own privacy
              policies and customers are encouraged to review their privacy
              policies before providing them with personal information.
              Interswitch is not responsible for the content or information
              practices of such third parties.{'\n'}
              20.7 Cross Border Transfers Of Personal Information: Interswitch
              is committed to adequately protecting customers’ personal
              information regardless of where the data resides and to providing
              appropriate protection for where such data is transferred across
              borders, including outside of Nigeria. We have further taken
              measure to ensure our relationships are with countries that are
              governed by similar data protection regulation as we are, and
              further assessment of other entities are being taken to provide a
              reasonable assurance of the safety of customer’s information. 20.8
              Customer Data Protection Rights Our customers have data protection
              rights and are entitled to the following: The right to access –
              Customer has the right to request copies of their personal data.
              Interswitch may charge a fee for this service if it will require a
              substantial amount of resources to accomplish.
              {'\n'}
              The right to rectification – Customers have the right to request
              that Interswitch correct any information they believe and have
              proven have been captured inaccurately. Customers also have the
              right to request Interswitch to complete the information they
              believe is incomplete.
              {'\n'}
              The right to erasure – Customers have the right to request that
              Interswitch erase their personal data, under certain conditions.
              These conditions are not limited to regulatory requirements, law
              enforcement agencies, or where such action may cause disruption to
              our system.
              {'\n'}
              The right to restrict processing – Customers have the right to
              request that Interswitch restrict the processing of their personal
              data, under certain conditions. (as above)
              {'\n'}
              The right to object to processing – Customers have the right to
              object to Our Company’s processing of your personal data, under
              certain conditions. (as above)
              {'\n'}
              The right to data portability – Customers have the right to
              request that Interswitch transfer the data that we have collected
              to another organization, or directly to them, under certain
              conditions. (as above)
              {'\n'}
              Customer requests based on any of the rights above shall be
              handled between 2 to 4 working weeks. Customer may contact us by
              email or writing: Email us at dpo@interswitchgroup.com{'\n\n'}
              20.9 The Use Of Cookies And Similar Technologies{'\n'}When
              Customers access our websites or use Interswitch Services, we may
              place small data files on your computer or other devices. These
              data files may be cookies, pixel tags, “Flash cookies,” or other
              local storage provided by your browser or associated applications
              (collectively referred to as “Cookies”). These technologies are
              used to recognize users as customers; customize Interswitch
              Services, content, and advertising; measure promotional
              effectiveness; help ensure that account security is not
              compromised; mitigate risk and prevent fraud; and to promote trust
              and safety across Interswitch Services and related sites.{'\n'}
              Users can freely decline our Cookies if the web browser or browser
              add-on permits unless our Cookies are required to prevent fraud or
              ensure the security of websites we control. However, declining our
              Cookies may interfere with users’ use of our websites and
              Interswitch Services. 20.10 Privacy Policies Of Other Websites
              This privacy policy applies to only Interswitch Group and not any
              other brands, though the mentioned on our Websites. Neither does
              it apply to our Merchants, Vendors, or other related partners.
              {'\n'}
              20.11 Customer Consent Please refer to the end of this notice for
              providing your consent. Your consent to personal data collection
              and processing may be revoked by notifying us via our contact
              page. For users below the age of 16, the consent should be
              provided by the holder of parental responsibility of the child.
              {'\n'}
              Please note, in case you choose to not provide us with the consent
              or withdraw the consent at any given point of time, we shall not
              be able to provide the services as detailed in section 2.2 of this
              notice.{'\n'}
              By signing this ‘Agent Agreement Form’, you are consenting to our
              full Privacy Policy attached herewith 20.12 Changes To Our Privacy
              Policy We review our privacy policy periodically and when there is
              any substantial change to business or regulatory requirements. At
              the minimum, we shall review this annually and communicate via our
              communication channels such as Newsletter, on Website, Social
              Media Accounts.
            </Text>
            <Text>
              <Text bold>21. ANTI-CORRUPTION{'\n'}</Text>
              21.1 Each Party hereby undertakes that, at the date of this
              Agreement, itself, its directors, officers, employees or
              affiliates have not offered, promised, given, authorized,
              solicited or accepted any undue pecuniary or other advantage of
              any kind (or implied that they will or might do any such thing at
              any time in the future) in any way connected with this Agreement
              and that it has taken reasonable measures to prevent
              subcontractors, agents or any other third parties, subject to its
              control or determining influence, from doing so.{'\n'}
              21.2 Each Party shall comply with all applicable anti-bribery and
              anti-corruption Laws in any relevant jurisdiction (including those
              in the Territory and the Foreign Corrupt Practice Act of the
              United States of America and the Bribery Act 2010 of the United
              Kingdom) and all applicable anti-bribery and anti-corruption
              regulations and codes of practice.{'\n'}
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            elevation: 10,
            justifyContent: 'space-evenly',
            // height: 35,
            margin: 20,
          }}>
          <CheckBox
            center
            checked={this.state.iAgree}
            containerStyle={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              padding: 0,
              marginBottom: 10,
            }}
            onPress={() =>
              this.setState({
                iAgree: !this.state.iAgree,
              })
            }
            textStyle={{
              color: COLOUR_GREY,
              fontWeight: 'normal',
              fontSize: FONT_SIZE_MID,
            }}
            title="I agree to Quickteller Paypoint Service Level Agreement."
          />
          <Button
            disabled={!this.state.iAgree}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
            }}
            onPress={this.onSubmit}
            loading={this.state.isLoading}
            title="CONTINUE"
          />
        </View>
      </View>
    );
  }
}
