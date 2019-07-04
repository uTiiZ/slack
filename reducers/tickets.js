import { TICKETS_LIST, TICKETS_ERROR, TICKETS_LOADING, TICKETS_CREATE, TICKETS_TOGGLE_EDIT_MODE } from '../actions/tickets';

const initialState = {
    tickets: [],
    error: false,
    loading: false,
    edit: false,
    edit_id: null
}

export const tickets = (state = initialState, action) => {
    switch (action.type) {
        case TICKETS_LIST:
            return Object.assign({}, state, {
                tickets: action.tickets
            })
        case TICKETS_ERROR:
            return Object.assign({}, state, {
                error: action.error
            })
        case TICKETS_LOADING:
            return Object.assign({}, state, {
                loading: action.loading
            })
        case TICKETS_CREATE:
            if (action.company._id == action.current_company._id) {
                return Object.assign({}, state, {
                    tickets: [
                        ...state.tickets,
                        action.ticket
                    ]
                })
            }
            return state
        case TICKETS_TOGGLE_EDIT_MODE:
            return Object.assign({}, state, {
                edit: action.edit,
                edit_id: action.id,
            })
        default:
            return state;
    }
}