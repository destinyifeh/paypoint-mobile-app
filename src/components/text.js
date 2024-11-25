import React from 'react';
import {PixelRatio, Text as RnText} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import {CASUAL} from '../constants/dialog-priorities';
import {
  COLOUR_BLACK,
  COLOUR_BLUE,
  COLOUR_GREEN,
  COLOUR_GREY,
  COLOUR_LIGHT_GREY,
  COLOUR_LINK_BLUE,
  COLOUR_ORANGE,
  COLOUR_RED,
  COLOUR_WHITE,
  FONT_FAMILY_BODY,
  FONT_FAMILY_BODY_BOLD,
  FONT_FAMILY_BODY_SEMIBOLD,
  FONT_FAMILY_BODY_THIN,
  FONT_SIZE_BIG,
  FONT_SIZE_BIGGER,
  FONT_SIZE_BIGGEST,
  FONT_SIZE_MID,
  FONT_SIZE_SMALL,
  FONT_SIZE_TITLE,
  LINE_HEIGHT_BIG,
  LINE_HEIGHT_BIGGER,
  LINE_HEIGHT_BIGGEST,
  LINE_HEIGHT_SMALL,
} from '../constants/styles';
import {flashMessage} from '../utils/dialog';

const COPIED_TO_CLIPBOARD = 'Copied to clipboard!';

export default class Text extends React.Component {
  render() {
    const screenDensity = PixelRatio.get();

    const specifiedStyle = {
      fontFamily: FONT_FAMILY_BODY,
      fontSize: 16,
    };

    let receiptLineItemFont = 12;
    if (screenDensity >= 2.5) {
      receiptLineItemFont = 12;
    } else if (screenDensity >= 1.75) {
      receiptLineItemFont = 11;
    } else if (screenDensity >= 1) {
      receiptLineItemFont = 10;
    }

    if (this.props.blue) {
      specifiedStyle.color = COLOUR_BLUE;
    }

    if (this.props.bold) {
      specifiedStyle.fontFamily = FONT_FAMILY_BODY_BOLD;
      // specifiedStyle.fontWeight = 'bold'
    }

    if (this.props.isFailedStatus) {
      specifiedStyle.color = COLOUR_RED;
    }

    if (this.props.isPendingStatus) {
      specifiedStyle.color = COLOUR_ORANGE;
    }

    if (this.props.isSuccessStatus) {
      specifiedStyle.color = COLOUR_GREEN;
    }

    if (this.props.isStatus) {
      specifiedStyle.fontSize = FONT_SIZE_SMALL;
    }

    if (this.props.black) {
      specifiedStyle.color = COLOUR_BLACK;
    }

    if (this.props.big) {
      specifiedStyle.fontSize = FONT_SIZE_BIG;
      specifiedStyle.lineHeight = LINE_HEIGHT_BIG;
    }

    if (this.props.bigger) {
      specifiedStyle.fontSize = FONT_SIZE_BIGGER;
      specifiedStyle.lineHeight = LINE_HEIGHT_BIGGER;
    }

    if (this.props.biggest) {
      specifiedStyle.fontSize = FONT_SIZE_BIGGEST;
      specifiedStyle.lineHeight = LINE_HEIGHT_BIGGEST;
    }

    if (this.props.center) {
      specifiedStyle.textAlign = 'center';
      specifiedStyle.textAlignVertical = 'center';
    }

    if (this.props.green) {
      specifiedStyle.color = COLOUR_GREEN;
    }

    if (this.props.justify) {
      specifiedStyle.textAlign = 'left';
    }

    if (this.props.lightBlue) {
      specifiedStyle.color = COLOUR_LINK_BLUE;
    }

    if (this.props.lightGrey) {
      specifiedStyle.color = COLOUR_LIGHT_GREY;
    }

    if (this.props.mid) {
      specifiedStyle.fontSize = FONT_SIZE_MID;
    }

    if (this.props.small) {
      specifiedStyle.fontSize = FONT_SIZE_SMALL;
      specifiedStyle.lineHeight = LINE_HEIGHT_SMALL;
    }

    if (this.props.red) {
      specifiedStyle.color = COLOUR_RED;
    }

    if (this.props.right) {
      specifiedStyle.textAlign = 'right';
    }

    if (this.props.semiBold) {
      specifiedStyle.fontFamily = FONT_FAMILY_BODY_SEMIBOLD;
    }

    if (this.props.thin) {
      specifiedStyle.fontFamily = FONT_FAMILY_BODY_THIN;
    }

    if (this.props.title) {
      specifiedStyle.fontSize = FONT_SIZE_TITLE;
    }

    if (this.props.uppercase) {
      specifiedStyle.textTransform = 'uppercase';
    }

    if (this.props.white) {
      specifiedStyle.color = COLOUR_WHITE;
    }

    if (this.props.receiptLineItem) {
      // screenDensity >= 2.5 ? 11 : 8;
      specifiedStyle.fontSize = receiptLineItemFont;
      // screenDensity >= 2.5 ? 11 : 8;
      specifiedStyle.lineHeight = receiptLineItemFont;
      specifiedStyle.color = specifiedStyle.color || COLOUR_BLACK;
      specifiedStyle.fontFamily =
        specifiedStyle.fontFamily === FONT_FAMILY_BODY_BOLD
          ? FONT_FAMILY_BODY_BOLD
          : FONT_FAMILY_BODY_BOLD;
    }

    const copyContentToClipboard = () => {
      Clipboard.setString(this.props.children);

      flashMessage(null, COPIED_TO_CLIPBOARD, CASUAL);
    };

    return (
      <RnText
        {...this.props}
        onPress={
          this.props.copyOnPress ? copyContentToClipboard : this.props.onPress
        }
        style={{
          color: COLOUR_GREY,
          ...specifiedStyle,
          ...this.props.style,
          fontWeight: 'normal',
        }}>
        {this.props.children}
      </RnText>
    );
  }
}
