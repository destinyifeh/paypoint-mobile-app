export default class Application {
  requiredFields = {
    'applicantDetails': [
      'firstName',
      'surname',
      'phoneNumber',
      'nationality',
      'address',
      'state',
      'localGovernmentArea',
      'closestLandMark',
      'dob',
      'gender',
      'placeOfBirth',
      'identificationType',
      'identificationNumber',
      'bvn',
      'mothersMaidenName',
      'howYouHeardAboutUs',
    ],
    'businessDetails': [
      'businessName',
      'address',
      'companyRegistrationNumber',
      'phoneNumber',
      'businessType',
      'bankName',
      'accountNumber',
      'state',
      'localGovernmentArea'
    ],
    'nextOfKinDetails': [
      'firstName',
      'surname',
      'phoneNumber',
      'gender',
      'relationship',
      'address'
    ]
  }

  constructor(props) {
    console.log('IN APPLICATION SERIALIZER >>> ', props)
    Object.assign(this, props);

    this.isApproved = props.approvalStatus === 'APPROVED';
    this.isAwaitingApproval = props.approvalStatus === 'AWAITING_APPROVAL';
    this.isAwaitingValidation = props.approvalStatus === 'AWAITING_VALIDATION';
    this.isDraftApplication = props.applicationType === 'DRAFT';
  }

  get numberOfRequiredFields() {
    return (
      this.requiredFields.applicantDetails.length + 
      this.requiredFields.businessDetails.length + 
      this.requiredFields.nextOfKinDetails.length
    );
  }

  get missingFields() {
    const missingApplicantDetails = this.requiredFields.applicantDetails.filter(
      (value) => this.applicantDetails[value] == undefined
    );
    const missingBusinessDetails = this.businessDetails ? this.requiredFields.businessDetails.filter(
      (value) => this.businessDetails[value] == undefined
    ) : this.requiredFields.businessDetails;
    const missingNextOfKinDetails = this.applicantDetails.nextOfKin ? this.requiredFields.nextOfKinDetails.filter(
      (value) => this.applicantDetails.nextOfKin[value] == undefined
    ) : this.requiredFields.nextOfKinDetails;

    return [
      ...missingApplicantDetails,
      ...missingBusinessDetails,
      ...missingNextOfKinDetails,
    ];
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

  get isDisabled() {
    return !this.isApproved;
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

  get isSubmitted() {
    return this.applicationType === 'SUBMITTED';
  }

}
