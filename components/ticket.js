import React, { Component } from 'react';
import {
	Animated,
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
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import { tickets_toggle_edit_mode } from '../actions/tickets';

class Ticket extends Component {
	state = {
		animation: new Animated.Value(0)
	};

	componentWillReceiveProps(nextProps) {
		if (
			this.props.edit != nextProps.edit &&
			(this.props.ticket._id == nextProps.edit_id || nextProps.edit_id == null)
		) {
			Animated.spring(this.state.animation, {
				toValue: nextProps.edit ? 1 : 0,
				duration: 0.5
			}).start();
		}
	}

	render_date = (created_at) => {
		created_at = moment(created_at);
		if (moment().isSame(created_at, 'day')) return created_at.format('hh:mm A');
		if (moment().isSame(created_at, 'year')) return created_at.format('MMM Do');
		return created_at.format('MMM Do, YYYY');
	};

	render() {
		let { ticket, connected_users } = this.props;

		return (
			<TouchableWithoutFeedback
				onPress={() => {
					this.props.edit && this.props.tickets_toggle_edit_mode(false, null);
				}}
				onLongPress={() => {
					!this.props.edit
						? this.props.tickets_toggle_edit_mode(!this.props.edit, ticket._id)
						: this.props.tickets_toggle_edit_mode(false, null);
				}}
			>
				<Animated.View
					style={{
						flex: 1,
						left: this.state.animation.interpolate({
							inputRange: [ 0, 1 ],
							outputRange: [ 0, 65 ]
						}),
						flexDirection: 'row',
						marginHorizontal: 15,
						marginVertical: 7.5
					}}
				>
					<View
						style={{
							position: 'absolute',
							width: 50,
							height: 50,
							left: -65,
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row'
						}}
					>
						<TouchableWithoutFeedback
							onPress={() => {
								this.props.edit && this.props.tickets_toggle_edit_mode(false, null);
								ActionSheetIOS.showActionSheetWithOptions(
									{
										options: [ 'Annuler', 'Supprimer' ],
										cancelButtonIndex: 0,
										destructiveButtonIndex: 1
									},
									(buttonIndex) => {
										console.log(buttonIndex);
									}
								);
							}}
						>
							<View
								style={{
									flex: 0,
									width: 50,
									height: 50,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<Animated.View
									style={{
										width: 20,
										height: 20,
										borderRadius: 20,
										opacity: this.state.animation.interpolate({
											inputRange: [ 0, 1 ],
											outputRange: [ 0, 1 ]
										}),
										backgroundColor: '#eb4d3d',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<View
										style={{
											width: 11,
											height: 1.75,
											backgroundColor: '#fff'
										}}
									/>
								</Animated.View>
							</View>
						</TouchableWithoutFeedback>
						{/* <TouchableWithoutFeedback
              onPress={() => {
                this.props.edit && this.props.tickets_toggle_edit_mode(false, null)
                ActionSheetIOS.showActionSheetWithOptions({
                  options: ['Annuler', 'Supprimer'],
                  cancelButtonIndex: 0,
                  destructiveButtonIndex: 1,
                },
                  (buttonIndex) => {
                    console.log(buttonIndex)
                  });
              }}>
              <View
                style={{
                  flex: 0,
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    opacity: this.state.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1]
                    }),
                    backgroundColor: '#38978d',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 15,
                      height: 15,
                    }}
                    source={require('../assets/check.png')} />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback> */}
					</View>
					<View
						style={{
							flex: 0,
							width: 50,
							height: 50,
							marginRight: 15
						}}
					>
						<View
							style={{
								flex: 1,
								borderRadius: 6,
								justifyContent: 'center',
								alignItems: 'center',
								overflow: 'hidden'
							}}
						>
							<Image
								style={{
									width: 50,
									height: 50,
									backgroundColor: '#e2e8e5'
								}}
								source={{
									uri: 'http://212.47.252.31/static/img/' + ticket.user.username + '.png'
								}}
							/>
						</View>

						<View
							style={{
								position: 'absolute',
								top: 40,
								left: 40,
								width: 15,
								height: 15,
								borderRadius: 15,
								backgroundColor: '#4d394b',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<View
								style={{
									borderRadius: 10,
									borderColor:
										ticket.user && _.includes(connected_users, ticket.user._id)
											? '#38978d'
											: '#a49ca4', //57827D
									backgroundColor:
										ticket.user && _.includes(connected_users, ticket.user._id)
											? '#38978d'
											: 'rgba(0, 0, 0, 0)', //57827D
									borderWidth: 1,
									width: 10,
									height: 10
								}}
							/>
						</View>
					</View>

					<View
						style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							marginTop: 5
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'flex-end'
							}}
						>
							<Text
								style={{
									flex: 0,
									color: '#fff',
									fontSize: 17
								}}
							>
								{_.lowerCase(ticket.user.username)}
							</Text>
							<Text
								style={{
									flex: 0,
									marginLeft: 7.5,
									color: '#fff',
									opacity: 0.4,
									fontSize: 16
								}}
							>
								{this.render_date(ticket.created_at)}
							</Text>
						</View>
						<Text
							numberOfLines={2}
							style={{
								color: '#fff',
								opacity: 0.65,
								fontSize: 16
							}}
						>
							<Text
								style={{
									fontWeight: '500'
								}}
							>
								{ticket.location}
							</Text>
							{(!_.isEmpty(ticket.location) ? ' - ' : '') + ticket.description}
						</Text>
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		connected_users: state.app.connected_users,
		edit: state.tickets.edit,
		edit_id: state.tickets.edit_id
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		tickets_toggle_edit_mode: (bool, id) => dispatch(tickets_toggle_edit_mode(bool, id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
