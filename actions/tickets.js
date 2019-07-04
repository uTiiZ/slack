import { app_change_current_ticket } from './app';

export const TICKETS_LIST = 'TICKETS_LIST';
export const TICKETS_ERROR = 'TICKETS_ERROR';
export const TICKETS_LOADING = 'TICKETS_LOADING';
export const TICKETS_CREATE = 'TICKETS_CREATE';
export const TICKETS_TOGGLE_EDIT_MODE = 'TICKETS_TOGGLE_EDIT_MODE';

const list = (tickets) => {
	return {
		type: TICKETS_LIST,
		tickets
	};
};

const create = (ticket, company, current_company) => {
	return {
		type: TICKETS_CREATE,
		ticket,
		company,
		current_company
	};
};

const error = (bool) => {
	return {
		type: TICKETS_ERROR,
		error: bool
	};
};

const loading = (bool) => {
	return {
		type: TICKETS_LOADING,
		loading: bool
	};
};

const toggle_edit_mode = (bool, id) => {
	return {
		type: TICKETS_TOGGLE_EDIT_MODE,
		edit: bool,
		id
	};
};
export const tickets_list = (url) => {
	return (dispatch) => {
		dispatch(loading(true));
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				dispatch(loading(false));
				return response;
			})
			.then((response) => response.json())
			.then((data) => {
				console.log(data.tickets);
				dispatch(list(data.tickets));
			})
			.catch(() => {
				dispatch(error(true));
			});
	};
};

export const tickets_create = (ticket, company, current_company) => {
	return (dispatch) => {
		dispatch(create(ticket, company, current_company));
	};
};

export const tickets_toggle_edit_mode = (bool, id) => {
	return (dispatch) => {
		dispatch(toggle_edit_mode(bool, id));
	};
};
