import React, {useCallback, useEffect, useState} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';

import PropTypes from 'prop-types';
import {Icon} from 'react-native-elements';

import {SEEN_FEATURES} from '../constants';
import {COLOUR_BLUE, FONT_SIZE_SMALL} from '../constants/styles';
import StepByStepGuideScene from '../scenes/step-by-step-guide';
import {loadData, saveData} from '../utils/storage';
import Text from './text';

export function Banner({
  canClose,
  description,
  iconName,
  onClose,
  style,
  title,
  showMoreDetails,
  hasMoreDetails,
}) {
  return (
    <View style={[styles.container, style]}>
      {Boolean(title) && (
        <View style={styles.titleContainer}>
          <View style={styles.rowContainer}>
            {iconName && (
              <Icon
                color={COLOUR_BLUE}
                name={iconName}
                size={20}
                containerStyle={styles.iconStyle}
                type={'font-awesome'}
              />
            )}
            <Text bold mid style={{color: COLOUR_BLUE}}>
              {title}
            </Text>
          </View>
          {canClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon color={'#AAB7C6'} name={'x'} size={24} type={'feather'} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <TouchableOpacity onPress={showMoreDetails}>
        <Text
          style={{
            color: COLOUR_BLUE,
            fontSize: Boolean(title) ? FONT_SIZE_SMALL : 14,
            lineHeight: Boolean(title) ? 14 : 18,
          }}>
          {`${description} `}
          {hasMoreDetails && (
            <Text bold style={styles.link}>
              See the step by step guide
            </Text>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function FeatureBanner({guide, uid, ...props}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [seenFeatures, setSeenFeatures] = useState(null);
  const [toShow, setToShow] = useState(false);

  useEffect(() => {
    loadData(SEEN_FEATURES).then(data => {
      const jsonData = JSON.parse(data || '[]');
      console.log({jsonData});
      setSeenFeatures(jsonData);
    });
  }, []);

  useEffect(() => {
    if (seenFeatures === null) return;

    console.log({seenFeatures});
    setToShow(!seenFeatures.includes(uid));
  }, [seenFeatures]);

  const onClose = useCallback(() => {
    seenFeatures.push(uid);
    setSeenFeatures(seenFeatures);
    saveData(SEEN_FEATURES, seenFeatures);
    setToShow(false);
  }, [seenFeatures]);

  if (!toShow) return <React.Fragment />;

  return (
    <View>
      {Boolean(guide.step_by_step_guide) && (
        <Modal
          animationType="slide"
          onRequestClose={() => setModalVisible(!modalVisible)}
          transparent={true}
          visible={modalVisible}>
          <StepByStepGuideScene
            onClose={() => setModalVisible(!modalVisible)}
            guide={guide}
          />
        </Modal>
      )}
      <Banner
        canClose={true}
        description={guide.short_description}
        hasMoreDetails={Boolean(guide.step_by_step_guide)}
        iconName={guide.icon_name}
        onClose={onClose}
        showMoreDetails={() => setModalVisible(true)}
        title={guide.banner_title}
        {...props}
      />
    </View>
  );
}

Banner.propTypes = {
  canClose: PropTypes.bool,
  description: PropTypes.string,
  hasMoreDetails: PropTypes.bool,
  iconName: PropTypes.string,
  navigation: PropTypes.object,
  onClose: PropTypes.func,
  showMoreDetails: PropTypes.func,
  style: PropTypes.object,
  title: PropTypes.string,
};

FeatureBanner.propTypes = {
  guide: PropTypes.object,
  style: PropTypes.object,
  uid: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  closeButton: {},
  container: {
    backgroundColor: '#EBF8FE',
    borderColor: '#A8D6EF',
    borderRadius: 4,
    borderWidth: 1,
    padding: 16,
  },
  iconStyle: {
    marginRight: 8,
  },
  link: {
    color: COLOUR_BLUE,
    fontSize: FONT_SIZE_SMALL,
    lineHeight: 14,
    textDecorationLine: 'underline',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
  },
});

export default FeatureBanner;
