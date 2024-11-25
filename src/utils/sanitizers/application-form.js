import sanitizePhoneNumber from "./phone-number";

export function sanitizeApplicationForm(applicationForm) {
  const sanitizedForm = {
    ...applicationForm,
    applicantDetails: {
      ...applicationForm.applicantDetails,
      phoneNumber: sanitizePhoneNumber(
        applicationForm.applicantDetails.phoneNumber
      ),
      nextOfKin: {
        ...applicationForm.applicantDetails.nextOfKin,
        phoneNumber:
          applicationForm.applicantDetails.nextOfKin &&
          applicationForm.applicantDetails.nextOfKin.phoneNumber
            ? sanitizePhoneNumber(
                applicationForm.applicantDetails.nextOfKin.phoneNumber
              )
            : null,
      },
    },
    businessDetails: {
      ...applicationForm.businessDetails,
    },
  };

  sanitizedForm.referralCode =
    applicationForm.applicantDetails.referralCode || sanitizedForm.referralCode;

  if (
    applicationForm.businessDetails &&
    applicationForm.businessDetails.phoneNumber
  ) {
    sanitizedForm.businessDetails.phoneNumber = sanitizePhoneNumber(
      applicationForm.businessDetails.phoneNumber
    );
  }

  if (!Object.values(sanitizedForm.businessDetails).length) {
    delete sanitizedForm.businessDetails;
  }

  sanitizedForm.is_business = applicationForm.is_business || true;

  return sanitizedForm;
}
