import { app_change_current_thread } from './app'

export const THREADS_LIST = 'THREADS_LIST';
export const THREADS_ERROR = 'THREADS_ERROR';
export const THREADS_LOADING = 'THREADS_LOADING';
export const THREADS_CREATE = 'THREADS_CREATE';
export const THREADS_REMOVE = 'THREADS_REMOVE';
export const THREADS_TOGGLE_SEARCH_MODE = 'THREADS_TOGGLE_SEARCH_MODE';
export const THREADS_FILTER = 'THREADS_FILTER';

const list = (threads) => {
    return {
        type: THREADS_LIST,
        threads
    };
};

const create = (thread) => {
    return {
        type: THREADS_CREATE,
        thread,
    };
};

const remove = (id) => {
    return {
        type: THREADS_REMOVE,
        id,
    };
};

const error = (bool) => {
    return {
        type: THREADS_ERROR,
        error: bool
    };
};

const loading = (bool) => {
    return {
        type: THREADS_LOADING,
        loading: bool
    };
};

const toggle_search_mode = (bool) => {
    return {
        type: THREADS_TOGGLE_SEARCH_MODE,
        search_mode: bool
    };
};

const filter = (str) => {
    return {
        type: THREADS_FILTER,
        filter: str
    };
};

export const threads_list = (url) => {
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
                dispatch(list(data.threads))
                dispatch(app_change_current_thread(data.threads[0]))
            })
            .catch(() => {
                dispatch(error(true))
            });
    };
};

export const threads_create = (thread) => {
    return (dispatch) => {
        dispatch(create(thread))
    };
};

export const threads_remove = (id) => {
    return (dispatch) => {
        dispatch(remove(id))
    };
};

export const threads_toggle_search_mode = (bool) => {
    return (dispatch) => {
        dispatch(toggle_search_mode(bool))
    };
};

export const threads_filter = (str) => {
    return (dispatch) => {
        dispatch(filter(str))
    };
};