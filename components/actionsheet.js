import React, { Component } from "react";
import { Animated, Platform, Dimensions, PanResponder, Text, Image, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { connect } from 'react-redux';
import { app_toggle_action_sheet } from '../actions/app';
import _ from 'lodash';

class ActionSheet extends Component {
  state = {
    iPhoneX: (Platform.OS === "ios" && (Dimensions.get("window").height > 800 || Dimensions.get("window").width > 800)) ? true : false,
    height: 0,
    alpha: new Animated.Value(0),
    top: new Animated.Value(Dimensions.get('window').height * 2),
    top_check: new Animated.Value(Dimensions.get('window').height * 2),
    up: false,
    drag: 0,
    drag_distance: 0
  }

  constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        this.setState({ drag: this.state.top._value })
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        this.setState({ drag_distance: gestureState.dy })
        this.state.top_check.setValue(this.state.drag + gestureState.dy);
        this.state.top.setValue(this.state.top_check._value > 260 ? this.state.drag + gestureState.dy : 260);

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (this.state.up) {
          if (this.state.top_check._value < 775) {
            Animated.spring(
              this.state.top,
              {
                toValue: Dimensions.get('window').height - (this.state.iPhoneX ? 150 : 175),
                duration: 0.5
              }
            ).start();
          } else {
            this.props.app_toggle_action_sheet(false);
          }
        } else {
          if (this.state.drag_distance > 50) {
            this.props.app_toggle_action_sheet(false)
          } else {
            Animated.spring(
              this.state.top,
              {
                toValue: this.state.drag_distance > -75 ? (this.state.iPhoneX ? 75 : 100) + Dimensions.get('window').height : Dimensions.get('window').height - (this.state.iPhoneX ? 150 : 175),
                duration: 0.5
              }
            ).start(() => this.setState({ up: this.state.drag_distance < -75 }));
          }
          
        }

      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.action_sheet != nextProps.action_sheet) {
      this.setState({ up: false })
      Animated.parallel([
        Animated.spring(
          this.state.top,
          {
            toValue: (nextProps.action_sheet ? (this.state.iPhoneX ? 75 : 100) : this.state.height + (this.state.iPhoneX ? 75 : 100)) + Dimensions.get('window').height,
            duration: 0.5
          }
        ),
        Animated.spring(
          this.state.alpha,
          {
            toValue: nextProps.action_sheet ? 1 : 0,
            duration: 0.5
          }
        ),
      ]).start();
    }
  }

  render() {

    return (
      <Animated.View
        pointerEvents={!this.props.action_sheet ? "none" : "auto"}
        style={[StyleSheet.absoluteFill, {
          backgroundColor: this.state.alpha.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.58)']
          }),
          justifyContent: 'flex-end'
        }]}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.app_toggle_action_sheet(false);
          }}>

          <View
            style={[StyleSheet.absoluteFill, {
              flex: 1,
            }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            top: this.state.top,
          }} {...this._panResponder.panHandlers}>

          <View
            style={{
              alignSelf: 'center',
              bottom: 10,
              width: 35,
              height: 6,
              borderRadius: 6,
              backgroundColor: '#d4d4d5'
            }} />
          <View
            style={{
              backgroundColor: '#fff',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onLayout={(event) => {
              var { height } = event.nativeEvent.layout;
              this.setState({
                height
              })
            }}>
            <View
              style={{
                height: 50,
                alignItems: 'center',
                paddingLeft: 18.5,
                flexDirection: 'row',
              }}>

              <Image
                style={{
                  flex: 0,
                  width: 23.5,
                  height: 23.5,
                  marginRight: 18.5
                }}
                source={require('../assets/delete.png')} />

              <View
                style={{
                  flex: 1,
                  height: 50,
                  borderBottomColor: '#efefef',
                  borderBottomWidth: 0.5,
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    top: 1,
                    fontSize: 18,
                    color: '#2c2d2f',
                  }}>
                  Delete Ticket
                </Text>
              </View>

            </View>

            <View
              style={{
                height: 50,
                alignItems: 'center',
                paddingLeft: 18.5,
                flexDirection: 'row',
              }}>

              <Image
                style={{
                  flex: 0,
                  width: 23.5,
                  height: 23.5,
                  marginRight: 18.5
                }}
                source={require('../assets/delete.png')} />

              <View
                style={{
                  flex: 1,
                  height: 50,
                  borderBottomColor: '#efefef',
                  borderBottomWidth: 0.5,
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    top: 1,
                    fontSize: 18,
                    color: '#2c2d2f',
                  }}>
                  Delete Ticket
                </Text>
              </View>

            </View>

            <View
              style={{
                height: 50,
                alignItems: 'center',
                paddingLeft: 18.5,
                flexDirection: 'row',
              }}>

              <Image
                style={{
                  flex: 0,
                  width: 23.5,
                  height: 23.5,
                  marginRight: 18.5
                }}
                source={require('../assets/delete.png')} />

              <View
                style={{
                  flex: 1,
                  height: 50,
                  borderBottomColor: '#efefef',
                  borderBottomWidth: 0.5,
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    top: 1,
                    fontSize: 18,
                    color: '#2c2d2f',
                  }}>
                  Delete Ticket
                </Text>
              </View>

            </View>

            <View
              style={{
                height: 50,
                alignItems: 'center',
                paddingLeft: 18.5,
                flexDirection: 'row',
              }}>

              <Image
                style={{
                  flex: 0,
                  width: 23.5,
                  height: 23.5,
                  marginRight: 18.5
                }}
                source={require('../assets/delete.png')} />

              <View
                style={{
                  flex: 1,
                  height: 50,
                  borderBottomColor: '#efefef',
                  borderBottomWidth: 0.5,
                  justifyContent: 'center'
                }}>
                <Text
                  style={{
                    top: 1,
                    fontSize: 18,
                    color: '#2c2d2f',
                  }}>
                  Delete Ticket
                </Text>
              </View>

            </View>

            <View
              style={{
                height: Dimensions.get('window').height,
                backgroundColor: '#fff'
              }} />
          </View>


        </Animated.View>
      </Animated.View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    action_sheet: state.app.action_sheet,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    app_toggle_action_sheet: (bool) => dispatch(app_toggle_action_sheet(bool)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionSheet)