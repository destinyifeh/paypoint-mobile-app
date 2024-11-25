const ACCOUNT_STATUS_DRAFT = 'Draft';
const ACCOUNT_STATUS_FAILURE = 'Failed';
const ACCOUNT_STATUS_PENDING = 'Pending';
const ACCOUNT_STATUS_SUCCESS = 'Success';

export default class AccountSerializer {
  serializeApiData(apiData) {
    return {
      ...apiData,
      isDraftStatus: apiData.status === ACCOUNT_STATUS_DRAFT,
      isFailedStatus: apiData.status === ACCOUNT_STATUS_FAILURE,
      isPendingStatus: apiData.status === ACCOUNT_STATUS_PENDING,
      isSuccessStatus: apiData.status === ACCOUNT_STATUS_SUCCESS
    };
  }
}
