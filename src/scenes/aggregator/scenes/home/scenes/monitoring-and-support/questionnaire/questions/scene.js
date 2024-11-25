import React from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel from 'react-native-carousel';
import {Icon} from 'react-native-elements';
import Button from '../../../../../../../../components/button';
import Header from '../../../../../../../../components/header';
import Modal from '../../../../../../../../components/modal';
import ProgressBar from '../../../../../../../../components/progress-bar';
import Text from '../../../../../../../../components/text';
import {
  COLOUR_BLUE,
  COLOUR_GREY,
  COLOUR_SCENE_BACKGROUND,
  COLOUR_WHITE,
  CONTENT_LIGHT,
} from '../../../../../../../../constants/styles';
import QuestionSlide from '../../../../../monitoring-and-support/scenes/questionnaire/questions/components/question-slide';

export default class QuestionnaireQuestionsScene extends React.Component {
  constructor() {
    super();

    this.state = {
      activeSlideIndex: 1,
      answers: {},
      questions: QuestionnaireQuestions,
      showConfirmSaveModal: false,
      showSaveSuccessfulModal: false,
    };

    this.onSelectAnswer = this.onSelectAnswer.bind(this);
  }

  onSelectAnswer(question, answer) {
    const {answers} = this.state;
    answers[question] = answer;

    this.setState({
      answers,
    });
  }

  save() {
    this.setState({
      showSaveSuccessfulModal: true,
    });
  }

  get confirmSaveModal() {
    return (
      <Modal
        buttons={[
          {
            transparent: true,
            onPress: () => {
              this.setState({showConfirmSaveModal: false});
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: 150,
            },
            title: 'Cancel',
            titleStyle: {
              color: COLOUR_GREY,
            },
          },
          {
            onPress: () => {
              this.setState({showConfirmSaveModal: false});
              this.save();
            },
            buttonStyle: {
              paddingHorizontal: 10,
            },
            containerStyle: {
              paddingHorizontal: 10,
              width: 150,
            },
            title: 'Ok',
          },
        ]}
        content={
          <View style={{flex: 0.9, justifyContent: 'center'}}>
            <Text big center>
              Do you want to save your answers?
            </Text>
          </View>
        }
        isModalVisible={true}
        size="sm"
        title="Save"
        withButtons
      />
    );
  }

  get saveSuccessfulModal() {
    return (
      <Modal
        button={{
          onPress: () => {
            this.setState({showSaveSuccessfulModal: false});
            this.props.navigation.navigate('QuestionnaireObjectives');
          },
          buttonStyle: {
            paddingHorizontal: 10,
          },
          containerStyle: {
            paddingHorizontal: 10,
            width: '75%',
          },
          title: 'Ok',
        }}
        content={
          <View style={{flex: 0.9, justifyContent: 'center'}}>
            <Text big center>
              Your data has been saved successfully.
            </Text>
          </View>
        }
        isModalVisible={true}
        size="sm"
        title="Success"
        withButton
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showConfirmSaveModal && this.confirmSaveModal}
        {this.state.showSaveSuccessfulModal && this.saveSuccessfulModal}

        <Header
          containerStyle={{
            backgroundColor: COLOUR_BLUE,
          }}
          navigationIconColor={COLOUR_WHITE}
          leftComponent={
            <Icon
              color={COLOUR_WHITE}
              underlayColor="transparent"
              name="chevron-left"
              size={40}
              type="material"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          hideNavigationMenu={this.props.hideNavigator}
          showNavigationMenu={this.props.showNavigator}
          statusBarProps={{
            backgroundColor: 'transparent',
            barStyle: CONTENT_LIGHT,
          }}
          title={this.props.route.params.objective}
          titleStyle={{
            color: COLOUR_WHITE,
            fontWeight: 'bold',
          }}
        />

        <ProgressBar />

        <View style={styles.questionLabelContainer}>
          <Text>
            Question {this.state.activeSlideIndex} /{' '}
            {this.state.questions.length}{' '}
          </Text>
        </View>

        <View style={styles.questionsSlideContainer}>
          {/* <ScrollView
          horizontal
          indicatorStyle="white"
          pagingEnabled
          scrollEnabled={false}
          snapToInterval={this.state.activeSlideIndex - 1}
        >
          {this.state.questions.map((value, index) => <QuestionSlide data={value} key={index} onSelectAnswer={this.onSelectAnswer} />)}
        </ScrollView> */}
          <Carousel animate={false} hideIndicators={true}>
            {this.state.questions.map((value, index) => (
              <QuestionSlide
                data={value}
                key={index}
                onSelectAnswer={this.onSelectAnswer}
              />
            ))}
          </Carousel>
        </View>

        <View style={styles.navButtonsContainer}>
          <Button
            hidden={this.state.activeSlideIndex === 1}
            transparent
            buttonStyle={{paddingHorizontal: 40}}
            icon={
              <Icon color={COLOUR_GREY} name="chevron-left" type="feather" />
            }
            iconLeft
            onPress={() =>
              this.setState({
                activeSlideIndex: this.state.activeSlideIndex - 1,
              })
            }
            title="Back"
            titleStyle={{color: COLOUR_GREY}}
          />
          <Button
            buttonStyle={{paddingHorizontal: 40}}
            // disabled={!this.state.answers[this.state.questions[this.state.activeSlideIndex - 1].question]}
            icon={
              this.state.activeSlideIndex !== this.state.questions.length && (
                <Icon
                  color={COLOUR_WHITE}
                  name="chevron-right"
                  type="feather"
                />
              )
            }
            iconRight
            onPress={() =>
              this.state.activeSlideIndex !== this.state.questions.length
                ? this.setState({
                    activeSlideIndex: this.state.activeSlideIndex + 1,
                  })
                : this.setState({
                    showConfirmSaveModal: true,
                  })
            }
            title={`${
              this.state.activeSlideIndex !== this.state.questions.length
                ? 'Next'
                : 'Finish'
            }`}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOUR_WHITE,
    flex: 1,
  },
  navButtonsContainer: {
    alignItems: 'flex-end',
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  questionLabelContainer: {
    backgroundColor: COLOUR_SCENE_BACKGROUND,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 10,
  },
  questionsSlideContainer: {
    flex: 0.9,
  },
});
