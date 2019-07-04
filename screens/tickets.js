import React from 'react';
import { Text, View, Image, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import Ticket from '../components/ticket';

import { tickets_toggle_edit_mode, tickets_list } from '../actions/tickets';

class Tickets extends React.Component {
	componentDidMount() {
		this.props.tickets_list('http://212.47.252.31/api/tickets');
	}

	render() {
		return (
			<View
				style={{
					flex: 1
				}}
			>
				<SafeAreaView
					style={{
						flex: 0,
						alignItems: 'center'
					}}
				>
					<View
						style={{
							height: 60,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-evenly'
						}}
					>
						<View
							style={{
								flex: 0,
								width: 60,
								height: 60
							}}
						/>

						<View
							style={{
								flex: 1,
								alignItems: 'center'
							}}
						>
							<Text
								style={{
									fontSize: 17,
									fontWeight: 'bold',
									color: '#D0D7E3'
								}}
							>
								Tickets
							</Text>
						</View>

						<View
							style={{
								flex: 0,
								width: 60,
								height: 60,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Image
								style={{
									width: 28,
									height: 28,
									opacity: 0.75
								}}
								source={require('../assets/new-direct-message.png')}
							/>
						</View>
					</View>
				</SafeAreaView>

				<View
					style={{
						flex: 1
					}}
				>
					<ScrollView
						stickyHeaderIndices={[ 1 ]}
						style={{
							flex: 1
						}}
					>
						<View
							style={{
								flex: 1,
								height: 10
							}}
						/>
						<View
							style={{
								marginVertical: 1,
								paddingVertical: 7.5,
								paddingHorizontal: 17.5,
								backgroundColor: '#353f4e'
							}}
						>
							<Text
								style={{
									fontSize: 13,
									color: '#fff',
									opacity: 0.5,
									fontWeight: '500'
								}}
							>
								RECENT
							</Text>
						</View>
						<View>
							{this.props.tickets.map((ticket) => {
								return <Ticket key={ticket._id} ticket={ticket} />;
							})}
						</View>

						<View
							style={{
								flex: 1,
								height: 75
							}}
						/>
					</ScrollView>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		current_ticket: state.app.current_ticket,
		tickets: state.tickets.tickets
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		tickets_list: (url) => dispatch(tickets_list(url)),
		tickets_toggle_edit_mode: (bool, id) => dispatch(tickets_toggle_edit_mode(bool, id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Tickets);
