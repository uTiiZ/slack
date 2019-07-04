import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { configureStore, configurePersistor } from './store';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';

import MyDrawer from './components/drawer';
import CommentDetails from './screens/comment_details';
import UserDetails from './screens/user_details';

const store = configureStore();
const persistor = configurePersistor(store);

const AppNavigator = createStackNavigator({
	Drawer: {
		screen: MyDrawer,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	},
	CommentDetails: {
		screen: CommentDetails,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	},
	UserDetails: {
		screen: UserDetails,
		navigationOptions: ({ navigation }) => ({
			header: null
		})
	}
});

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppContainer />
			</PersistGate>
		</Provider>
	);
}
