import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import BaseForm from '../../../../../../components/base-form';
import Button from '../../../../../../components/button';
import FormPicker from '../../../../../../components/form-controls/form-picker';
import Header from '../../../../../../components/header';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_RED,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../constants/styles';
import UserManagement from '../../../../../../services/api/resources/user-management';

const windowHeight = Dimensions.get('window').height;

export default class PosRequestDetailsScene extends BaseForm {
  userManagement = new UserManagement();

  requiredFields = ['posModel'];

  state = {
    searchTerm: '',
    search: false,
    data: [],
    count: 0,
    isLoading: false,
    posModel: null,
    posModels: [],
    posDescription: null,
  };

  persistenceKey = 'posModels';
  persistenceKey2 = 'selectedPosModel';
  persistenceKey3 = 'selectedPosData';

  componentDidMount() {
    // this.getAllPosModels();
    this.getPosModels();
  }

  async getPosModels() {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey);
    return this.setState({
      posModels: JSON.parse(jsonString),
    });
  }

  getPosImage(link) {
    // const REACT_APP_POS_IMAGE = "https://mufasa.k8.isw.la/p";
    const REACT_APP_POS_IMAGE = 'https://mufasa.qa.interswitchng.com/p';
    // Alert.alert("Not Found", `${REACT_APP_POS_IMAGE}` + "/" + link.slice(6));
    return link && `${REACT_APP_POS_IMAGE}` + '/' + link.slice(6);
  }

  render() {
    const image =
      this.state.posDescription === null
        ? null
        : this.getPosImage(this.state.posDescription[0]?.terminalImage);

    const screenContent = () => {
      return (
        <View
          style={{
            backgroundColor: COLOUR_WHITE,
            flex: 1,
            paddingHorizontal: 30,
            paddingBottom: 10,
          }}>
          {this.state.posModel && (
            <View
              style={{
                height: windowHeight * 0.65,
                position: 'relative',
              }}>
              {this.state.posDescription[0]?.terminalImage ? (
                <Image
                  source={{
                    uri: this.getPosImage(
                      this.state.posDescription[0]?.terminalImage,
                    ),
                  }}
                  style={{
                    resizeMode: 'contain',
                    width: '100%',
                    height: '45%',
                    borderWidth: 1,
                    borderColor: '#eeeeee',
                    marginBottom: 15,
                  }}
                />
              ) : (
                <Image
                  source={require('./pos.png')}
                  style={{
                    resizeMode: 'contain',
                    width: '100%',
                    height: '45%',
                  }}
                />
              )}
              <ScrollView>
                <Text
                  bold
                  style={{
                    color: COLOUR_BLACK,
                    lineHeight: 25,
                    fontSize: 15,
                  }}>
                  {this.state.posDescription[0]?.terminalDescription
                    ? this.state.posDescription[0]?.terminalDescription
                    : 'This Android POS terminal is a portable device that can be used to accept payments from customers for goods and services. It typically consists of a touchscreen display, a card reader, a printer, and a battery. The device runs on the Android operating system, which allows it to run various payment applications. To use the Android POS terminal, you simply need to connect it to a power source and turn it on. Once the device is on, you can launch the payment application and select the type of transaction you want to process. For example, you can choose to accept a debit or credit card payment, or even process mobile payments.'}
                </Text>
              </ScrollView>
            </View>
          )}
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <React.Fragment>
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
                onPress={() => this.props.navigation.replace('POSManagement')}
              />
            }
            hideNavigationMenu={this.props.hideNavigator}
            showNavigationMenu={this.props.showNavigator}
            statusBarProps={{
              backgroundColor: 'transparent',
              barStyle: CONTENT_LIGHT,
            }}
            title="Request POS"
            titleStyle={{
              color: COLOUR_WHITE,
              fontWeight: 'bold',
            }}
            rightComponent
          />
          <FormPicker
            loading
            // choices={this.state?.posModels?.map((terminal) => ({
            //   label: terminal?.terminalModel,
            //   value: terminal?.terminalModel,
            // }))}
            choices={
              this.state?.posModels
                ? this.state?.posModels?.map(terminal => ({
                    label: terminal?.terminalModel,
                    value: terminal?.terminalModel,
                  }))
                : []
            }
            defaultValue={this.state.posModel}
            innerContainerStyle={styles.formInputInnerContainerStyle}
            outerContainerStyle={styles.formInputOuterContainerStyle}
            onSelect={posModel => {
              this.setState({posModel});

              AsyncStorage.setItem(
                this.persistenceKey2,
                JSON.stringify(posModel),
              );
              const filtered = this.state.posModels.filter(item => {
                return item.terminalModel === posModel;
              });
              AsyncStorage.setItem(
                this.persistenceKey3,
                JSON.stringify(filtered),
              );
              // console.log(filtered, "POS MODEL SELECTED");
              this.setState({
                posDescription: filtered,
              });
            }}
            propagateError={this.props.propagateFormErrors}
            text="POS Model:"
            validators={{
              required: true,
            }}
          />
          {screenContent()}
          {this.state.posModel && (
            <Button
              onPress={() => {
                this.props.navigation.navigate('PosRequestSubmitScene');
              }}
              title="REQUEST"
              buttonStyle={{backgroundColor: COLOUR_BLUE}}
              containerStyle={{
                backgroundColor: COLOUR_BLUE,
                margin: 30,
              }}
              // disabled={!this.state.posModel}
            />
          )}
        </React.Fragment>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // formInputInnerContainerStyle: {
  //   margin: 30,
  // },
  formInputOuterContainerStyle: {
    margin: 30,
  },
});
