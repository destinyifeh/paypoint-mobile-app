import { StyleSheet } from "react-native";
import { FONT_FAMILY_BODY } from "../../../../../constants/styles";

export default StyleSheet.create({
  bottomSectionContainer: {
    alignItems: "center",
  },
  formInputInnerContainerStyle: {
    marginTop: 5,
  },
  formInputOuterContainerStyle: {
    marginBottom: 20,
  },
  haveAnAccountText: {
    textAlign: "center",
  },
  licenseAgreementText: {
    marginTop: 20,
    textAlign: "center",
  },
  applicationButtonContainerStyle: {
    marginBottom: 20,
    marginTop: 20,
  },
  applicationButtonStyle: {
    width: 150,
  },
  applicationFormContainer: {
    padding: 25,
  },
  applicationFormHeader: {
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  applicationScrollView: {
    padding: 0,
  },
  previewTitleText: {
    color: "#1F2126",
    fontSize: 16,
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 10,
  },
  previewDescText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: FONT_FAMILY_BODY,
    fontWeight: "600",
    lineHeight: 20,
  },
  PreviewSection: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E1E6ED",
    borderRadius: 8,
    padding: 16,
  },
});
