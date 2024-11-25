
export default class BvnAgent {

  constructor(props) {
    Object.assign(this, props);

    console.log('IN BVN AGENT SERIAILZER', props);

    // "id":171,"agentId":49387,"agentCode":"AG522LO1FR","bvnNumber":"08173837828","bvnDateOfBirth":"1998-08-31","bvnFirstName":"Abdulkareem","bvnLastName":"Basits","businessName":"Wale and Sons","businessEmail":"collins_mba2@yahoo.com","agentMobileNo":"2348166380172","stateId":1,"bvnPhoneNumber":"2348166380172","bvnVerificationStatus":"VERIFICATION_FAILED","lastUpdated":"2022-03-23T14:41:21.413","firstVerifiedDate":"2022-03-22T14:31:12.753"

    

    this.walletPhone = this.agentMobileNo;
    
    this.firstName = this.bvnFirstname;
    this.lastName = this.bvnLastname;
    this.phoneNumber = this.agentMobileNo;
    this.emailAddress = this.businessEmail;

    this.dateOfBirth = this.bvnDateOfBirth;
    this.bvn = this.bvnNumber;

  }

  asJson() {
    return {
      ...this.props,
      agentAge: this.age,
      agentGender: this.gender
    }
  }

}
