import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { configureStore, configurePersistor } from '../store';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';

import Drawer from 'react-native-drawer';
import ControlPanel from './control_panel';

import { connect } from 'react-redux';
import Main from '../screens/main';

class MyDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}
	render() {
		return (
			<Drawer
				ref={(ref) => (this._drawer = ref)}
				type="static"
				content={<ControlPanel closeDrawer={this.closeDrawer} />}
				onOpen={() => {
					console.log('onopen');
					this.setState({
						open: true
					});
				}}
				onClose={() => {
					console.log('onclose');
					this.setState({
						open: false
					});
				}}
				captureGestures={true}
				tweenDuration={100}
				panThreshold={0.25}
				openDrawerOffset={(viewport) => {
					return 25;
				}}
				panOpenMask={0.9}
				panCloseMask={0.1}
				negotiatePan={!this.state.open}
				tweenHandler={Drawer.tweenPresets.parallax}
			>
				<Main navigation={this.props.navigation} open={this.state.open} />
			</Drawer>
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer);
