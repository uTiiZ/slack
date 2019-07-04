import { tickets_list } from './tickets';

export const APP_CHANGE_CURRENT_TAB_INDEX = 'APP_CHANGE_CURRENT_TAB_INDEX';
export const APP_CHANGE_CURRENT_COMPANY = 'APP_CHANGE_CURRENT_COMPANY';
export const APP_CHANGE_CURRENT_TICKET = 'APP_CHANGE_CURRENT_TICKET';
export const APP_CHANGE_CURRENT_THREAD = 'APP_CHANGE_CURRENT_THREAD';
export const APP_ADD_CONNECTED_USERS = 'APP_ADD_CONNECTED_USERS';
export const APP_REMOVE_CONNECTED_USERS = 'APP_REMOVE_CONNECTED_USERS';
export const APP_TOGGLE_ACTION_SHEET = 'APP_TOGGLE_ACTION_SHEET';

const change_current_tab_index = (index) => {
    return {
        type: APP_CHANGE_CURRENT_TAB_INDEX,
        index
    };
};

const change_current_company = (company) => {
    return {
        type: APP_CHANGE_CURRENT_COMPANY,
        company
    };
};

const change_current_ticket = (ticket) => {
    return {
        type: APP_CHANGE_CURRENT_TICKET,
        ticket
    };
};

const change_current_thread = (thread) => {
    return {
        type: APP_CHANGE_CURRENT_THREAD,
        thread
    };
};

const add_connected_users = (user) => {
    return {
        type: APP_ADD_CONNECTED_USERS,
        user
    };
};

const remove_connected_users = (user) => {
    return {
        type: APP_REMOVE_CONNECTED_USERS,
        user
    };
};

const toggle_action_sheet = (bool) => {
    return {
        type: APP_TOGGLE_ACTION_SHEET,
        action_sheet: bool
    };
};

export const app_change_current_tab_index = (index) => {
    return (dispatch) => {
        dispatch(change_current_tab_index(index));
    };
};

export const app_change_current_company = (company) => {
    return (dispatch) => {
        dispatch(change_current_company(company));
        dispatch(tickets_list(company.tickets))
    };
};

export const app_change_current_ticket = (ticket) => {
    return (dispatch) => {
        dispatch(change_current_ticket(ticket));
    };
};

export const app_change_current_thread = (thread) => {
    return (dispatch) => {
        dispatch(change_current_thread(thread));
    };
};

export const app_add_connected_users = (user) => {
    return (dispatch) => {
        dispatch(add_connected_users(user));
    };
};

export const app_remove_connected_users = (user) => {
    return (dispatch) => {
        dispatch(remove_connected_users(user));
    };
};

export const app_toggle_action_sheet = (bool) => {
    return (dispatch) => {
        dispatch(toggle_action_sheet(bool));
    };
};