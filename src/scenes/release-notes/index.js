import React, { useEffect } from 'react';
import { Linking, ScrollView, View, Image, StatusBar } from 'react-native';

import Header from '../../components/header';
import Hyperlink from '../../components/hyperlink';
import {
  COLOUR_RED,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  COLOUR_GREY,
  CONTENT_DARK,
  COLOUR_GREEN,
  CONTENT_LIGHT,
  COLOUR_LIGHT_GREY
} from '../../constants/styles';
import Text from '../../components/text';
import { Icon } from 'react-native-elements';
import Button from '../../components/button';
import ReleaseNotesData from '../../fixtures/release-notes';
import { APP_VERSION } from '../../constants/api-resources';
import { loadData, saveData } from '../../utils/storage';

const READ_RELEASE_NOTES = 'READ_RELEASE_NOTES';

export async function shouldShowReleaseNotes() {
  const readReleaseNotes = JSON.parse(await loadData(READ_RELEASE_NOTES) || '[]');
  return !readReleaseNotes.includes(APP_VERSION) && ReleaseNotesData[APP_VERSION];
}


function NoteItem({title, description}) {
  return (
    <View style={{alignItems: 'flex-start', flexDirection: 'row', marginVertical: 12}}>
      <Icon 
        color={COLOUR_GREEN}
        name="check"
        size={28}
        type="feather" 
      />
      <View style={{flexDirection: 'column', marginHorizontal: 12, marginRight: 24}}>
        <Text blue bold big style={{lineHeight: 24}}>{title}</Text>
        <Text mid style={{marginTop: 8}}>{description}</Text>
      </View>
    </View>
  )
}

export default function ReleaseNotes({navigation}) {
  const noteItems = ReleaseNotesData[APP_VERSION];

  useEffect(async () => {
    const readReleaseNotes = JSON.parse(await loadData(READ_RELEASE_NOTES) || '[]');

    saveData(
      READ_RELEASE_NOTES,
      [
        ...readReleaseNotes,
        APP_VERSION
      ]
    );
  }, [])

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'transparent'} translucent={true} barStyle={CONTENT_DARK} />
      <ScrollView>
        <Image 
          source={{uri: 'https://mufasa.interswitchng.com/p/finch-agent-mobile-app/assets/images/undraw_Preparation_re_t0ce.png'}} 
          style={{backgroundColor: COLOUR_LIGHT_GREY}} 
          height={260} 
          width={'100%'} 
        />

        <View style={{elevation: 4, padding: 24}}>
          <Text bigger blue bold>What's New?</Text>
          {noteItems.map((value) => <NoteItem {...value} />)}
        </View>
      </ScrollView>
      <View style={{height: 96, padding: 24}}>
        <Button 
          onPress={() => navigation.goBack()}
          title="CONTINUE"
        />
      </View>
    </View>
  );
}
