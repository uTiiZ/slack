import React, { Component } from "react";
import { Animated, AsyncStorage, NetInfo, Dimensions, StatusBar, SafeAreaView, Text, InputAccessoryView, TextInput, TouchableWithoutFeedback, TouchableOpacity, View, Modal, KeyboardAvoidingView, Image, FlatList } from "react-native";

import _ from 'lodash';
import moment from 'moment';
import io from 'socket.io-client';

import Comment from '../components/comment';
import ActionSheet from '../components/actionsheet';
import { ScrollView } from "react-native-gesture-handler";

const addImage = require('../assets/add_image.png');
const addImageActive = require('../assets/add_image_active.png');

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ticket: [],
      items: [],
      user: { _id: '5bb75ecb10ada25a2ae547e7'},
      connected_users: [],
      content: '',
      scrollAnimation: new Animated.Value(75),
      canSend: false,
      addPeopleActive: false,
      addMethodActive: false,
      addMethodDisabled: false,
      addFileActive: false,
      addImageActive: false,
      isConnected: null,
      editing: null,
      actionsheet: false
    };
  }

  componentDidMount() {

    NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
      this.setState({
        isConnected: isConnected
      })
    });

    AsyncStorage.getItem('id_token').then((token) => {
      fetch('http://212.47.252.31/api/tickets/5bb769776dfb8b0149359eb3', { //+ this.props.id   -   5b51d915625db23038c8bdbf
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then((response) => response.json())
        .then((data) => {
          let items = [];
          let comments = data.ticket.comments.reverse();
          comments.map((comment) => {
            items.push(comment)
          });
          let ticket = _.clone(data.ticket, true);
          ticket.comments = null;
          _.assign(ticket, { type: 'ticket' });
          items.push(ticket);
          this.setState({
            items: items,
            ticket: ticket
          })
        })
        .done();
    });

    AsyncStorage.getItem('user').then((user) => {
      if (!this.state.user) {
        this.setState({
          user: JSON.parse(user)
        });

        this.socket = io.connect('ws://212.47.252.31', {
          query: "user_id=" + this.state.user._id +
            "&username=" + this.state.user.username
        });
        this.socket.on('connected_users', (connected_users) => {
          this.setState({
            connected_users: connected_users
          });
        });
        this.socket.on('comment.create', (comment) => {
          this.setState({
            items: [...this.state.items.reverse(), comment].reverse(),
          });
        });
        this.socket.on('comment.update', (comment) => {
          let index = _.findIndex(this.state.items, { _id: comment._id });
          let arr = this.state.items;
          comment.end_editing = true;
          arr.splice(index, 1, comment)
          this.setState({
            items: arr,
            editing: null
          });
        });
        this.socket.on('comment.remove', (comment) => {
          let arr = this.state.items;
          _.remove(arr, { _id: comment._id });
          this.setState({
            items: arr
          });
        });
      }
    });
  }

  userLogout = async () => {
    await AsyncStorage.removeItem('id_token');
    this.socket.disconnect();
    Actions.Authentication();
  };

  handleSendComment = () => {
    this.refs['input'].blur();
    if (this.state.canSend) {
      if (this.state.editing) {
        this.updateComment(this.state.editing, this.state.content);
        this.setState({
          content: '',
          canSend: false,
          editing: null
        });
      } else {
        this.createComment(this.state.content);
        this.setState({
          content: '',
          canSend: false
        });
      }
    }
  };

  onScroll = (event) => {
    Animated.timing(
      this.state.scrollAnimation,
      {
        toValue: 75 + event.nativeEvent.contentOffset.y,
        duration: 0
      }
    ).start();
  };

  actionsheet = () => {
    this.setState({
      actionsheet: !this.state.actionsheet
    });
  }

  createComment = (content) => {
    AsyncStorage.getItem('id_token').then((token) => {
      fetch('http://212.47.252.31/api/tickets/5bb769776dfb8b0149359eb3/comment', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          user: this.state.user._id
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            items: [...this.state.items.reverse(), data.comment].reverse(),
          });
        })
        .done();
    });
    //this.socket.emit('ticket.create', location);
  };

  updateComment = (comment, content) => {
    AsyncStorage.getItem('id_token').then((token) => {
      fetch('http://212.47.252.31/api/comments/' + comment._id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let index = _.findIndex(this.state.items, { _id: data.comment._id });
          let arr = this.state.items;
          data.comment.end_editing = true;
          arr.splice(index, 1, data.comment)
          this.setState({
            items: arr,
            editing: null
          });
        })
        .done();
    });
    //this.socket.emit('ticket.create', location);
  };

  deleteComment = (comment) => {
    AsyncStorage.getItem('id_token').then((token) => {
      fetch('http://212.47.252.31/api/comments/' + comment._id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let arr = this.state.items;
          _.remove(arr, { _id: comment._id });
          this.setState({
            items: arr
          });
        })
        .done();
    });
    //this.socket.emit('ticket.create', location);
  };

  editing = (comment) => {
    let index = _.findIndex(this.state.items, { _id: comment._id });
    let arr = this.state.items;
    comment.end_editing = false;
    arr.splice(index, 1, comment)
    this.setState({
      items: arr,
      editing: comment,
      content: comment.content,
      canSend: comment.content.length > 0
    });
    this.refs['input'].focus();
  };

  cancel_editing = () => {
    let index = _.findIndex(this.state.items, { _id: this.state.editing._id });
    let arr = this.state.items;
    this.state.editing.end_editing = true;
    arr.splice(index, 1, this.state.editing)
    this.setState({
      items: arr,
      editing: null,
      content: '',
      canSend: false
    });
    this.refs['input'].blur();
  };

  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column'
      }}>

        <StatusBar barStyle={this.props.open ? "light-content" : "dark-content"} />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            height: 45,
            borderBottomWidth: 0.2,
            borderBottomColor: '#cacbcb',
            overflow: 'hidden'
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
                //   Actions.TicketsPage();
            }}>
            <View
              style={{
                flex: 0,
                width: 45,
                height: 45,
                marginHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image
                style={{
                  width: 28,
                  height: 28,
                }}
                source={require('../assets/new-slack-logo.png')} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row'
            }}
            onPress={() => Actions.DirectMessage()}>
            <View
              style={{
                flex: 0,
                height: 45,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: '#2c2d2f'
                }}
                numberOfLines={1}>
                {
                  this.state.ticket.location
                }
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginHorizontal: 5,
                  transform: [
                    {
                      translateY: 1
                    }
                  ],
                  borderRadius: 11,
                  borderColor: this.state.ticket.user && _.includes(this.state.connected_users, this.state.ticket.user._id) ? '#81bf97' : '#a0a0a2',
                  backgroundColor: this.state.ticket.user && _.includes(this.state.connected_users, this.state.ticket.user._id) ? '#81bf97' : '#fff',
                  borderWidth: 2,
                  width: 11,
                  height: 11,
                }} />
            </View>

            <View
              style={{
                flex: 0,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 10,
                  height: 10,
                  transform: [
                    {
                      translateY: 1.5
                    }
                  ],
                }}
                source={require('../assets/arrow_down.png')} />
            </View>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={this.userLogout.bind(this)}>
            <View
              style={{
                flex: 0,
                width: 45,
                height: 45,
                marginHorizontal: 10,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 0,
                  borderRadius: 4,
                  backgroundColor: '#000',
                  width: 4,
                  height: 4,
                  margin: 1.2,
                }} />
              <View
                style={{
                  flex: 0,
                  borderRadius: 4,
                  backgroundColor: '#000',
                  width: 4,
                  height: 4,
                  margin: 1.2,
                }} />
              <View
                style={{
                  flex: 0,
                  borderRadius: 4,
                  backgroundColor: '#000',
                  width: 4,
                  height: 4,
                  margin: 1.2,
                }} />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            style={{
              flex: 1,
            }}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode='interactive'
            data={this.state.items}
            renderItem={(item) => {

              if (item.item.type !== 'ticket') {
                let after = typeof this.state.items[item.index + 1] === 'undefined'
                  ? null
                  : (this.state.items[item.index + 1]);
                return (
                  <Comment
                    key={item.index}
                    navigation={this.props.navigation}
                    editing={this.editing.bind(this)}
                    deleteComment={this.deleteComment.bind(this)}
                    index={item.index}
                    item={item.item}
                    actionsheet={this.actionsheet.bind(this)}
                    connected_users={this.state.connected_users}
                    current_user={this.state.user}
                    ticket_name={this.state.ticket.location}
                    same={after === null ? false : _.isEqual(after.user, item.item.user)}
                    after={after === null ? null : moment(after.created_at)} />
                )
              } else {
                return (
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingBottom: 15,
                      marginTop: 10,
                      marginBottom: 10,
                      // borderBottomWidth: this.state.items.length > 1 ? 0.2 : 0,
                      // borderBottomColor: '#cacbcb'
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        // Actions.UserDetails({
                        //   user: item.item.user,
                        //   connected_users: this.state.connected_users
                        // })

                        this.props.navigation.navigate('UserDetails', {
                          user: item.item.user,
                          connected_users: this.state.connected_users
                        });
                      }}>
                      <View
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                          overflow: 'hidden'
                        }}>
                        <Image
                          style={{
                            width: 70,
                            height: 70,
                            backgroundColor: '#e2e8e5'
                          }}
                          source={{
                            uri: 'http://212.47.252.31/static/img/' + item.item.user.username + '.png',
                          }} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        Actions.UserDetails({
                          user: item.item.user,
                          connected_users: this.state.connected_users
                        })
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            color: '#2c2d2f',
                            marginTop: 10,
                            marginBottom: 25,
                          }}>
                          {
                            _.capitalize(_.lowerCase(item.item.user.firstname)) + ' ' + _.upperCase(item.item.user.lastname)
                          }
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <Text
                      style={{
                        fontSize: 17,
                        color: '#717274',
                      }}>
                      {
                        item.item.description
                      }
                    </Text>

                  </View>
                )
              }
            }}
            keyExtractor={(item, index) => item._id}
            scrollEventThrottle={1}
            onScroll={this.onScroll.bind(this)}
            inverted
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              opacity: this.state.scrollAnimation.interpolate({
                inputRange: [-50, 75],
                outputRange: [1, 0]
              }),
              transform: [
                {
                  translateY: this.state.scrollAnimation,
                },
              ],
              width: Dimensions.get('window').width,
              height: 75,
              paddingTop: 10,
              justifyContent: 'center',
              flexDirection: 'row'
            }}>
            <Text style={{
              fontSize: 16,
              color: '#717274'
            }}>

              {
                this.state.isConnected ? 'You are up to date.' : 'Couldn\'t load messages.'
              }
            </Text>
            <Animated.View style={{
              opacity: this.state.scrollAnimation.interpolate({
                inputRange: [-25, -24],
                outputRange: [1, 0]
              })
            }}>
              <Text style={{
                fontSize: 18
              }}>
                {
                  this.state.isConnected ? '🎉' : '😳'
                }
              </Text>
            </Animated.View>
          </Animated.View>
        </View>

        <KeyboardAvoidingView behavior="padding" enabled>
          <View style={{
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderTopColor: '#cacbcb',
            borderTopWidth: 0.2
          }}>
            <View style={{
              flexDirection: 'column',
              paddingVertical: 5
            }}>

              <View style={{
                paddingHorizontal: 10,
                flexDirection: 'row',
              }}>
                <TextInput
                  value={this.state.content}
                  onChangeText={text => {
                    this.setState({
                      content: text,
                      canSend: text.length > 0,
                    })
                  }}
                  style={{
                    fontSize: 17,
                    flex: 1,
                    paddingBottom: 5
                  }}
                  ref="input"
                  maxHeight={165}
                  multiline
                  autoCorrect={true}
                  underlineColorAndroid="transparent"
                  placeholder={'Message'}
                  placeholderTextColor="#9f9f9f" />
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {
                    !this.state.editing &&
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>


                      <TouchableWithoutFeedback
                        onPressIn={() => {
                          this.setState({
                            addPeopleActive: true,
                            content: this.state.content + '@'
                          })
                        }}
                        onPressOut={() => {
                          setTimeout(() => {
                            this.setState({
                              addPeopleActive: false,
                              canSend: true
                            });

                            this.refs['input'].focus();
                          }, 100);
                        }}>
                        <View
                          style={{
                            flex: 0,
                            width: 40,
                            height: 40,
                            marginRight: 2,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={this.state.addPeopleActive ? require('../assets/add_people_active.png') : require('../assets/add_people.png')} />
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback
                        onPressIn={() => {
                          if (!this.state.canSend)
                            this.setState({
                              addMethodActive: true,
                              content: '/'
                            })
                        }}
                        onPressOut={() => {
                          if (!this.state.canSend)
                            setTimeout(() => {
                              this.setState({
                                addMethodActive: false,
                                canSend: true
                              });

                              this.refs['input'].focus();
                            }, 100);
                        }}>
                        <View
                          style={{
                            flex: 0,
                            width: 40,
                            height: 40,
                            marginHorizontal: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: this.state.canSend ? 0.3 : 1
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={this.state.addMethodActive ? require('../assets/add_method_active.png') : require('../assets/add_method.png')} />
                        </View>
                      </TouchableWithoutFeedback>

                      <TouchableWithoutFeedback onPress={() => {
                        this.setState({ addFileActive: !this.state.addFileActive })
                      }}>
                        <View
                          style={{
                            flex: 0,
                            width: 40,
                            height: 40,
                            marginLeft: 2,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={this.state.addFileActive ? require('../assets/add_file_active.png') : require('../assets/add_file.png')} />
                        </View>
                      </TouchableWithoutFeedback>

                    </View>
                  }

                  {
                    this.state.editing &&
                    <TouchableWithoutFeedback onPress={this.cancel_editing.bind(this)}>
                      <View
                        style={{
                          flex: 0,
                          marginLeft: 10
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            flex: 0,
                            color: '#519cda'
                          }}>
                          Cancel
                          </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  }

                  <View style={{ flex: 1 }} />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 7
                    }}>

                    {
                      !this.state.editing &&
                      <TouchableWithoutFeedback onPress={() => {
                        this.setState({ addImageActive: !this.state.addImageActive })
                      }}>
                        <View
                          style={{
                            flex: 0,
                            width: 40,
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                            }}
                            source={this.state.addImageActive ? addImageActive : addImage} />
                        </View>
                      </TouchableWithoutFeedback>
                    }

                    <TouchableWithoutFeedback onPress={this.handleSendComment.bind(this)}>
                      <View style={{
                        flex: 0,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        margin: 5,
                        backgroundColor: !this.state.canSend ? '#fff' : '#519cda',
                        borderWidth: 1,
                        borderColor: !this.state.canSend ? '#e8e8e8' : '#519cda',
                        borderRadius: 5
                      }}>
                        <Text style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: !this.state.canSend ? '#a0a0a2' : '#fff'
                        }}>
                          Send
                          </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                </View>

              </View>

            </View>
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView >

    );
  }
}