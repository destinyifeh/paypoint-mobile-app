import React from 'react'
import { ListItem } from 'react-native-elements'
import Text from './text';

export class ListItem extends React.Component {
  render () {
    return <ListItem style={{
      ...this.props.style
    }}>
      {this.props.children}
    </ListItem>
  }
}

export class ListItemDivider extends React.Component {
  render () {
    return <Text>
      {this.props.children}
    </Text>
  }
}
