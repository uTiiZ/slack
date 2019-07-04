import React from 'react';
import { Animated, Image, Text, View, SafeAreaView, ScrollView, TouchableWithoutFeedback, TextInput } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import Thread from '../components/thread';
import { threads_list, threads_toggle_search_mode, threads_filter } from '../actions/threads';



class Threads extends React.Component {

  state = {
    animation: new Animated.Value(0)
  }

  componentDidMount() {
    this.props.threads_list('http://212.47.252.31/api/threads');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.search_mode != nextProps.search_mode) {
      Animated.spring(this.state.animation, {
        toValue: nextProps.search_mode ? 1 : 0,
        duration: 0.5,
      }).start();
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <SafeAreaView
          style={{
            flex: 0,
          }}>
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Animated.View
              style={{
                flex: 1,
                position: 'absolute',
                left: 15,
                right: 15,
                top: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 12.5]
                }),
                opacity: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                }),
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  height: 35,
                  marginRight: 15,
                  paddingHorizontal: 7.5,
                  borderRadius: 5,
                  backgroundColor: '#1e2631',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                    opacity: 0.75
                  }}
                  source={require('../assets/jump-to.png')} />

                <View
                  style={{
                    position: 'absolute',
                    left: 32.5,
                    right: 7.5,
                    alignSelf: 'center',
                    flex: 1,
                    height: 35,
                    opacity: 0.5,
                    justifyContent: 'center'
                  }}>
                  {
                    this.props.search != '' && this.props.threads_filtered[0] &&
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#fff',
                      }}>
                      {
                         this.props.threads_filtered[0].name.substring(this.props.threads_filtered[0].name.indexOf(this.props.search))
                      }
                    </Text>
                  }
                </View>
                <TextInput
                  value={this.props.search}
                  ref={(input) => { this.input = input; }}
                  onChangeText={(filter) => {
                    this.props.threads_filter(filter)
                  }}
                  style={{
                    flex: 1,
                    height: 35,
                    fontSize: 15,
                    color: '#fff',
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Jump to..."
                  placeholderTextColor="rgba(255, 255, 255, 0.5)" />
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.props.threads_toggle_search_mode(false)
                  this.input.blur()
                  this.props.threads_filter('')
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#fff',
                      opacity: 0.75
                    }}>
                    Cancel
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>


            <Animated.View
              pointerEvents={this.props.search_mode ? "none" : "auto"}
              style={{
                flex: 1,
                position: 'absolute',
                left: 15,
                right: 15,
                top: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12.5, 15]
                }),
                flexDirection: 'row',
                opacity: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0]
                }),
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Companies')}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    overflow: 'hidden'
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      top: -25,
                      left: -25,
                      width: 50,
                      height: 50,
                      transform: [
                        {
                          rotateZ: '45deg'
                        }
                      ],
                      backgroundColor: '#76dbd1',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                  </View>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -25,
                      right: -25,
                      width: 50,
                      height: 50,
                      transform: [
                        {
                          rotateZ: '45deg'
                        }
                      ],
                      backgroundColor: '#ecf4f3',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  flex: 1,
                  height: 35,
                  marginLeft: 15,
                  paddingHorizontal: 7.5,
                  borderRadius: 5,
                  backgroundColor: '#1e2631',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                    opacity: 0.3
                  }}
                  source={require('../assets/jump-to.png')} />
                <Text
                  onPress={() => {
                    this.props.threads_toggle_search_mode(true)
                    this.input.focus()
                  }}
                  style={{
                    flex: 1,
                    fontSize: 15,
                    color: '#fff',
                    opacity: 0.5,
                  }}>
                  Jump to...
                </Text>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
        <View
          style={{
            flex: 1,
          }}>
          <Animated.View
            style={{
              top: this.state.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15]
              }),
              right: 0,
              bottom: 0,
              left: 0,
              opacity: this.state.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              }),
              position: 'absolute',
            }}>
            <ScrollView
              stickyHeaderIndices={[2, 4]}
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0,
                  height: 10
                }} />
              <Thread all />
              <View
                style={{
                  marginVertical: 1,
                  paddingVertical: 7.5,
                  paddingHorizontal: 17.5,
                  backgroundColor: '#353f4e'
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#fff',
                    opacity: 0.5,
                    fontWeight: '500'
                  }}>
                  CHANNELS
                </Text>
              </View>
              <View>
                {
                  this.props.threads.map((thread) => {
                    return (
                      <Thread key={thread._id} thread={thread} current={this.props.current_thread && this.props.current_thread._id == thread._id} />
                    )
                  })
                }
              </View>
              <View
                style={{
                  marginVertical: 1,
                  paddingVertical: 7.5,
                  paddingHorizontal: 17.5,
                  backgroundColor: '#353f4e'
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#fff',
                    opacity: 0.5,
                    fontWeight: '500'
                  }}>
                  DIRECT MESSAGES
                </Text>
              </View>
              <View>
                {/* <Thread name={'slackbot'} directMessage online sleeping />
              <Thread name={'tkervran'} directMessage online />
              <Thread name={'damien'} directMessage />
              <Thread name={'olivier'} directMessage />
              <Thread name={'seb'} directMessage />
              <Thread name={'todobot'} directMessage online sleeping /> */}
              </View>
            </ScrollView>
          </Animated.View>
          <Animated.View
            pointerEvents={!this.props.search_mode ? "none" : "auto"}
            style={{
              top: this.state.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-15, 0]
              }),
              right: 0,
              bottom: 0,
              left: 0,
              opacity: this.state.animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              }),
              position: 'absolute',
            }}>
            <ScrollView
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0,
                  height: 10
                }} />
              {
                this.props.threads_filtered.map((thread) => {
                  return (
                    <Thread key={thread._id} thread={thread} />
                  )
                })
              }
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    current_company: state.app.current_company,
    current_thread: state.app.current_thread,
    threads: state.threads.threads,
    threads_filtered: state.threads.threads_filtered,
    search_mode: state.threads.search_mode,
    search: state.threads.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    threads_list: (url) => dispatch(threads_list(url)),
    threads_toggle_search_mode: (bool) => dispatch(threads_toggle_search_mode(bool)),
    threads_filter: (filter) => dispatch(threads_filter(filter))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Threads);