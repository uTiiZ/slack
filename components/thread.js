import React from 'react'
import { Text, Image, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import { app_change_current_thread } from '../actions/app'

class Thread extends React.Component {
  static defaultProps = {
    all: false,
    current: false,
    directMessage: false,
    online: false,
    sleeping: false,
    unread: 0
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.app_change_current_thread(this.props.thread)
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            marginVertical: 1,
            marginHorizontal: 5,
            paddingVertical: 7.5,
            paddingHorizontal: 10,
            borderRadius: 5,
            alignItems: 'center',
            backgroundColor: this.props.current ? '#5f98d4' : 'transparent'
          }}>
          <View
            style={{
              width: 22,
              height: 22,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 7.5
            }}>
            {
              this.props.all ?
                <Image
                  style={{
                    width: 22,
                    height: 22,
                    opacity: 0.25,
                  }}
                  source={require('../assets/all-threads.png')} /> :
                this.props.directMessage ?
                  <View style={{
                  }}>

                    <View
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 9,
                        borderWidth: this.props.online ? 0 : 1.5,
                        borderColor: this.props.current ? '#fff' : !this.props.online ? '#545e6c' : '#529080',
                        backgroundColor: !this.props.online ? 'transparent' : this.props.current ? '#fff' : '#529080'
                      }} />
                  </View> :
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontStyle: 'italic',
                      opacity: this.props.current ? 1 : 0.5
                    }}>
                    #
                </Text>
            }
          </View>

          <Text
            style={{
              fontSize: 18,
              color: '#fff',
              opacity: this.props.current ? 1 : 0.75
            }}>
            {
              this.props.all ? 'All Threads' : this.props.thread.name
            }
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    current_thread: state.app.current_thread
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    app_change_current_thread: (thread) => dispatch(app_change_current_thread(thread))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread)