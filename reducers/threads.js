import { THREADS_LIST, THREADS_ERROR, THREADS_LOADING, THREADS_CREATE, THREADS_REMOVE, THREADS_TOGGLE_SEARCH_MODE, THREADS_FILTER } from '../actions/threads';

const initialState = {
    threads: [],
    threads_filtered: [],
    error: false,
    loading: false,
    search_mode: false,
    search: '',
}

export const threads = (state = initialState, action) => {
    switch (action.type) {
        case THREADS_LIST:
            return Object.assign({}, state, {
                threads: action.threads
            })
        case THREADS_ERROR:
            return Object.assign({}, state, {
                error: action.error
            })
        case THREADS_LOADING:
            return Object.assign({}, state, {
                loading: action.loading
            })
        case THREADS_CREATE:
            return Object.assign({}, state, {
                threads: [
                    ...state.threads,
                    action.thread
                ]
            })
        case THREADS_REMOVE:
            return Object.assign({}, state, {
                threads: state.threads.filter(item => item._id !== action.id)
            })
        case THREADS_TOGGLE_SEARCH_MODE:
            return Object.assign({}, state, {
                search_mode: action.search_mode,
                threads_filtered: state.threads
            })
        case THREADS_FILTER:
            return Object.assign({}, state, {
                search: action.filter,
                threads_filtered: state.threads.filter(item => item.name.includes(action.filter))
            })
        default:
            return state;
    }
}