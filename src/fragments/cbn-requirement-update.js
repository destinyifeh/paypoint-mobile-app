import React from 'react';
import {
  BackHandler,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../components/button';
import Text from '../components/text';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_LINK_BLUE,
  COLOUR_OFF_WHITE,
  FONT_FAMILY_BODY_BOLD,
} from '../constants/styles';
import navigationService from '../utils/navigation-service';

export const CbnRequirementUpdate = props => {
  const [force, setForce] = React.useState(false);

  React.useEffect(() => {
    forceUserToUpdate();
  }, []);

  React.useEffect(() => {
    if (props.showCbnPromptModa) {
      const handleBackButtonPress = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
      return () => backHandler.remove();
    }
  }, [props.showCbnPromptModal]);

  const checkCbnUpdatePeriod = () => {
    const currentDate = new Date();
    const mainDate = new Date(2024, 6, 16); //Y-M-D
    return currentDate > mainDate;
  };

  const forceUserToUpdate = () => {
    if (checkCbnUpdatePeriod()) {
      // Please uncomment out the setForce(true) when product decide and remove the setForce(false) below:
      // setForce(true);
      setForce(false);
    } else {
      setForce(false);
    }
  };

  const onPressNext = () => {
    if (props.kycCheckList.livelinessCheck === false) {
      props.updateCbnPromptModal();
      props.navigation.navigate('AgentBvnVerification');
    } else if (props.kycCheckList.bvnNinMatch === false) {
      props.updateCbnPromptModal();
      props.navigation.navigate('AgentNinVerification', {
        isFromDashboard: true,
      });
    } else if (props.kycCheckList.tinNinMatch === false) {
      props.updateCbnPromptModal();
      props.navigation.navigate('AgentTinVerification');
    } else {
      props.updateCbnPromptModal();
    }
  };

  const onLogout = () => {
    props.onSkip();
    navigationService.replace('Logout');
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.showCbnPromptModal}
        // onRequestClose={() => {
        //   props.updateCbnPromptModal();
        // }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.header} bold black>
                  Complete your KYC{' '}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 20,
              }}>
              <Text style={styles.textStyle}>
                {' '}
                Please provide your complete KYC documentation so you can
                continue transacting.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 15,
                paddingHorizontal: 10,
              }}>
              <Button
                onPress={onPressNext}
                title="Provide your KYC"
                buttonStyle={{backgroundColor: COLOUR_BLUE}}
                containerStyle={{
                  backgroundColor: COLOUR_BLUE,
                  width: '100%',
                }}
              />
            </View>
            {!force && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 15,
                  paddingHorizontal: 10,
                }}>
                <Button
                  onPress={props.onSkip}
                  title="Skip"
                  buttonStyle={{
                    backgroundColor: COLOUR_OFF_WHITE,
                    borderRadius: 2,
                  }}
                  containerStyle={{
                    backgroundColor: COLOUR_OFF_WHITE,
                    width: '100%',
                    borderRadius: 2,
                  }}
                  titleStyle={{
                    color: COLOUR_BLACK,
                  }}
                />
              </View>
            )}

            {force && (
              <View
                style={{
                  paddingVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>Don't have your KYC?</Text>
                <TouchableOpacity onPress={onLogout}>
                  <Text
                    style={{
                      color: COLOUR_LINK_BLUE,
                      fontSize: 16,
                      marginLeft: 3,
                      fontFamily: FONT_FAMILY_BODY_BOLD,
                    }}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
