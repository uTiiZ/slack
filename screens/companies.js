import React from 'react';
import { Animated, Text, View, Image, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { companies_list, companies_toggle_edit_mode } from '../actions/companies';
import { app_toggle_action_sheet } from '../actions/app';
import Company from '../components/company';

const AnimatedText = Animated.createAnimatedComponent(Text);

class Companies extends React.Component {
	state = {
		edit: false,
		animation: new Animated.Value(0)
	};

	componentDidMount() {
		this.props.companies_list('http://212.47.252.31/api/companies');
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.edit != nextProps.edit) {
			Animated.spring(this.state.animation, {
				toValue: nextProps.edit ? 1 : 0,
				duration: 0.5
			}).start();
		}
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
						<TouchableWithoutFeedback
							onPress={() => {
								this.props.app_toggle_action_sheet(!this.props.action_sheet);
							}}
						>
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
										opacity: 0.5
									}}
									source={require('../assets/get-help.png')}
								/>
							</View>
						</TouchableWithoutFeedback>

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
								{this.props.edit ? 'Edit' : 'Companies'}
							</Text>
						</View>
						<TouchableWithoutFeedback
							onPress={() => {
								this.props.companies_toggle_edit_mode(!this.props.edit);
							}}
						>
							<View
								style={{
									flex: 0,
									width: 60,
									height: 60
								}}
							>
								<Animated.View
									style={{
										width: 60,
										height: 60,
										position: 'absolute',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<AnimatedText
										style={{
											left: this.state.animation.interpolate({
												inputRange: [ 0, 1 ],
												outputRange: [ 0, -15 ]
											}),
											opacity: this.state.animation.interpolate({
												inputRange: [ 0, 1 ],
												outputRange: [ 0.75, 0 ]
											}),
											fontSize: 17,
											color: '#fff'
										}}
									>
										Edit
									</AnimatedText>
								</Animated.View>
								<Animated.View
									style={{
										width: 60,
										height: 60,
										position: 'absolute',
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<AnimatedText
										style={{
											left: this.state.animation.interpolate({
												inputRange: [ 0, 1 ],
												outputRange: [ -15, 0 ]
											}),
											opacity: this.state.animation.interpolate({
												inputRange: [ 0, 1 ],
												outputRange: [ 0, 0.75 ]
											}),
											fontSize: 17,
											color: '#fff'
										}}
									>
										Done
									</AnimatedText>
								</Animated.View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</SafeAreaView>
				<View
					style={{
						flex: 1
					}}
				>
					<ScrollView
						style={{
							flex: 1,
							paddingTop: 15
						}}
					>
						<Company all current />
						{this.props.companies.map((company) => {
							return (
								<Company
									key={company._id}
									company={company}
									unread={company.tickets.length}
									current={this.props.current_company._id == company._id}
								/>
							);
						})}
						<Company is_add_btn />
					</ScrollView>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		current_company: state.app.current_company,
		companies: state.companies.companies,
		error: state.companies.error,
		loading: state.companies.loading,
		edit: state.companies.edit,
		action_sheet: state.app.action_sheet
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		companies_list: (url) => dispatch(companies_list(url)),
		companies_toggle_edit_mode: (bool) => dispatch(companies_toggle_edit_mode(bool)),
		app_toggle_action_sheet: (bool) => dispatch(app_toggle_action_sheet(bool))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
