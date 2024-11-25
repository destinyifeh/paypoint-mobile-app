import { StyleSheet } from "react-native";
import { COLOUR_BLUE } from "../../constants/styles";

export default StyleSheet.create({
  bottomSectionContainer: {
    alignItems: "center",
  },
  formInputInnerContainerStyle: {
    marginTop: 5,
  },
  formInputOuterContainerStyle: {
    marginBottom: 30,
  },
  haveAnAccountText: {
    textAlign: "center",
    marginTop: 30,
  },
  licenseAgreementText: {
    marginTop: 15,
    marginBottom: 50,
    textAlign: "center",
  },
  licenseAgreementTextBottom: {
    marginTop: 230,
    marginBottom: 20,
    textAlign: "center",
  },
  signupButtonContainerStyle: {
    marginBottom: 20,
    marginTop: 20,
  },
  signupButtonStyle: {
    width: 150,
  },
  signupFormContainer: {
    padding: 25,
  },
  signupFormHeader: {
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  signupScrollView: {
    padding: 0,
  },
  signupCard: {},
  signupCardText: {
    marginBottom: 10,
    color: COLOUR_BLUE,
  },
});
