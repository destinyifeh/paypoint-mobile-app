import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Button from '../../../../../../components/button';
import ClickableListItem from '../../../../../../components/clickable-list-item';
import FormInput from '../../../../../../components/form-controls/form-input';
import Header from '../../../../../../components/header';
import Modal from '../../../../../../components/modal';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import Platform from '../../../../../../services/api/resources/platform';
import UserManagement from '../../../../../../services/api/resources/user-management';

export default class PosConcorConfirmationScene extends React.Component {
  userManagement = new UserManagement();
  platform = new Platform();
  state = {
    showSuccessModal: false,
    error: '',
    posRequestId: null,
    inputs: [],
    terminalId: '',
    loading: false,
    isLoading: false,
    responseData: {},
  };

  persistenceKeyPos = 'persistenceKey';

  async handleAddInput() {
    if (this.state.terminalId !== '') {
      this.setState({
        loading: true,
      });
      const {response, code} = await this.userManagement.validatePosTerminal(
        this.state.terminalId,
      );
      this.setState({
        loading: false,
      });

      if (code == '409' || code == '404' || code == '400' || code == '500') {
        this.setState({
          error: response.description,
        });
      } else {
        this.state.inputs.push(this.state.terminalId);
        this.setState({
          terminalId: '',
        });
      }
    }
  }

  handleInputChange(e) {
    this.setState({
      error: '',
      terminalId: e.trim(),
    });
  }

  handleCancelInput(index) {
    const newInputs = [...this.state.inputs];
    newInputs.splice(index, 1);
    this.setState({
      inputs: newInputs,
    });
  }

  async componentDidMount() {
    const jsonString = await AsyncStorage.getItem(this.persistenceKeyPos);
    this.setState({posRequestId: JSON.parse(jsonString)});
  }

  async sendRequest() {
    this.setState({
      isLoading: true,
    });
    const {code, response} = await this.userManagement.postConcurDelivery(
      this.state.posRequestId,
      this.state.inputs,
    );
    if (code == '200') {
      this.setState({
        isLoading: false,
        // showSuccessModal: true,
        terminalId: '',
        inputs: [],
        responseData: response.data,
        responseMessage: response.description,
      });
      if (
        response.data?.failed.length === 0 ||
        response.data?.failed.length === []
      ) {
        Alert.alert('Success', 'Request Successful.');
        setTimeout(() => {
          this.props.navigation.replace('Agent');
        }, 4000);
      } else {
        this.setState({
          showSuccessModal: true,
        });
      }
    } else {
      this.setState({
        isLoading: false,
      });
      Alert.alert('Operation failed', response.description);
    }
  }

  get successModal() {
    return (
      <Modal
        buttons={[
          {
            onPress: () => {
              this.setState({showSuccessModal: false});
              this.props.navigation.replace('Agent');
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: '100%',
            },
            title: 'Okay',
          },
        ]}
        content={
          <ScrollView
            contentContainerStyle={{
              flex: 0.6,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 7,
                borderBottom: 'solid',
                borderBottomWidth: 2,
                borderBottomColor: COLOUR_BLUE,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  width: '50%',
                }}>
                Terminal ID
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  width: '50%',
                }}>
                Status
              </Text>
            </View>

            <>
              <FlatList
                data={this.state.responseData?.successful}
                keyExtractor={item => item?.terminalId}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 7,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          width: '50%',
                        }}>
                        {item?.terminalId}
                      </Text>
                      <Text
                        style={{
                          color: 'green',
                          fontSize: 15,
                          width: '50%',
                        }}>
                        {item?.message}
                      </Text>
                    </View>
                  );
                }}
              />
              <FlatList
                data={this.state.responseData?.failed}
                keyExtractor={item => item?.terminalId}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 7,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          width: '50%',
                        }}>
                        {item?.terminalId}
                      </Text>
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 15,
                          width: '50%',
                        }}>
                        {item?.message}
                      </Text>
                    </View>
                  );
                }}
              />
            </>
          </ScrollView>
        }
        isModalVisible={true}
        size="md"
        title="Requests"
        withButtons
        hideCloseButton
      />
    );
  }

  renderResposeDataListItem(item) {
    const {terminalId, message} = item;

    return (
      <ClickableListItem>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            margin: 10,
          }}>
          <Flag id={message} size={0.2} />
          <Text style={{marginLeft: 10}}>{countryName}</Text>
        </View>
      </ClickableListItem>
    );
  }

  render() {
    const windowHeight = Dimensions.get('window').height;

    const screenContent = () => {
      return (
        <ScrollView
          contentContainerStyle={{
            marginTop: 0,
          }}>
          <Text bold big style={{color: COLOUR_BLACK, marginBottom: 5}}>
            Terminal ID
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 2,
            }}>
            <FormInput
              hideOptionalLabel
              outerContainerStyle={{
                borderBottomColor: 'red',
                width: '75%',
              }}
              innerContainerStyle={{
                elevation: 5,
              }}
              onChangeText={e => {
                this.handleInputChange(e.trim());
              }}
              placeholder="Enter Terminal ID"
              defaultValue={this.state.terminalId}
              disabled={this.state.isLoading}
            />
            <Button
              onPress={() => {
                this.handleAddInput();
              }}
              title="Add ID"
              buttonStyle={{backgroundColor: COLOUR_BLUE}}
              containerStyle={{
                backgroundColor: COLOUR_BLUE,
                marginHorizontal: 5,
                marginBottom: 8,
                width: '24%',
              }}
              disabled={this.state.terminalId === '' || this.state.loading}
              loading={this.state.loading}
            />
          </View>
          <Text
            style={{
              color: 'tomato',
              fontSize: 14,
              maxWidth: '70%',
            }}>
            {this.state.error}
          </Text>
          <View>
            {this.state.inputs.map((id, index) => {
              return (
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    marginVertical: 10,
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        width: '85%',
                        borderRadius: 5,
                        color: COLOUR_WHITE,
                        backgroundColor: COLOUR_BLUE,
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        fontSize: 16,
                      }}>
                      {id}
                    </Text>
                    <ClickableListItem
                      onPress={() => {
                        this.handleCancelInput(index);
                      }}
                      style={{
                        borderRadius: 50,
                        backgroundColor: '#FF6347',
                        width: 20,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 10,
                      }}>
                      <Text
                        bold
                        big
                        style={{
                          color: COLOUR_WHITE,
                          fontSize: 20,
                        }}>
                        X
                      </Text>
                    </ClickableListItem>
                  </View>
                </View>
              );
            })}
          </View>
          {/* )} */}
        </ScrollView>
      );
    };
    return (
      <View
        style={{
          backgroundColor: '#F3F3F4',
          flex: 1,
        }}>
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
              onPress={() => this.props.navigation.replace('Agent')}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title="POS Receipt Confirmation"
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />
        {this.state.showSuccessModal && this.successModal}
        <View
          style={{
            padding: 30,
            height: windowHeight * 0.95,
          }}>
          {screenContent()}
          <Button
            onPress={() => {
              this.sendRequest();
            }}
            title="SUBMIT"
            buttonStyle={{backgroundColor: COLOUR_BLUE}}
            containerStyle={{
              backgroundColor: COLOUR_BLUE,
              marginVertical: 30,
            }}
            disabled={this.state.inputs?.length === 0 || this.state.isLoading}
            loading={this.state.isLoading}
          />
        </View>
      </View>
    );
  }
}
