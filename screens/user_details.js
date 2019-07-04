import React, { Component } from 'react';
import {
	StatusBar,
	Dimensions,
	ScrollView,
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
import io from 'socket.io-client';

export default class UserDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {}

	render() {
		let size = Dimensions.get('window').width;

		let { navigation } = this.props;
		let { user, connected_users } = navigation.state.params;

		return (
			<View
				style={{
					flex: 1,
					flexDirection: 'column'
				}}
			>
				<StatusBar barStyle="light-content" />

				<View
					style={{
						flex: 1
					}}
				>
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							width: size,
							height: size,
							justifyContent: 'center',
							alignItems: 'center',
							overflow: 'hidden',
							backgroundColor: 'powderblue'
						}}
					>
						<Image
							style={{
								width: size,
								height: size,
								backgroundColor: '#e2e8e5'
							}}
							source={{
								uri: 'http://212.47.252.31/static/img/' + user.username + '.png'
							}}
						/>
					</View>

					<SafeAreaView
						style={{
							flex: 0,
							height: size,
							flexDirection: 'column',
							backgroundColor: 'rgba(0, 0, 0, 0.1)'
						}}
					>
						<View
							style={{
								flex: 0,
								flexDirection: 'row'
							}}
						>
							<TouchableWithoutFeedback onPress={() => navigation.pop()}>
								<View
									style={{
										flex: 0,
										width: 45,
										height: 45,
										marginLeft: 10,
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<Image
										style={{
											width: 20,
											height: 20
										}}
										source={require('../assets/back_white.png')}
									/>
								</View>
							</TouchableWithoutFeedback>

							<View
								style={{
									flex: 1
								}}
							/>
						</View>
						<View
							style={{
								flex: 1
							}}
						/>
						<View
							style={{
								flex: 0,
								marginHorizontal: 15,
								marginVertical: 20,
								flexDirection: 'row'
							}}
						>
							<Text
								style={{
									fontSize: 20,
									fontWeight: 'bold',
									color: '#fff'
								}}
							>
								{_.capitalize(_.lowerCase(user.firstname)) + ' ' + _.upperCase(user.lastname)}
							</Text>

							<View
								style={{
									flex: 0,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<View
									style={{
										marginLeft: 7,
										transform: [
											{
												translateY: 1
											}
										],
										borderRadius: 11,
										borderColor:
											user && _.includes(connected_users, user._id) ? '#81bf97' : '#a0a0a2',
										backgroundColor:
											user && _.includes(connected_users, user._id)
												? '#81bf97'
												: 'rgba(0, 0, 0, 0)',
										borderWidth: 2,
										width: 11,
										height: 11
									}}
								/>
							</View>
						</View>
					</SafeAreaView>
				</View>

				<ScrollView
					style={{
						backgroundColor: '#fff'
					}}
				>
					<SafeAreaView
						style={{
							flex: 1,
							backgroundColor: '#fff',
							flexDirection: 'column'
						}}
					/>
				</ScrollView>
			</View>
		);
	}
}
