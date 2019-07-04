import React, { Component } from 'react';
import {
	ActionSheetIOS,
	Clipboard,
	AsyncStorage,
	Dimensions,
	SafeAreaView,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
	KeyboardAvoidingView,
	Image,
	FlatList
} from 'react-native';

import _ from 'lodash';
import moment from 'moment';
import matchAll from 'match-all';
import io from 'socket.io-client';
import SimpleMarkdown from 'simple-markdown';

export default class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false
		};
	}

	static render_content = (content, user, connected_users) => {
		let regex = /@[a-zA-Z0-9]+/g;

		let contents = content.replace(regex, (match) => {
			return 'µµ' + match + 'µµ';
		});

		let words = contents.split('µµ');

		contents = _.map(words, (word, i) => {
			if (word.match(/^@.*/)) {
				return (
					<Text
						onPress={() => {
							/*Actions.UserDetails({
                user: item_user,
                connected_users: connected_users
              })*/
						}}
						style={{
							color: word.match(new RegExp(user.username, 'g')) ? '#81be96' : '#3375b4',
							fontSize: 17,
							backgroundColor: word.match(new RegExp(user.username, 'g')) ? '#f0fff8' : '#ecf5fb',
							borderRadius: 3,
							paddingHorizontal: 3,
							overflow: 'hidden'
						}}
					>
						{word}
					</Text>
				);
			} else {
				markdown = SimpleMarkdown.defaultBlockParse(word);
				if (markdown[0].type == 'paragraph') {
					return (
						<Text>
							{markdown[0].content.map((str) => {
								if (str.type == 'em' || str.type == 'strong' || str.type == 'u') {
									return (
										<Text
											style={{
												fontStyle: str.type == 'em' ? 'italic' : 'normal',
												fontWeight: str.type == 'strong' ? 'bold' : 'normal',
												textDecorationLine: str.type == 'u' ? 'underline' : 'none'
											}}
										>
											{str.content[0].content}
										</Text>
									);
								} else {
									return str.content;
								}
							})}
						</Text>
					);
				}
			}
		});

		return contents;
	};

	render() {
		let { editing } = this.state;
		let { index, item, ticket_name, current_user, connected_users, after, same, navigation } = this.props;
		let current = moment(item.created_at);

		return (
			<View
				style={{
					marginBottom: index === 0 ? 10 : 0,
					backgroundColor: editing && !item.end_editing ? '#fefae8' : 'rgba(0, 0, 0, 0)'
				}}
			>
				{!after.isSame(current, 'day') && (
					<View
						style={{
							marginLeft: 10,
							justifyContent: 'center',
							borderBottomColor: '#cacbcb',
							borderBottomWidth: 0.2,
							marginBottom: 10,
							marginTop: 15
						}}
					>
						<Text
							style={{
								paddingBottom: 5,
								fontSize: 16,
								fontWeight: 'bold'
							}}
						>
							{current.isSame(moment(), 'day') ? (
								'Today'
							) : current.isSame(moment().add(-1, 'days'), 'day') ? (
								'Yesterday'
							) : (
								current.format('MMM Do')
							)}
						</Text>
					</View>
				)}

				<View
					style={{
						marginVertical: 3,
						flex: 0,
						flexDirection: 'row',
						paddingHorizontal: 10
					}}
				>
					<TouchableWithoutFeedback
						onPress={() => {
							// Actions.UserDetails({
							// 	user: item.user,
							// 	connected_users: connected_users
							// });

							navigation.navigate('UserDetails', {
								user: item.user,
								connected_users: connected_users
							});
						}}
					>
						<View
							style={{
								width: 35,
								height: !same || moment.duration(current.diff(after)).asMinutes() > 10 ? 35 : 0,
								borderRadius: 3,
								justifyContent: 'center',
								alignItems: 'center',
								overflow: 'hidden'
							}}
						>
							{(!same || moment.duration(current.diff(after)).asMinutes() > 10) && (
								<Image
									style={{
										width: 35,
										height: 35,
										backgroundColor: '#e2e8e5'
									}}
									source={{
										uri: 'http://212.47.252.31/static/img/' + item.user.username + '.png'
									}}
								/>
							)}
						</View>
					</TouchableWithoutFeedback>

					<View
						style={{
							flex: 1,
							paddingHorizontal: 10,
							flexDirection: 'column'
						}}
					>
						{(!same || moment.duration(current.diff(after)).asMinutes() > 10) && (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center'
								}}
							>
								<TouchableWithoutFeedback
									onPress={() => {
										// Actions.UserDetails({
										// 	user: item.user,
										// 	connected_users: connected_users
										// });

										navigation.navigate('UserDetails', {
											user: item.user,
											connected_users: connected_users
										});
									}}
								>
									<View>
										<Text
											style={{
												fontSize: 17,
												fontWeight: 'bold',
												color: '#2c2d2f'
											}}
										>
											{item.user.username}
										</Text>
									</View>
								</TouchableWithoutFeedback>

								<Text
									style={{
										fontSize: 14,
										color: '#a0a1a2',
										marginLeft: 5,
										top: 1
									}}
								>
									{moment(item.created_at).format('h:mm A')}
								</Text>
							</View>
						)}

						<TouchableWithoutFeedback
							onPress={() => {
								// Actions.CommentDetails({
								// 	item: item,
								// 	ticket_name: ticket_name,
								// 	current_user: current_user,
								// 	connected_users: connected_users
								// });

								navigation.navigate('CommentDetails', {
									item: item,
									ticket_name: ticket_name,
									current_user: current_user,
									connected_users: connected_users
								});
							}}
							onLongPress={() => {
								let config;
								if (current_user._id === item.user._id) {
									config = {
										options: [
											'Cancel',
											'Add Reaction',
											'Copy Text',
											'Copy Link to Message',
											'Share Message',
											'Remind Me',
											'Star Message',
											'Mark Unread',
											'Edit Message',
											'Delete Message'
										],
										destructiveButtonIndex: 9,
										cancelButtonIndex: 0
									};
								} else {
									config = {
										options: [
											'Cancel',
											'Add Reaction',
											'Copy Text',
											'Copy Link to Message',
											'Share Message',
											'Remind Me',
											'Star Message',
											'Mark Unread'
										],
										cancelButtonIndex: 0
									};
								}

								ActionSheetIOS.showActionSheetWithOptions(config, (index) => {
									switch (index) {
										case 2:
											Clipboard.setString(item.content);
											break;
										case 8:
											this.setState({
												editing: true
											});
											this.props.editing(item);
											break;
										case 9:
											this.props.deleteComment(item);
											break;
									}
								});
								/*this.props.actionsheet();*/
							}}
						>
							<View
								style={{
									flexDirection: 'column',
									justifyContent: 'center'
								}}
							>
								<Text
									style={{
										fontSize: 17,
										color: '#2c2d2f'
									}}
								>
									{Comment.render_content(item.content, current_user, connected_users)}
								</Text>
								{!moment(item.created_at).isSame(item.updated_at) && (
									<Text
										style={{
											fontSize: 14,
											color: '#c0c0c1'
										}}
									>
										(edited)
									</Text>
								)}
							</View>
						</TouchableWithoutFeedback>
					</View>
				</View>
			</View>
		);
	}
}
