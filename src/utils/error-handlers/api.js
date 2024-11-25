import NetInfo from '@react-native-community/netinfo';
import {
  DEFAULT_API_ERROR_MESSAGE,
  HTTP_INTERNAL_SERVER_ERROR,
} from "../../constants/api";
import ErrorTemplates from "../../fixtures/error_templates";
import { handleConnectionStatusWrapper } from "../../setup/background-tasks";

export class ApiErrorHandler {

  _findTemplateForErrorResponse(parsedErrorResponse) {
    // TODO refactor this to cater for `mode` and other parameters
    return ErrorTemplates.find(
      (value) => value.message_from_api === parsedErrorResponse.message
    );
  }

  _parseApiErrorResponse(rawApiResponse) {
    const errorObject = {
      code: null,
      message: null,
      message_to_user: null,
    };
    if (!rawApiResponse) {
      return errorObject;
    }

    errorObject.code = rawApiResponse.code;

    // pick out the message in the response object.
    errorObject.message =
      rawApiResponse.description ||
      rawApiResponse.errorMessage ||
      rawApiResponse.message;
    if (rawApiResponse.responseData && rawApiResponse.responseData.length > 0) {
      let messageList = rawApiResponse.description.toUpperCase() + "\n\n";
      rawApiResponse.responseData.forEach((error) => {
        const fieldName = error.fieldName.split(".");
        let userFriendlyField = fieldName[fieldName.length - 1];
        userFriendlyField =
          userFriendlyField[0].toUpperCase() + userFriendlyField.slice(1);
        messageList += `${userFriendlyField} ${error.message}\n`;
      });
      errorObject.message = messageList;
      errorObject.message_to_user = messageList;
    } else if (
      rawApiResponse.responseData &&
      rawApiResponse.responseData.description
    ) {
      errorObject.message = rawApiResponse.responseData.description;
    } else if (rawApiResponse.errors && rawApiResponse.errors.length > 0) {
      errorObject.message =
        rawApiResponse.errors[0].errorMessage ||
        rawApiResponse.errors[0].message;
    } else if (rawApiResponse.error && rawApiResponse.error.length > 0) {
      errorObject.message = DEFAULT_API_ERROR_MESSAGE;
    }
    return errorObject;
  }

  handleApiErrorResponse(
    rawApiResponse,
    errorMessageKeywords,
    forceShowUnknownErrors
  ) {
    const parsedErrorResponse = this._parseApiErrorResponse(rawApiResponse);

    const defaultErrorMessage = forceShowUnknownErrors
      ? parsedErrorResponse.message
      : DEFAULT_API_ERROR_MESSAGE;
    let errorMessage = rawApiResponse.code?.startsWith(
      JSON.stringify(HTTP_INTERNAL_SERVER_ERROR)
    )
      ? defaultErrorMessage
      : this._findTemplateForErrorResponse(parsedErrorResponse)
        ?.message_to_user;

    if (!errorMessage) {
      errorMessage = parsedErrorResponse.message;
    }

    if (errorMessageKeywords) {
      let refinedErrorMessage = errorMessage;

      Object.keys(errorMessageKeywords).map((keyword) => {
        refinedErrorMessage = refinedErrorMessage
          ? refinedErrorMessage.replace(
            `{${keyword}}`,
            errorMessageKeywords[keyword]
          )
          : null;
      });

      return refinedErrorMessage;
    }

    return errorMessage || DEFAULT_API_ERROR_MESSAGE;
  }
}

const apiErrorHandler = new ApiErrorHandler();

async function checkNetwork (message) {
  let val = message;
  try {
    const connectionState = await NetInfo.fetch();
    val = handleConnectionStatusWrapper(connectionState);
    return val === ""? message : val;
  } catch (e) {}
  return val;
}

export default async function handleErrorResponse(
  responseObj,
  errorMessageKeywords,
  forceShowUnknownErrors
) {


  let message = apiErrorHandler.handleApiErrorResponse(
    responseObj,
    errorMessageKeywords,
    forceShowUnknownErrors
  );

  if (message === DEFAULT_API_ERROR_MESSAGE || message === "An error occured. Please, try again later!") {
    return await checkNetwork(message)
  }

  return message.length > 80 ? DEFAULT_API_ERROR_MESSAGE : message;

  // check network here if it is a default error message


}
