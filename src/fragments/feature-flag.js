import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { APP_VERSION } from '../constants/api-resources';
import { getVersionNumber } from '../utils/helpers';
import { loadData, saveData } from '../utils/storage';
import { COLOUR_GREEN } from '../constants/styles';
import { View } from 'react-native';
import Text from '../components/text';
import {
  doesUserBelongToDomain, doesUserHavePermission,
} from '../utils/user-privileges';


export const BEHAVIOURS = {
  DISABLE: 'disable',
  HIDE: 'hide',
  OVERLAY_MESSAGE: 'overlay_message',
};
const USED_FEATURES = 'USED_FEATURES';


async function hasFeatureBeenUsed(uid) {
  const usedFeatures = JSON.parse(
    await loadData(USED_FEATURES) || '[]'
  );

  return usedFeatures.includes(uid)
}

async function markFeatureAsUsed(uid) {
  const usedFeatures = JSON.parse(
    await loadData(USED_FEATURES) || '[]'
  );

  await saveData(
    USED_FEATURES,
    [
      ...usedFeatures,
      uid
    ]
  );

}

async function isFeatureNew(uid, targetVersion) {
  return (
    !await hasFeatureBeenUsed(uid, targetVersion) &&
    getVersionNumber(APP_VERSION) == getVersionNumber(targetVersion)
  );
}

export function FeatureFlagNewBadge({style, textStyle}) {
  return <View style={{backgroundColor: COLOUR_GREEN, padding: 4, ...style}}>
    <Text bold small upperCase white style={textStyle}>New</Text>
  </View>;
}

function FeatureFlag({behaviour, children, requiredDomain, requiredDomains, requiredPermission, targetVersion, uid}) {
  const [userBelongsToDomain, setUserBelongsToDomain] = useState(null);
  const [userHasPermission, setUserHasPermission] = useState(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    targetVersion && isFeatureNew(uid, targetVersion).then(
        (isNew) => setIsNew(isNew),
    );
  
    requiredPermission 
      ? doesUserHavePermission(requiredPermission).then(
        hasPermission => setUserHasPermission(hasPermission)
      ) : setUserHasPermission(true);
  
    requiredDomain
      ? doesUserBelongToDomain(requiredDomain).then(
        userBelongsToDomain => setUserBelongsToDomain(userBelongsToDomain)
      ) : setUserBelongsToDomain(true);
    
    if (requiredDomains) {
      requiredDomains.some(async (domainType) => {
        const userBelongsToDomain = await doesUserBelongToDomain(domainType);
        setUserBelongsToDomain(userBelongsToDomain);
        return userBelongsToDomain;
      });
    } else {
      setUserBelongsToDomain(true);
    }
  }, [requiredDomain, requiredDomains, requiredPermission, uid, targetVersion])

  const isPermitted = userHasPermission && userBelongsToDomain;

  if (!isPermitted && behaviour === BEHAVIOURS.HIDE) return null;

  return (
    children({
      disabled: !isPermitted && behaviour === BEHAVIOURS.DISABLE,
      isNew,
      onUseFeature: () => markFeatureAsUsed(uid),
    })
  );
}

FeatureFlag.defaultProps = {
  behaviour: BEHAVIOURS.HIDE,
};

FeatureFlag.propTypes = {
  behaviour: PropTypes.string,
  requiredDomain: PropTypes.string,
  requiredDomains: PropTypes.array,
  requiredPermission: PropTypes.string,
  targetVersion: PropTypes.string,
  uid: PropTypes.string.isRequired,
};

export default memo(FeatureFlag);
