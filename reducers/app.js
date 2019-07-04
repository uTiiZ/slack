import {
	APP_CHANGE_CURRENT_TAB_INDEX,
	APP_CHANGE_CURRENT_COMPANY,
	APP_CHANGE_CURRENT_TICKET,
	APP_CHANGE_CURRENT_THREAD,
	APP_ADD_CONNECTED_USERS,
	APP_REMOVE_CONNECTED_USERS,
	APP_TOGGLE_ACTION_SHEET
} from '../actions/app';

const initialState = {
	current_tab_index: 0,
	current_company: {},
	current_ticket: {},
	current_thread: {},
	connected_users: [ '5bb75ecb10ada25a2ae547e7' ],
	action_sheet: false
};

export const app = (state = initialState, action) => {
	switch (action.type) {
		case APP_CHANGE_CURRENT_TAB_INDEX:
			return Object.assign({}, state, {
				current_tab_index: action.index
			});
		case APP_CHANGE_CURRENT_COMPANY:
			return Object.assign({}, state, {
				current_company: action.company
			});
		case APP_CHANGE_CURRENT_TICKET:
			return Object.assign({}, state, {
				current_ticket: action.ticket
			});
		case APP_CHANGE_CURRENT_THREAD:
			return Object.assign({}, state, {
				current_thread: action.thread
			});
		case APP_ADD_CONNECTED_USERS:
			return Object.assign({}, state, {
				connected_users: [ ...state.connected_users, action.user._id ]
			});
		case APP_REMOVE_CONNECTED_USERS:
			return Object.assign({}, state, {
				connected_users: state.connected_users.filter((item) => item !== action.user._id)
			});
		case APP_TOGGLE_ACTION_SHEET:
			return Object.assign({}, state, {
				action_sheet: action.action_sheet
			});
		default:
			return state;
	}
};
