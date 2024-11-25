
import { retrieveAuthToken } from '../utils/auth';
import NavigationService from '../utils/navigation-service';
import SessionTimer from '../utils/session-timer';


export const appSessionTimer = new SessionTimer();
export const tokenSessionTimer = new SessionTimer();


const onAppSessionEnd = () => {
  retrieveAuthToken().then(
    ({ authToken }) => {
      const isSessionActive = authToken !== null;

      isSessionActive && NavigationService.replace('Logout', {
        didSessionExpire: true
      });
    }
  )
}
