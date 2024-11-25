import React, { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Icon } from "react-native-elements";


import Accordion from "../../../../../../components/accordion";
import Button from "../../../../../../components/button";
import { ConfirmationBottomSheet, ConfirmationTab } from "../../../../../../components/confirmation";
import Header from "../../../../../../components/header";
import Receipt, {
  ReceiptBottomSheet,
  ReceiptContentTemplates,
} from "../../../../../../components/receipt";
import Text from "../../../../../../components/text";
import {
  APP_NAME,
  INVALID_FORM_MESSAGE,
  USER,
} from "../../../../../../constants";
import {
  ACCOUNT_OPENING_SAVE_CLICK,
  ACCOUNT_OPENING_SAVE_FAILURE,
  ACCOUNT_OPENING_SAVE_SUCCESS,
  ACCOUNT_OPENING_SUBMIT_CLICK,
  ACCOUNT_OPENING_SUBMIT_FAILURE,
  ACCOUNT_OPENING_SUBMIT_SUCCESS,
} from "../../../../../../constants/analytics";
import {
  ERROR_STATUS,
  SUCCESSFUL_STATUS,
  SUCCESS_STATUS,
} from "../../../../../../constants/api";
import { BLOCKER } from "../../../../../../constants/dialog-priorities";
import {
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from "../../../../../../constants/styles";
import { logEvent } from "../../../../../../core/logger";
import { updateLoading } from "../../../../../../services/redux/actions/tunnel";
import store from "../../../../../../services/redux/store";
import { accountOpeningService } from "../../../../../../setup/api";
import { getDeviceDetails } from "../../../../../../utils/device";
import { flashMessage } from "../../../../../../utils/dialog";
import handleErrorResponse from "../../../../../../utils/error-handlers/api";
import { getBankNameForSanefBank } from "../../../../../../utils/helpers";
import { loadData } from "../../../../../../utils/storage";
import {
  AccountOpeningAttachments,
  AccountOpeningBankInformation,
  AccountOpeningContactInformation,
  AccountOpeningPersonalInformation,
  AccountOpeningResidentialInformation,
} from "../../forms/account-opening-form";

const DEFAULT_ACCOUNT_OPENING_BALANCE = 0;

const window_height = Dimensions.get("window").height;

export default function AccountOpeningForm(props) {
  const bankInformationForm = useRef();
  const contactInformationForm = useRef();
  const residentialInformationForm = useRef();
  const personalInformationForm = useRef();
  const attachmentsForm = useRef();
  const bottomSheet = useRef();
  const confirmationBottomSheetRef = useRef();
  const receiptBottomSheetRef = useRef();

  const [banks, setBanks] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmationFields, setConfirmationFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [propagateFormErrors, setPropagateFormErrors] = useState(false);
  const [reference, setReference] = useState(null);
  const [showConfirmationTab, setShowConfirmationTab] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);

  useEffect(() => {
    if (showConfirmationTab) {
      confirmationBottomSheetRef.current.open();
    } else if (showConfirmationTab === false) {
      confirmationBottomSheetRef.current.close();
    }
  }, [showConfirmationTab]);

  useEffect(() => {
    if (showReceipt) {
      receiptBottomSheetRef.current.open();
    } else if (showReceipt === false) {
      receiptBottomSheetRef.current.close();
    }
  }, [showReceipt]);

  const checkFormValidity = (excludes) => {
    const contactInformationFormIsComplete =
      contactInformationForm.current.state.isComplete;
    const contactInformationFormIsValid =
      contactInformationForm.current.state.isValid;
    console.log({
      contactInformationFormIsComplete,
      contactInformationFormIsValid,
    });
    if (!(contactInformationFormIsComplete && contactInformationFormIsValid)) {
      setIsLoading(false);
      setPropagateFormErrors(true);

      return;
    }

    const residentialInformationFormIsComplete =
      residentialInformationForm.current.state.isComplete;
    const residentialInformationFormIsValid =
      residentialInformationForm.current.state.isValid;
    console.log({
      residentialInformationFormIsComplete,
      residentialInformationFormIsValid,
    });
    if (
      !(
        residentialInformationFormIsComplete &&
        residentialInformationFormIsValid
      )
    ) {
      setIsLoading(false);
      setPropagateFormErrors(true);

      return;
    }

    const personalInformationFormIsComplete =
      personalInformationForm.current.state.isComplete;
    const personalInformationFormIsValid =
      personalInformationForm.current.state.isValid;
    console.log({
      personalInformationFormIsComplete,
      personalInformationFormIsValid,
    });
    if (
      !(personalInformationFormIsComplete && personalInformationFormIsValid)
    ) {
      setIsLoading(false);
      setPropagateFormErrors(true);

      return;
    }

    const bankInformationFormIsComplete =
      bankInformationForm.current.state.isComplete;
    const bankInformationFormIsValid =
      bankInformationForm.current.state.isValid;
    console.log({ bankInformationFormIsComplete, bankInformationFormIsValid });
    if (!(bankInformationFormIsComplete && bankInformationFormIsValid)) {
      setIsLoading(false);
      setPropagateFormErrors(true);

      return;
    }

    const attachmentsAreComplete = attachmentsForm.current.state.isComplete;
    console.log({ attachmentsAreComplete });
    if (!attachmentsAreComplete && !excludes?.includes("ATTACHMENTS")) {
      setIsLoading(false);
      setPropagateFormErrors(true);

      return;
    }

    return true;
  };

  const syncFormData = async () => {
    const user = JSON.parse((await loadData(USER)) || "{}");

    const bankInformationFormData = bankInformationForm.current.serializeFormData();
    const contactInformationFormData = contactInformationForm.current.serializeFormData();
    const personalInformationFormData = personalInformationForm.current.serializeFormData();
    const residentialInformationFormData = residentialInformationForm.current.serializeFormData();

    const bankName = banks.find(
      ({ sanefBankCode }) => bankInformationFormData.BankCode === sanefBankCode
    )?.bankName;

    console.log({
      bankInformationFormData,
      contactInformationFormData,
      personalInformationFormData,
      residentialInformationFormData,
    });

    const sanefForm = {
      ...bankInformationFormData,
      ...contactInformationFormData,
      ...personalInformationFormData,
      ...residentialInformationFormData,
      AccountOpeningBalance: DEFAULT_ACCOUNT_OPENING_BALANCE,
      AgentId: user.domainCode,
      AgentPhoneNo: user.businessMobileNo,
    };

    setConfirmationFields({
      Bank: bankName,
      "First Name": contactInformationFormData.FirstName,
      "Last Name": contactInformationFormData.LastName,
      "Middle Name": contactInformationFormData.MiddleName,
      "Phone Number": contactInformationFormData.PhoneNumber,
      "Email Address": contactInformationFormData.EmailAddress,
      City: residentialInformationFormData.City,
      "Street Name": residentialInformationFormData.StreetName,
      "House Number": residentialInformationFormData.HouseNumber,
      "LGA Code": residentialInformationFormData.LgaCode,
      "Date of Birth": personalInformationFormData.DateOfBirth,
      Gender: personalInformationFormData.Gender,
      "Bank Verification Number":
        bankInformationFormData.BankVerificationNumber,
    });

    return sanefForm;
  };

  const onSave = async () => {
    const { deviceUuid } = await getDeviceDetails();
    const sanefForm = await syncFormData();
    console.log({ sanefForm });

    setErrorMessage(null);
    setIsLoading(true);

    const { code, response, status } = await accountOpeningService.saveForm(
      sanefForm,
      deviceUuid
    );
    console.log({ code, response, status });

    setIsLoading(false);

    logEvent(ACCOUNT_OPENING_SAVE_CLICK);

    if (status === ERROR_STATUS) {
      flashMessage("Error", await handleErrorResponse(response), BLOCKER);

      logEvent(ACCOUNT_OPENING_SAVE_FAILURE);

      return;
    }

    logEvent(ACCOUNT_OPENING_SAVE_SUCCESS);

    const { transactionRef } = response.data;

    setReference(transactionRef);

    return transactionRef;
  };

  const runFormValidation = (message = INVALID_FORM_MESSAGE, excludes = []) => {
    const isFormValid = checkFormValidity(excludes);

    if (!isFormValid) {
      flashMessage(APP_NAME, message, BLOCKER);

      return false;
    }

    return true;
  };

  const showPreviewPage = async () => {
    await syncFormData();

    const isFormValid = checkFormValidity();

    if (!isFormValid) {
      flashMessage(APP_NAME, INVALID_FORM_MESSAGE, BLOCKER);

      return;
    }

    setShowConfirmationTab(true);

    // DEMO
    // setConfirmationFields({
    //   ...confirmationFields,
    //   Bank: 'Zenith Bank Plc',
    //   BankName: getBankNameForBank('Zenith Bank Plc'),
    //   'First Name': 'Tomisin',
    //   'Last Name': 'Abiodun',
    //   'Middle Name': 'Ayoola',
    //   AccountNumber: '8091082019', //response.data.accountNumber,
    // });
    // setShowReceipt(true);
    return;
  };

  const onSubmit = async () => {
    await onSave();

    logEvent(ACCOUNT_OPENING_SUBMIT_CLICK);

    setErrorMessage(null);
    setIsLoading(true);
    store.dispatch(updateLoading({ isLoading: true }));

    const { code, response, status } = await accountOpeningService.submitForm(
      reference
    );
    console.log({ code, response, status });

    setIsLoading(false);
    store.dispatch(updateLoading({ isLoading: false }));

    if (status === ERROR_STATUS) {
      const forceShowUnmaskedErrors = true;

      flashMessage(
        "Error",
        await handleErrorResponse(response, {}, forceShowUnmaskedErrors),
        BLOCKER
      );

      logEvent(ACCOUNT_OPENING_SUBMIT_FAILURE);

      return;
    }

    console.log({ confirmationFields });

    setConfirmationFields({
      ...confirmationFields,
      AccountNumber: response.data?.accountNumber || "N/A",
      BankName: getBankNameForSanefBank(confirmationFields.Bank),
    });

    setShowConfirmationTab(false);
    setShowReceipt(true);

    logEvent(ACCOUNT_OPENING_SUBMIT_SUCCESS);

    return;
  };

  const prepareUserForSanef = async () => {
    const {
      response,
      status,
    } = await accountOpeningService.registerAgentOnSanef();

    console.log({ response, status });

    setIsSettingUp(false);

    if (status === ERROR_STATUS) {
      setErrorMessage(await handleErrorResponse(response));
      return;
    }

    const retrieveAccountOpeningBanksResponse = await accountOpeningService.retrieveBanksForAccountOpening();

    console.log({ retrieveAccountOpeningBanksResponse });

    if (retrieveAccountOpeningBanksResponse.status === SUCCESS_STATUS) {
      setBanks(retrieveAccountOpeningBanksResponse.response.data);
    } else {
      setErrorMessage(
        await handleErrorResponse(retrieveAccountOpeningBanksResponse.response)
      );
    }
  };

  const loadScreenData = () => {
    setIsSettingUp(true);

    prepareUserForSanef();
  };

  useEffect(loadScreenData, []);

  const confirmationTab = () => {
    return (
      <ConfirmationTab
        category={"Account Opening"}
        fields={[confirmationFields]}
        isLoading={isLoading}
        onClose={() => {
          bottomSheet.current.close();
          setShowConfirmationTab(false);
        }}
        onSubmit={() => onSubmit()}
      />
    );
  };

  const receiptContentTemplates = new ReceiptContentTemplates();

  const receipt = () => {
    return (
      <Receipt
        fields={[
          {
            ...confirmationFields,
          },
          {
            "Transaction Status": SUCCESSFUL_STATUS,
          },
        ]}
        onDismiss={() => {
          bottomSheet.current.close();
          setShowReceipt(false);
          props.navigation.goBack();
        }}
        paymentDetailsTitle={null}
        template={receiptContentTemplates.accountOpeningTemplate}
        showAnimation={true}
        subMessage={"Here is your receipt.\nSee account details below."}
      />
    );
  };

  const bankInformation = (
    <Accordion
      expanded={true}
      header="Bank Information"
      content={
        <AccountOpeningBankInformation
          banks={banks}
          propagateFormErrors={propagateFormErrors}
          ref={bankInformationForm}
        />
      }
    />
  );

  const contactInformationAccordion = (
    <Accordion
      expanded={true}
      header="Contact Information"
      content={
        <AccountOpeningContactInformation
          propagateFormErrors={propagateFormErrors}
          ref={contactInformationForm}
        />
      }
    />
  );

  const residentialInformationAccordion = (
    <Accordion
      expanded={true}
      header="Residential Information"
      content={
        <AccountOpeningResidentialInformation
          propagateFormErrors={propagateFormErrors}
          ref={residentialInformationForm}
        />
      }
    />
  );

  const personalInformationAccordion = (
    <Accordion
      expanded={true}
      header="Personal Information"
      content={
        <AccountOpeningPersonalInformation
          propagateFormErrors={propagateFormErrors}
          ref={personalInformationForm}
        />
      }
    />
  );

  const attachmentsAccordion = (
    <Accordion
      expanded={true}
      header="Attachments"
      content={
        <AccountOpeningAttachments
          runFormValidation={runFormValidation}
          propagateFormErrors={propagateFormErrors}
          onSave={onSave}
          ref={attachmentsForm}
          reference={reference}
        />
      }
    />
  );

  let content = (
    <React.Fragment>
      <ScrollView>
        {contactInformationAccordion}
        {residentialInformationAccordion}
        {personalInformationAccordion}
        {bankInformation}
        {attachmentsAccordion}
      </ScrollView>

      <View
        style={{ flexDirection: "row", justifyContent: "center", padding: 12 }}
      >
        {/* <Button
        containerStyle={{
          width: 150
        }}
        loading={isLoading}
        onPressOut={onSave} 
        title="SAVE"
        titleStyle={{
          color: COLOUR_RED
        }}
        transparent
      /> */}

        <Button
          containerStyle={{
            width: 150,
          }}
          loading={isLoading}
          title="SUBMIT"
          onPressOut={showPreviewPage}
          // onPressOut={onSubmit}
        />
      </View>
    </React.Fragment>
  );

  if (errorMessage) {
    content = (
      <View style={{ flex: 1, justifyContent: "center", padding: 8 }}>
        <Text big center>
          {errorMessage}
        </Text>
        <Button
          onPress={loadScreenData}
          title="RETRY"
          transparent
          titleStyle={{
            color: COLOUR_BLUE,
          }}
        />
      </View>
    );
  }

  // if (isSettingUp) {
  //   content = <View style={{flex: .7, justifyContent: 'center'}}>
  //     <ActivityIndicator size="large" />
  //   </View>
  // }

  return (
    <View style={{ flex: 1 }}>
      <Header
        containerStyle={{
          backgroundColor: COLOUR_BLUE,
        }}
        navigationIconColor={COLOUR_WHITE}
        leftComponent={
          <Icon
            color={COLOUR_RED}
            underlayColor="transparent"
            name="chevron-left"
            size={40}
            type="material"
            onPress={() => props.navigation.goBack()}
          />
        }
        hideNavigationMenu={props.hideNavigator}
        showNavigationMenu={props.showNavigator}
        statusBarProps={{
          backgroundColor: "transparent",
          barStyle: CONTENT_LIGHT,
        }}
        title="Account Opening Form"
        titleStyle={{
          color: COLOUR_WHITE,
          fontWeight: "bold",
        }}
      />

      <ConfirmationBottomSheet
        category={"Account Opening"}
        fields={[confirmationFields]}
        isLoading={isLoading}
        onClose={() => {
          setShowConfirmationTab(false);
        }}
        onSubmit={() => onSubmit()}
        requestClose={() => {
          setShowConfirmationTab(false);
          // confirmationBottomSheetRef.current.close();
        }}
        sheetRef={confirmationBottomSheetRef}
      />

      <ReceiptBottomSheet
        fields={[
          {
            ...confirmationFields,
          },
          {
            "Transaction Status": SUCCESSFUL_STATUS,
          },
        ]}
        onClose={() => {
          setShowReceipt(false);
          props.navigation.goBack();
        }}
        requestClose={() => {
          setShowReceipt(false);
          // receiptBottomSheetRef.current.close();
        }}
        paymentDetailsTitle={null}
        sheetRef={receiptBottomSheetRef}
        showAnimation={true}
        subMessage={"Here is your receipt.\nSee account details below."}
        template={receiptContentTemplates.accountOpeningTemplate}
      />
      {content}
    </View>
  );
}
