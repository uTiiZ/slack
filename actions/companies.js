import { app_change_current_company } from './app'
import { tickets_list } from './tickets';

export const COMPANIES_LIST = 'COMPANIES_LIST';
export const COMPANIES_ERROR = 'COMPANIES_ERROR';
export const COMPANIES_LOADING = 'COMPANIES_LOADING';
export const COMPANIES_CREATE = 'COMPANIES_CREATE';
export const COMPANIES_UPDATE = 'COMPANIES_UPDATE';
export const COMPANIES_TOGGLE_EDIT_MODE = 'COMPANIES_TOGGLE_EDIT_MODE';
export const COMPANIES_REMOVE = 'COMPANIES_REMOVE';

const list = (companies) => {
    return {
        type: COMPANIES_LIST,
        companies
    };
};

const create = (company) => {
    return {
        type: COMPANIES_CREATE,
        company
    };
};

const update = (company, ticket) => {
    return {
        type: COMPANIES_UPDATE,
        company,
        ticket
    };
};

const remove = (id) => {
    return {
        type: COMPANIES_REMOVE,
        id
    };
};

const error = (bool) => {
    return {
        type: COMPANIES_ERROR,
        error: bool
    };
};

const loading = (bool) => {
    return {
        type: COMPANIES_LOADING,
        loading: bool
    };
};

const toggle_edit_mode = (bool) => {
    return {
        type: COMPANIES_TOGGLE_EDIT_MODE,
        edit: bool
    };
};

export const companies_list = (url) => {
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
                dispatch(list(data.companies))
                dispatch(app_change_current_company(data.companies[0]))
                dispatch(tickets_list(data.companies[0].tickets))
            })
            .catch(() => {
                dispatch(error(true))
            });
    };
};

export const companies_create = (company) => {
    return (dispatch) => {
        dispatch(create(company))
    };
};

export const companies_update = (company, ticket = null) => {
    return (dispatch) => {
        dispatch(update(company, ticket))
    };
};

export const companies_remove = (url, id) => {
    return (dispatch) => {
        fetch(url + '/' + id,
            {
                method: 'DELETE'
            })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(loading(false));
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                dispatch(remove(id))
            })
            .catch(() => {
                dispatch(error(true))
            });
    };
};

export const companies_toggle_edit_mode = (bool) => {
    return (dispatch) => {
        dispatch(toggle_edit_mode(bool));
    };
};