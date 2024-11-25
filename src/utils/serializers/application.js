import Moment from 'moment';


export default class ApplicationSerializer {
  constructor(props) {
    Object.assign(this, props);
  }

  get formattedDeclineDate() {
    return Moment(this.dateValidated).format('Do MMMM YYYY, h:mm:ss a')
  }

  get isApplicantDetailsComplete() {
    return this.applicantDetails.firstName && 
      this.applicantDetails.surname && 
      this.applicantDetails.phoneNumber && 
      this.applicantDetails.emailAddress && 
      this.applicantDetails.state && 
      this.applicantDetails.localGovernmentArea && 
      this.applicantDetails.address &&
      this.applicantDetails.closestLandMark &&
      this.applicantDetails.nationality && 
      this.applicantDetails.dob && 
      this.applicantDetails.bvn &&
      this.applicantDetails.placeOfBirth &&
      this.applicantDetails.identificationType &&
      this.applicantDetails.identificationNumber &&
      this.applicantDetails.mothersMaidenName
  }

  get isBusinessDetailsComplete() {
    return this.businessDetails && 
      this.businessDetails.businessName && 
      this.businessDetails.address &&
      this.businessDetails.companyRegistrationNumber && 
      this.businessDetails.phoneNumber && 
      this.businessDetails.businessType && 
      this.businessDetails.state &&
      this.businessDetails.localGovernmentArea &&
      this.businessDetails.bankName &&
      this.businessDetails.accountNumber
  }

  get isNextOfKinDetailsComplete() {
    return this.applicantDetails.nextOfKin && 
      this.applicantDetails.nextOfKin.firstName && 
      this.applicantDetails.nextOfKin.surname && 
      this.applicantDetails.nextOfKin.phoneNumber && 
      this.applicantDetails.nextOfKin.relationship && 
      this.applicantDetails.nextOfKin.address && 
      this.applicantDetails.nextOfKin.gender
  }

  get applicantPhoneNumber() {
    return this.applicantDetails.phoneNumber
  }

  get cleanApprovalStatus() {
    return this.approvalStatus ? 
      this.approvalStatus.replace('_', ' ') : 
      null;
  }

  get cleanApplicationType() {
    return this.applicationType.replace('_', ' ');
  }

  get isApproved() {
    return this.approvalStatus === 'APPROVED';
  }

  get isSubmitted() {
    return this.applicationType === 'SUBMITTED';
  }

  get isDeclined() {
    return this.approvalStatus === 'REJECTED';
  }

  get isAwaitingValidation() {
    return this.approvalStatus === 'AWAITING_VALIDATION';
  }

  get isAwaitingApproval() {
    return this.approvalStatus === 'AWAITING_APPROVAL';
  }

}
