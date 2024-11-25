import React, { Component } from "react";

import {
    Text,
    View,
    Image,
    ScrollView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Dimensions
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import flags from "../../../assets/images/flags/flags";
import countries from "../../lib/utils/countries";
import { scale } from "../../lib/utils/scaleUtils";
import { updateUserData } from "../../screens/Auth/action/auth_actions";
import { connect } from "react-redux";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
//filteredCountryList
class FlagSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            countries,
            country_code: {
                label: `Nigeria`,
                value: "NG",
                code: "+234",
                imageUrl: flags.nigeria
            }
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        // let countries = this.props.countries.map((country) => {
        //     return {
        //         label: country.name,
        //         value: country.code,
        //         code: '',
        //         imageUrl: flags[country.name.split(" ").join("_").toLowerCase()]
        //     }
        // })

        // let countries = countries;

        let country = countries.filter(country => {
            return country.value === this.props.auth.selectedCountryCode;
        })[0] || {
            label: `Nigeria`,
            value: "NG",
            code: "",
            imageUrl: flags.nigeria
        };

        this.setState({
            country_code: country,
            countries
        });
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.auth.selectedCountryCode !== this.props.auth.selectedCountryCode
        ) {
            let country = this.state.countries.filter(country => {
                return country.value === this.props.auth.selectedCountryCode;
            })[0];

            this.setState({
                country_code: country
            });
        }

        if (this.props.filteredCountryList !== prevProps.filteredCountryList) {
            //filter through new country list props and update generic list.
            let filteredCountryList = [];
            if (this.props.filteredCountryList) {
                this.props.filteredCountryList.map(countryFilter => {
                    this.state.countries.map(country => {
                        if (country.value === countryFilter.countryCode) {
                            filteredCountryList.push(country);
                        }
                    });
                });
                this.setState({
                    countries: filteredCountryList
                });
            }
        }

        if (!this.props.isFlagVisible && prevProps.isFlagVisible) {
            this.closeModal();
        }
    }

    render() {
        let optionItems = this.state.countries.map(item => {
            let icon = item.imageUrl;
            return (
                <TouchableHighlight
                    key={item.value}
                    underlayColor="#f7f7f7"
                    activeOpacity={0.75}
                    onPress={() => {
                        this.setValue(item);
                    }}
                >
                    <View
                        style={{
                            borderBottomColor: "#eee",
                            borderBottomWidth: scale(1),
                            height: scale(50),
                            alignItems: "center",
                            flexDirection: "row"
                        }}
                    >
                        {!!item.imageUrl && (
                            <Image
                                style={{
                                    width: scale(30),
                                    height: scale(30),
                                    marginLeft: scale(10),
                                    marginRight: scale(10),
                                    marginTop: scale(10),
                                    marginBottom: scale(10),
                                    borderRadius: scale(5)
                                }}
                                source={icon}
                                resizeMode={"contain"}
                            />
                        )}
                        <Text style={[styles.options, { ...this.props.optionsStyle }]}>
                            {item.label}
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        });

        // let imageUrl = this.state.country_code.imageUrl;
        let textColor = "";

        let textStyle = { ...this.props.textStyle };
        if (textColor) {
            textStyle.color = textColor;
        }

        let country_Code = {
            label: `Nigeria`,
            value: "NG",
            code: "",
            imageUrl: flags.nigeria
        };
        if (this.state.country_code) {
            country_Code = { ...this.state.country_code };
        }

        let icon = country_Code.imageUrl;

        return (
            <React.Fragment>
                <View style={[styles.container, this.props.style]}>
                    <TouchableWithoutFeedback
                        onPress={this.state.showModal ? this.closeModal : this.openModal}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                height: "100%",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "space-between"
                                // backgroundColor: 'red'
                            }}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {
                                    <Image
                                        style={{
                                            width: scale(22),
                                            height: scale(16),
                                            marginTop: 0,
                                            borderRadius: scale(2)
                                        }}
                                        source={icon}
                                    />
                                }
                                {/*<Text style={[styles.text, {...textStyle}]}>{text}</Text>*/}
                            </View>
                            <MaterialIcons
                                name={
                                    this.state.showModal
                                        ? "keyboard-arrow-up"
                                        : "keyboard-arrow-down"
                                }
                                size={scale(20)}
                                color={"#666"}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {this.state.showModal && (
                    <View style={[styles.modal, this.props.modalStyle]}>
                        <ScrollView
                            style={{
                                maxHeight: scale(300),
                                backgroundColor: "white",
                                borderRadius: 0,
                                minWidth: scale(50),
                                maxWidth: scale(150),
                                alignSelf: "center"
                            }}
                            alwaysBounceVertical={false}
                        >
                            {optionItems}
                        </ScrollView>
                    </View>
                )}
                {this.state.showModal && (
                    <TouchableWithoutFeedback onPress={this.closeModal}>
                        <View
                            style={{
                                backgroundColor: "transparent",
                                flex: 1,
                                height: deviceHeight,
                                width: deviceWidth,
                                position: "absolute",
                                zIndex: 999
                            }}
                        ></View>
                    </TouchableWithoutFeedback>
                )}
            </React.Fragment>
        );
    }

    setValue(valueObj) {
        this.props.updateUserData({
            selectedCountryCode: valueObj.value
        });

        this.setState({
            showModal: false
        });

        if (this.props.onChange) {
            this.props.onChange(valueObj);
        }
    }

    openModal() {
        if (this.props.disabled) return;
        this.setState(
            {
                showModal: true
            },
            () => this.props.showFlag(true)
        );
    }

    closeModal() {
        this.setState(
            {
                showModal: false
            },
            () => this.props.showFlag(false)
        );
    }
}

let styles = {
    container: {
        flexDirection: "row",
        // marginBottom: 40,
        // marginRight: 15,
        // borderBottomColor: '#aaa',
        // borderBottomWidth: 1,
        // paddingTop: 7,
        // paddingBottom: 7,
        width: scale(50),
        // alignItems: "flex-start"
        alignItems: "center"
    },
    text: {
        // flex: 1,
        fontSize: scale(16)
    },
    options: {
        fontSize: scale(14),
        color: "#484848",
        fontFamily: "SFProText-Regular",
        paddingLeft: scale(5),
        paddingRight: scale(10)
    },
    image: {
        height: scale(8),
        width: scale(8)
    },
    modal: {
        position: "absolute",
        top: scale(30),
        right: scale(20),
        zIndex: 9999999,
        shadowColor: "rgba(0, 0, 0, 0.10000000149011612)",
        shadowOffset: {
            width: 0,
            height: scale(2)
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor: "green"
    }
};

const mapStateToProps = state => {
    return {
        auth: state.authentication,
        home: state.home,
        countries: state.countries
    };
};

const mapDispatchToProps = { updateUserData };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlagSelect);
