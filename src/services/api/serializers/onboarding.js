import { NIGERIA_SHORT_CODE } from '../../../constants';
import { formatPhoneNumber } from '../../../utils/formatters';

export default class OnboardingSerializers {
  serializeFormData(data) {
    return {
      firstname: data.firstName,
      surname: data.lastName,
      phoneNumber: formatPhoneNumber(NIGERIA_SHORT_CODE, data.phone),
      email: data.email,
      howYouHeardAboutUs: data.howYouHeardAboutUs,
      uniquePwd: data.password,
      confirmPwd: data.password,
      mobileNo: formatPhoneNumber(NIGERIA_SHORT_CODE, data.phone),
    }
  }
}
