import React from 'react';
import { Animated, Text, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux';
import { app_change_current_company } from '../actions/app';
import { companies_toggle_edit_mode, companies_remove } from '../actions/companies';

class Company extends React.Component {
  state = {
    animation: new Animated.Value(0)
  }

  static defaultProps = {
    company: null,
    is_add_btn: false,
    current: false,
    unread: 0,
    edit: false,
    all: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.edit != nextProps.edit) {
      Animated.spring(this.state.animation, {
        toValue: nextProps.edit ? 1 : 0,
        duration: 0.5,
      }).start();
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          !this.props.edit && !this.props.is_add_btn && this.props.app_change_current_company(this.props.company)
        }}>
        <Animated.View
          style={{
            flex: 0,
            flexDirection: 'row',
            paddingVertical: 10,
            opacity: !this.props.is_add_btn ? 1 : this.state.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            })
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.companies_remove('http://212.47.252.31/api/companies', this.props.company._id)
            }}>
            <Animated.View
              style={{
                flex: 0,
                width: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, 50]
                }),
                marginLeft: this.state.animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 5]
                }),
                height: 60,
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.View
                style={{
                  position: 'absolute',
                  left: this.state.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10]
                  }),
                  width: 5,
                  height: 60,
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5,
                  opacity: this.state.animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                  }),
                  backgroundColor: this.props.is_add_btn || !this.props.current ? 'transparent' : '#d0d8e4'
                }} />
              {
                this.props.edit && !this.props.is_add_btn &&
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    opacity: this.state.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    }),
                    backgroundColor: '#eb4d3d',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 11,
                      height: 1.75,
                      backgroundColor: '#fff',
                    }} />
                </Animated.View>
              }
            </Animated.View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              marginRight: 15,
              backgroundColor: this.props.is_add_btn ? '#272f3b' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {
              !this.props.is_add_btn ?
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    backgroundColor: '#76dbd1',
                    overflow: 'hidden'
                  }}>
                  <View
                    style={{
                      position: 'absolute',
                      top: -42.5,
                      left: -42.5,
                      width: 85,
                      height: 85,
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
                      bottom: -42.5,
                      right: -42.5,
                      width: 85,
                      height: 85,
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
                </View> :
                <Text
                  style={{
                    fontSize: 40,
                    fontWeight: '200',
                    color: '#fff',
                  }}>
                  +
              </Text>
            }
            {
              !this.props.is_add_btn && this.props.unread > 0 &&
              <View
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  padding: 3,
                  borderRadius: 20,
                  backgroundColor: '#353f4e',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: '#e24b5a',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#fff',
                      textAlign: 'center',
                      alignSelf: 'center',
                    }}>
                    {
                      this.props.unread
                    }
                  </Text>
                </View>
              </View>
            }

          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-around',
              paddingVertical: 10
            }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 18,
                color: '#fff',
                opacity: 0.85
              }}>
              {
                this.props.company != null ? this.props.company.name : this.props.all ? 'All' : 'Add Companies'
              }
            </Text>
            {
              !this.props.is_add_btn && this.props.company != null &&
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  color: '#fff',
                  opacity: 0.4
                }}>
                {
                  this.props.company.address.city + ' - ' + this.props.company.address.zip
                }
              </Text>
            }
          </View>

        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    current_company: state.app.current_company,
    edit: state.companies.edit
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    app_change_current_company: (company) => dispatch(app_change_current_company(company)),
    companies_toggle_edit_mode: (edit) => dispatch(companies_toggle_edit_mode(edit)),
    companies_remove: (url, id) => dispatch(companies_remove(url, id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Company)