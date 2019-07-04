import React, { Component } from "react";
import { Animated, AsyncStorage, ScrollView, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View, KeyboardAvoidingView, Image, FlatList } from "react-native";

import _ from 'lodash';
import moment from 'moment';
import io from 'socket.io-client';
import SimpleMarkdown from 'simple-markdown';

export default class CommentDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
      radioBtnsData: ['Text', 'Markdown'],
      checked: 1
    };
  }

  static render_content = (item, user, checked) => {

    let regex = /@[a-zA-Z0-9]+/g;

    let contents = item.content.replace(regex, (match) => {
      return 'µµ' + match + 'µµ';
    });

    let words = contents.split('µµ');

    contents = _.map(words, (word, i) => {

      if (word.match(/^@.*/)) {
        return (
          <Text
            style={{
              color: word.match(new RegExp(user.username, 'g')) ? '#81be96' : '#3375b4',
              fontSize: 17,
              backgroundColor: word.match(new RegExp(user.username, 'g')) ? '#f0fff8' : '#ecf5fb',
              borderRadius: 3,
              paddingHorizontal: 3,
              overflow: 'hidden',
            }}>
            {
              word
            }
          </Text>
        );
      } else {

        if (checked == 1) {
          markdown = SimpleMarkdown.defaultBlockParse(word);
          if (markdown[0].type == 'paragraph') {
            return (
              <Text>
                {
                  markdown[0].content.map((str) => {
                    if (str.type == 'em' || str.type == 'strong' || str.type == 'u') {
                      return (
                        <Text style={{
                          fontStyle: str.type == 'em' ? 'italic' : 'normal',
                          fontWeight: str.type == 'strong' ? 'bold' : 'normal',
                          textDecorationLine: str.type == 'u' ? 'underline' : 'none'
                        }}>
                          {
                            str.content[0].content
                          }
                        </Text>
                      )
                    } else {
                      return (
                        <Text
                          style={{
                            fontSize: 17,
                            color: '#2c2d2f',
                          }}>
                          {
                            str.content
                          }
                        </Text>
                      )
                    }
                  })
                }
              </Text>
            );
          }
        } else {
          return (
            <Text
              style={{
                fontSize: 17,
                color: '#2c2d2f',
              }}>
              {
                word
              }
            </Text>
          );
        }

      }
    });


    return (
      <Text>
        {
          contents
        }
        {
          !moment(item.created_at).isSame(item.updated_at) &&

          <Text
            style={{
              fontSize: 14,
              color: '#c0c0c1',
            }}>
            {' (edited)'}
          </Text>
        }
      </Text>
    )
  };

  render() {

    let { item, current_user, connected_users } = this.props.navigation.state.params;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column'
        }}>
        <SafeAreaView style={{
          flex: 0,
          backgroundColor: '#fff',
          flexDirection: 'row',
          borderBottomWidth: 0.2,
          borderBottomColor: '#cacbcb',
        }}>

          <TouchableWithoutFeedback onPress={() => this.props.navigation.pop()}>
            <View
              style={{
                flex: 0,
                width: 45,
                height: 45,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                }}
                source={require('../assets/back.png')} />
            </View>
          </TouchableWithoutFeedback>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 45,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold'
              }}>
              Message
            </Text>
          </View>

          <View
            style={{
              flex: 0,
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
          </View>

        </SafeAreaView >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          flexDirection: 'column'
        }}>


          <ScrollView
            style={{
              backgroundColor: '#f9f9f9'
            }}
            onScroll={(event) => {
              this.setState({
                isScrolling: event.nativeEvent.contentOffset.y !== 0
              });
            }}>

            <View
              style={{
                flexDirection: 'column',
                backgroundColor: '#fff',
                borderBottomWidth: 0.2,
                borderBottomColor: '#cacbcb',
                borderTopWidth: this.state.isScrolling ? 0.2 : 0,
                borderTopColor: '#cacbcb',
                paddingHorizontal: 10,
                paddingVertical: 15,
              }}>


              <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#3374b4',
                      paddingBottom: 5
                    }}>
                    {
                      this.props.ticket_name
                    }
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <View style={{
                flex: 0,
                flexDirection: 'row',
                paddingVertical: 10,
              }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Actions.UserDetails({
                      user: item.user,
                      connected_users: connected_users
                    })
                  }}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 3,
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden'
                    }}>

                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        backgroundColor: '#e2e8e5'
                      }}
                      source={{
                        uri: 'http://212.47.252.31/static/img/' + item.user.username + '.png',
                      }} />
                  </View>
                </TouchableWithoutFeedback>

                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 10,
                    flexDirection: 'column'
                  }}>

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        Actions.UserDetails({
                          user: item.user,
                          connected_users: connected_users
                        })
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: 'bold',
                            color: '#2c2d2f',
                          }}>
                          {
                            item.user.username
                          }
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <Text
                      style={{
                        fontSize: 14,
                        color: '#a0a1a2',
                        top: 1
                      }}>
                      {
                        moment(item.created_at).format('MMM Do [at] h:mm A')
                      }
                    </Text>
                  </View>
                </View>

              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: '#2c2d2f',
                  }}>
                  {
                    CommentDetails.render_content(item, current_user, this.state.checked)
                  }
                </Text>
              </View>

              <View style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: 15,
              }}>
                {
                  this.state.radioBtnsData.map((rbtn, key) => {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.setState({
                            checked: key
                          });
                        }}>
                        <View
                          style={{
                            flex: 1,
                            paddingVertical: 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.state.checked == key ? '#3cb58c' : '#fff',
                            borderTopLeftRadius: key == 0 ? 5 : 0,
                            borderBottomLeftRadius: key == 0 ? 5 : 0,
                            borderTopRightRadius: key == this.state.radioBtnsData.length - 1 ? 5 : 0,
                            borderBottomRightRadius: key == this.state.radioBtnsData.length - 1 ? 5 : 0,
                            borderWidth: 0.35,
                            borderLeftWidth: key == this.state.radioBtnsData.length - 1 ? 0 : 0.35,
                            borderRightWidth: key == 0 ? 0 : 0.35,
                            borderColor: '#cacbcb',
                          }}
                          key={key}>
                          <Text style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: this.state.checked == key ? '#fff' : '#2c2d2f',
                          }}>
                            {
                              rbtn
                            }
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>

                    );
                  })
                }
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}