import React from 'react';
import { 
  Dimensions,
  StatusBar, 
  StyleSheet, 
  View 
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { COLOUR_WHITE, COLOUR_BLUE } from '../../constants/styles';
import Button from '../../components/button';
import { ScrollView } from 'react-native-gesture-handler';
import FirstSlide from './slides/first';
import SecondSlide from './slides/second';
import ThirdSlide from './slides/third';

const windowWidth = Dimensions.get('window').width

export default class WelcomeScene extends React.Component {
  constructor() {
    super()

    this.state = {
      activeSlide: 0,
      slides: [
        () => <FirstSlide />,
        () => <SecondSlide />,
        () => <ThirdSlide />
      ]
    };

    this.showNextSlide = this.showNextSlide.bind(this);
    this.showPreviousSlide = this.showPreviousSlide.bind(this);
  }

  get pagination () {
    const { slides, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={slides.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  onScrollTouchEnd(event) {
    this._scrollView
    // this._scrollView
  }

  showNextSlide() {
    const { currentSlide } = this.state;
    const nextSlide = currentSlide + 1;

    this._scrollView.getScrollResponder().scrollTo({
      animated: true,
      x: windowWidth * nextSlide,
      y: 0
    });

    this.setState({
      currentSlide: nextSlide
    });
  }

  showPreviousSlide() {
    const { currentSlide } = this.state;
    const previousSlide = currentSlide - 1;

    this._scrollView.getScrollResponder().scrollTo({
      animated: true,
      x: windowWidth * previousSlide,
      y: 0
    });

    this.setState({
      currentSlide: previousSlide
    });
  }
  
  _renderItem = ({item, index}) => {
    return item()
  }

  render() {
    return <View style={styles.welcomeSceneContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOUR_WHITE} translucent={true} />

      <Carousel
        data={this.state.slides}
        onSnapToItem={(index) => this.setState({ activeSlide: index }) }
        ref={(c) => { this._carousel = c; }}
        renderItem={this._renderItem}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
      />
      { this.pagination }
      
      {this.state.activeSlide === this.state.slides.length - 1 && <Button
        containerStyle={{
          position: 'absolute',
          top: 35,
          right: 10
        }}
        onPress={() => this.props.navigation.replace('Landing')}
        title="CONTINUE"
        titleStyle={{
          color: COLOUR_BLUE
        }}
        transparent
      />}
    </View>
  }

  oldRender() {
    return <View style={styles.welcomeSceneContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOUR_WHITE} translucent={true} />
      
      <ScrollView 
        horizontal 
        pagingEnabled={true} 
        persistentScrollbar
        ref={(view) => this._scrollView = view}
        style={styles.scrollView} 
        onTouchEnd={this.onScrollTouchEnd}
      >
        <FirstSlide />
        <SecondSlide />
        <ThirdSlide />
      </ScrollView>

      <View style={styles.footer}>
        {/* <Hyperlink href="Landing" replace> */}
          <Button
            hidden={this.state.currentSlide === 0}
            onPress={this.showPreviousSlide}
            title="Previous"
            titleStyle={{
              color: COLOUR_BLUE
            }}
            transparent
          />
        {/* </Hyperlink> */}

        {/* <Hyperlink href="Landing" replace> */}
          {this.state.currentSlide === 2 ? <Button 
            onPress={() => this.props.navigation.navigate('Landing')}
            title="Skip"
            titleStyle={{
              color: COLOUR_BLUE
            }}
            transparent
          /> : <Button
            hidden={this.state.currentSlide === 2}
            onPress={this.showNextSlide}
            title="Next"
            titleStyle={{
              color: COLOUR_BLUE
            }}
            transparent
          />}
        {/* </Hyperlink> */}
      </View>

    </View>
  }
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    flex: .2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  scrollView: {
    flex: .8
  },
  welcomeSceneContainer: {
    backgroundColor: COLOUR_WHITE,
    flex: 1
  }
})
