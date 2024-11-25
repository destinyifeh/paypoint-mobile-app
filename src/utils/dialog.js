import { Alert, ToastAndroid } from "react-native";
import { BLOCKER, CASUAL } from "../constants/dialog-priorities";

export function flashMessage(title, message, priority = CASUAL) {
  switch (priority) {
    case BLOCKER:
      Alert.alert(title, message);
      return;
    case CASUAL:
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    default:
      return;
  }
}
