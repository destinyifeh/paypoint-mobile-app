// import CodePush from "react-native-code-push";

// import { APP_UPDATE_CHECK_INTERVAL_IN_MILLISECONDS, CODE_PUSH_DEPLOYMENT_KEY } from "../constants/api-resources";

// async function checkForAppUpdates() {
//   try {
//     console.log('CHECKING FOR APP UPDATES: ', CODE_PUSH_DEPLOYMENT_KEY);
//     const isUpdateAvailable = await CodePush.checkForUpdate();
//     console.log('[CodePush]', {isUpdateAvailable})
//     isUpdateAvailable && CodePush.sync({
//       installMode: CodePush.InstallMode.IMMEDIATE,
//       deploymentKey: CODE_PUSH_DEPLOYMENT_KEY
//     }) && console.log('APP UPDATED SUCCESSFULLY');
//   } catch {

//   }
// }

// checkForAppUpdates();

// setInterval(checkForAppUpdates, APP_UPDATE_CHECK_INTERVAL_IN_MILLISECONDS);
