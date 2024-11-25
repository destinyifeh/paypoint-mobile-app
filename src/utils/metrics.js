import {
  APPLICATION,
  USER
} from '../constants';
import ApplicationSerializer from '../serializers/resources/application';
import UserSerializer from '../serializers/resources/user';
import { loadData } from './storage';

export async function getOnboardingProgress(
  onboardingCompletion_, isPhoneVerified, isEmailVerified
) {
  let application = null;
  let emailVerificationCompletion = null;
  let onboardingCompletion = null;
  let phoneVerificationCompletion = null;

  if (!onboardingCompletion_) {
    application = new ApplicationSerializer(
      JSON.parse(await loadData(APPLICATION))
    );

    onboardingCompletion = (
      1 - (
        application.missingFields.length / application.numberOfRequiredFields
      )
    ) * 100;
  } else {
    onboardingCompletion = onboardingCompletion_;
  }

  const user = new UserSerializer(
    JSON.parse(await loadData(USER))
  );

  if (!isPhoneVerified) {
    phoneVerificationCompletion = user.isPhoneVerified ? 100 : 0;
  }

  if (!isEmailVerified) {
    emailVerificationCompletion = user.isEmailVerified ? 100 : 0;
  }

  const percentageCompletion = (
    onboardingCompletion * .3334 + phoneVerificationCompletion * .3334 + emailVerificationCompletion * .3334
  );

  const progress = {
    levelPercentage: percentageCompletion,
    requirements: [
      {
        'completed': isPhoneVerified || user.isPhoneVerified,
        'description': 'Verify your phone number',
        'name': 'Phone Verification',
      },
      {
        'completed': onboardingCompletion_ === 100 || application.missingFields.length == 0,
        'description': 'Complete your agent application',
        'name': 'Agent Information',
      },
      {
        'completed': isEmailVerified || user.isEmailVerified,
        'description': 'Verify your email',
        'name': 'Email Verification',
      },
    ]
  }

  return progress;
  
}
