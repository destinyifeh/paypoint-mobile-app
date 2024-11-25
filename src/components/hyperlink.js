import React from 'react';
import {
  COLOUR_LINK_BLUE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_SIZE_TITLE,
  LINE_HEIGHT_TITLE,
} from '../constants/styles';

import navigationService from '../utils/navigation-service';
import Text from './text';

class Hyperlink extends React.Component {
  hasNavigated = false;
  hasReplaced = false;

  //   navigate() {
  //     this.props.replace ? this.props.navigation.replace(this.props.href) : this.props.navigation.navigate(this.props.href)
  //     this.props.replace ? this.hasReplaced = true : this.hasNavigated = true;
  //   }

  //   render () {
  //     return <Text {...this.props} style={{
  //       color: COLOUR_LINK_BLUE,
  //       fontFamily: this.props.bold ? FONT_FAMILY_BODY_BOLD : FONT_FAMILY_BODY,
  //       fontSize: FONT_SIZE_TITLE,
  //       lineHeight: LINE_HEIGHT_TITLE,
  //       ...this.props.style
  //     }} onPress={() => this.props.onPress ? this.props.onPress() : this.navigate()}>
  //       {this.props.children}
  //     </Text>
  //   }
  // }

  // export default withNavigation(Hyperlink);

  //added by Dez

  navigate = () => {
    const {replace, navigation, href} = this.props;
    if (replace) {
      navigationService.replace(href);
      this.hasReplaced = true;
    } else {
      navigationService.navigate(href);
      this.hasNavigated = true;
    }
  };

  render() {
    const {bold, style, onPress, children} = this.props;

    return (
      <Text
        {...this.props}
        style={{
          color: COLOUR_LINK_BLUE,
          fontFamily: bold ? FONT_FAMILY_BODY_BOLD : FONT_FAMILY_BODY,
          fontSize: FONT_SIZE_TITLE,
          lineHeight: LINE_HEIGHT_TITLE,
          ...style,
        }}
        onPress={() => (onPress ? onPress() : this.navigate())}>
        {children}
      </Text>
    );
  }
}

export default Hyperlink;
