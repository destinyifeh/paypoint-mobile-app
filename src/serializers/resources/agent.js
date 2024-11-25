import moment from 'moment';

const ACTIVE = 'Active';
const CREATED = 'CREATED';
const DEACTIVATED = 'Deactivated';
const DORMANT = 'Dormant';
const INACTIVE = 'Inactive';
const NEW = 'New';
const RETIRED = 'Retired';
const SUSPENDED = 'Suspended';
const WALLET_CREATED = 'WALLET_CREATED';


export default class Agent {
  disabledStatuses = [INACTIVE, RETIRED, SUSPENDED];

  constructor(props) {
    Object.assign(this, props);

    console.log('IN AGENT SERIAILZER', props);

    this.walletPhone = this.agentMobileNo;
    
    this.firstName = this.businessContact.firstname;
    this.middleName = this.businessContact.middlename;
    this.surname = this.businessContact.lastname;
    this.lastName = this.businessContact.lastname;
    this.phoneNumber = this.agentMobileNo;
    this.emailAddress = this.businessEmail;

    this.address = this.businessContact.residentialAddress.addressLine1;
    this.nationality = this.businessContact.nationality;
    this.state = this.businessContact.residentialAddress.state;
    this.lga = this.businessContact.residentialAddress.lga;
    this.closestLandmark = this.businessContact.residentialAddress.landmark;

    this.dateOfBirth = this.businessContact.dob;
    this.gender = this.businessContact.gender;
    this.placeOfBirth = this.businessContact.placeOfBirth;
    this.idNumber = this.businessContact.idNumber;
    this.idType = this.businessContact.idType;
    this.bvn = this.agentBankAccount.bvn;
    this.walletReference = this.walletRef;

    if (this.nextOfKins.length) {
      this.nextOfKin = {
        firstName: this.nextOfKins[0].firstname,
        lastName: this.nextOfKins[0].lastname,
        phone: this.nextOfKins[0].phoneNo,
        gender: this.nextOfKins[0].gender,
        email: null,
        relationship: null,
        address: `${this.nextOfKins[0].residentialAddress.houseNo || ''} ${this.nextOfKins[0].residentialAddress.addressLine1 || ''} ${this.nextOfKins[0].residentialAddress.addressLine2 || ''} ${this.nextOfKins[0].residentialAddress.city || ''}`
      }
    }
  }

  get age() {
    if (!this.businessContact) {
      return null
    }
    
    return JSON.stringify(moment().year()) - parseInt(moment(this.businessContact.dob, 'YYYY-MM-DD').year());
  }

  get gender() {
    return this.businessContact?.gender
  }

  get isActive() {
    return this.status === ACTIVE;
  }

  get isDeactivated() {
    return this.status === DEACTIVATED;
  }

  get isDisabled() {
    return this.disabledStatuses.includes(this.status) || !this.isSetupComplete;
  }

  get isDormant() {
    return this.status === DORMANT;
  }

  get isInactive() {
    return this.status === INACTIVE;
  }

  get isNew() {
    return this.status === NEW;
  }

  get isRetired() {
    return this.status === RETIRED;
  }

  get isSuspended() {
    return this.status === SUSPENDED;
  }

  get isSetupComplete() {
    return this.walletStatus.toUpperCase() === WALLET_CREATED;
  }

  asJson() {
    return {
      ...this.props,
      agentAge: this.age,
      agentGender: this.gender
    }
  }

}
