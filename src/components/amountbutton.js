import React from 'react';
import { View } from 'react-native';
import { Button as RneButton } from 'react-native-elements';
import { COLOUR_OFF_WHITE } from '../constants/styles';

export default class AmountButton extends React.Component {
    transparentStyle = {
        backgroundcolor: 'transparent',
        color: COLOUR_OFF_WHITE,
    }
    render() {
        letpreferredStyle = {}
        const props = this.props

        if (props.transaparent) {
            preferredStyle = this.transparentStyle
        }
        if (props.hidden) {
            return <view />
        }

        return <RneButton
            {...props}
            buttonStyle={{
                backgroundColor: 'transparent',
                color: COLOUR_OFF_WHITE,
                //borderRadius: 25,
                padding: 12,
                ...props.buttonStyle,
            }}
            containerStyle={{
                backgroundColor: COLOUR_OFF_WHITE,
                //borderRadius: 25,
                opacity: props.loading ? .6 : 1,
                ...props.containerStyle,
                //...preferredStyle
            }}
            onPressOut={undefined}
            onPress={this.props.onPress || this.props.onPressOut}
            titleStyle={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                ...props.titleStyle
            }}
        />
    }
}
