import { TRANSACTION_HISTORY_API_BASE_URL } from "../../constants/api-resources";

const ACTIVE = 'ACTIVE';
const DORMANT = 'DORMANT';
const INACTIVE = 'INACTIVE';
const NEW = 'NEW';
const RETIRED = 'RETIRED';
const SUSPENDED = 'SUSPENDED';

const DISABLED_STATUSES = [
  INACTIVE,
  RETIRED,
  DORMANT,
];

const STATUSES = [
  null,
  ACTIVE,
  INACTIVE,
  RETIRED,
  DORMANT,
];

const DOMAIN_STATUSES = [
  null,
  ACTIVE,
  SUSPENDED,
  RETIRED,
  DORMANT,
  NEW,
];

const FIP_PERMISSIONS = ["CREATE_OTHER_APPLICATION", "FETCH_OTHER_APPLICATION"];


export default class UserSerializer {
  constructor(props) {
    Object.assign(this, props);

    console.log('INSIDE USER SERIALIZER', props);
    this.permissionNames = props.permissions.map(({name}) => name);

    this.isAgent = props.domainCode && (props.domainCode.startsWith('AG') || props.domainCode.startsWith('ASH'));
    this.isApplicant = props.domainCode === 'APP';
    this.isFip = props.fipUser;
    // this.isFip = this.permissionNames.filter(
    //   permissionName => FIP_PERMISSIONS.includes(permissionName)
    // ).length === FIP_PERMISSIONS.length;
    // this.isFip = props.domainCode && (
    //   props.domainCode.startsWith('SP') || props.domainCode.startsWith('PP')
    // );

    this.isEmailVerified = props.emailVerified;
    this.isPhoneVerified = props.mobileVerified;

    this.businessMobileNo = props.businessMobileNo || props.mobileNo;
    
    this.canAccessDashboard = this.isApplicant || this.isAgent || this.isFip || this.isSuperAgent;
    this.walletRef = this.domainCode;
  }

  get businessName() {
    return this.domainName;
  }

  get isDomainActive() {
    return this.domainStatusStr === ACTIVE;
  }

  get isDomainDisabled() {
    return DISABLED_STATUSES.includes(this.domainStatusStr);
  }

  get isDomainNew() {
    return this.domainStatusStr === NEW;
  }

  get domainStatusStr() {
    return DOMAIN_STATUSES[this.domainStatus];
  }

  get isDisabled() {
    return this.isApplicant || !this.isPhoneVerified
  }

  get isOnboarded() {
    console.log('isOnboarded >>>', !this.isApplicant && this.isPhoneVerified)
    return !this.isApplicant && this.isPhoneVerified //&& this.isEmailVerified
  }

  get isSuperAgent() {
    return this.domainType === 'Super Agent';
  }

  get statusStr() {
    return STATUSES[this.status];
  }

}
