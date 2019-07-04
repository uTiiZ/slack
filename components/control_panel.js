import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import Companies from '../screens/companies';
import Threads from '../screens/threads';
import Tickets from '../screens/tickets';
import ActionSheet from './actionsheet';

import { connect } from 'react-redux';
import {
	app_change_current_tab_index,
	app_add_connected_users,
	app_remove_connected_users,
	app_toggle_action_sheet
} from '../actions/app';
import { companies_toggle_edit_mode } from '../actions/companies';
import { tickets_toggle_edit_mode } from '../actions/tickets';
import { threads_toggle_search_mode } from '../actions/threads';

const TabNavigator = createMaterialTopTabNavigator(
	{
		Companies: {
			screen: Companies,
			navigationOptions: {
				tabBarVisible: false
			}
		},
		Threads: {
			screen: Threads,
			navigationOptions: {
				tabBarVisible: false
			}
		},
		Tickets: {
			screen: Tickets,
			navigationOptions: {
				tabBarVisible: false
			}
		}
	},
	{
		initialRouteName: 'Tickets'
	}
);

const Tabs = createAppContainer(TabNavigator);

class ControlPanel extends Component {
	render() {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: '#353f4e'
				}}
			>
				<StatusBar barStyle="light-content" />
				<View style={[ StyleSheet.absoluteFill ]}>
					<SafeAreaView
						style={{
							flex: 0,
							backgroundColor: '#2d3643'
						}}
					>
						<View
							style={{
								height: 60
							}}
						/>
					</SafeAreaView>
				</View>

				<Tabs
					onNavigationStateChange={(prev, current) => {
						this.props.app_change_current_tab_index(current.index);
						this.props.companies_edit && this.props.companies_toggle_edit_mode(false);
						this.props.tickets_edit && this.props.tickets_toggle_edit_mode(false);
						this.props.threads_search_mode && this.props.threads_toggle_search_mode(false);
					}}
				/>
				<SafeAreaView
					pointerEvents="none"
					style={[
						StyleSheet.absoluteFill,
						{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'flex-end',
							marginBottom: 50
						}
					]}
				>
					<View
						style={{
							flex: 0,
							flexDirection: 'row',
							height: 25,
							borderRadius: 36,
							paddingHorizontal: 8,
							backgroundColor: 'rgba(255, 255, 255, 0.1)',
							justifyContent: 'space-between',
							alignItems: 'center'
						}}
					>
						<View
							style={{
								height: 7,
								width: 7,
								borderRadius: 7,
								backgroundColor: '#fff',
								opacity: this.props.current_tab_index === 0 ? 0.75 : 0.2,
								marginHorizontal: 4
							}}
						/>
						<View
							style={{
								height: 7,
								width: 7,
								borderRadius: 7,
								backgroundColor: '#fff',
								opacity: this.props.current_tab_index === 1 ? 0.75 : 0.2,
								marginHorizontal: 4
							}}
						/>
						<View
							style={{
								height: 7,
								width: 7,
								borderRadius: 7,
								backgroundColor: '#fff',
								opacity: this.props.current_tab_index === 2 ? 0.75 : 0.2,
								marginHorizontal: 4
							}}
						/>
					</View>
				</SafeAreaView>
				{/* <ActionSheet /> */}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FF0000',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

const mapStateToProps = (state) => {
	return {
		current_tab_index: state.app.current_tab_index,
		current_company: state.app.current_company,
		action_sheet: state.app.action_sheet,
		companies_edit: state.companies.edit,
		tickets_edit: state.tickets.edit,
		threads_search_mode: state.threads.search_mode
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		app_change_current_tab_index: (index) => dispatch(app_change_current_tab_index(index)),
		app_add_connected_users: (user) => dispatch(app_add_connected_users(user)),
		app_remove_connected_users: (user) => dispatch(app_remove_connected_users(user)),
		app_toggle_action_sheet: (bool) => dispatch(app_toggle_action_sheet(bool)),
		companies_toggle_edit_mode: (edit) => dispatch(companies_toggle_edit_mode(edit)),
		tickets_toggle_edit_mode: (edit) => dispatch(tickets_toggle_edit_mode(edit)),
		threads_toggle_search_mode: (bool) => dispatch(threads_toggle_search_mode(bool))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
