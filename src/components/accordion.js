import React from 'react'
import { View } from 'react-native'
import { Icon } from 'react-native-elements'
import ClickableListItem from './clickable-list-item';
import Text from './text';
import { 
  COLOUR_LIGHT_GREY, 
  COLOUR_BLACK, 
  COLOUR_LINK_BLUE 
} from '../constants/styles'

export default class Accordion extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      ...props
    }
  }

  render () {
    const { onHeaderPressOut } = this.props;

    const header = <ClickableListItem 
      style={{
        alignItems: 'center',
        backgroundColor: COLOUR_LIGHT_GREY, 
        color: COLOUR_BLACK, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 5,
        padding: 20,
        paddingBottom: 10,
        paddingTop: 10
      }} 
      onPressOut={onHeaderPressOut ? onHeaderPressOut : () => {
        this.setState({
          expanded: !this.state.expanded
        })
      }}
    >
      <Text black style={{fontSize: 20}}>{this.props.header}</Text>
      <Icon
        name={this.state.expanded ? 'expand-less' : 'expand-more'}
        type='material'
        color={COLOUR_LINK_BLUE}
      />
    </ClickableListItem>

    return <React.Fragment>
      {header}

      {this.state.expanded ? <View style={{padding: 20, ...this.props.style}}>
        {this.props.content}
      </View> : null}
    </React.Fragment>
  }
}