import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

import Badge from '../../components/badge';
import Text from '../../components/text';


function CancelButton({ onClose }) {
  return (
    <TouchableOpacity onPress={onClose} style={styles.cancelButtonContainer}>
      <Icon name="x" size={25} type="feather" />
    </TouchableOpacity>
  );
}

function Step({ content, number }) {
  return (
    <View style={styles.stepContainer}>
      <View style={[styles.rowContainer, styles.stepTitleContainer]}>
        <Text
          big
          semiBold
          style={{
            color: '#353F50',
            width: 40,
          }}
        >
          {`${number}.`}
        </Text>
        <Text
          big
          semiBold
          style={{
            color: '#353F50',
          }}
        >
          {content.title}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={{width: 40}} />
        <Text mid style={{color: '#5F738C'}}>{content.body}</Text>
      </View>
    </View>
  );
}


export default function StepByStepGuideScene({ guide, onClose }) {
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar
        animated
        backgroundColor={'#FBE9E9'}
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.header}>
        <Text big center style={styles.titleText}>
          {guide.step_by_step_guide.title}
        </Text>
        <CancelButton onClose={onClose} />
      </View>
      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.contentContainer}
      >
        <Text mid style={styles.shortDescription}>
          {guide.short_description}
        </Text>
        <View style={styles.badgeContainer}>
          <Badge
            backgroundColor='#F3F5F6'
            color='#353F50'
            text='Step by step'
          />
        </View>
        {guide.step_by_step_guide.content.map((value, index) => {
          return <Step content={value} key={index} number={index + 1} />;
        })}
      </ScrollView>
    </View>
  );
}

CancelButton.propTypes = {
  onClose: PropTypes.func,
};

Step.propTypes = {
  content: PropTypes.object,
  number: PropTypes.number,
};

StepByStepGuideScene.propTypes = {
  guide: PropTypes.object,
  onClose: PropTypes.func,
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  cancelButtonContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 21,
    elevation: 4,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 10,
    width: 42,
  },
  contentContainer: {
    elevation: 10,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FBE9E9',
    height: 100,
    justifyContent: 'center',
    padding: 20,
    paddingHorizontal: 40,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  scrollStyle: {
    elevation: 4,
  },
  shortDescription: {
    color: '#5F738C',
    lineHeight: 24,
  },
  stepContainer: {
    marginBottom: 24,
    paddingRight: 30,
  },
  stepTitleContainer: {
    marginBottom: 4,
  },
  titleText: {
    color: '#18425D',
    alignItems: 'center',
  },
});
