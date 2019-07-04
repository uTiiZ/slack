import { COMPANIES_LIST, COMPANIES_ERROR, COMPANIES_LOADING, COMPANIES_CREATE, COMPANIES_UPDATE, COMPANIES_REMOVE, COMPANIES_TOGGLE_EDIT_MODE } from '../actions/companies';

const initialState = {
    companies: [],
    error: false,
    loading: false,
    edit: false
}

export const companies = (state = initialState, action) => {
    switch (action.type) {
        case COMPANIES_LIST:
            return Object.assign({}, state, {
                companies: action.companies
            })
        case COMPANIES_ERROR:
            return Object.assign({}, state, {
                error: action.error
            })
        case COMPANIES_LOADING:
            return Object.assign({}, state, {
                loading: action.loading
            })
        case COMPANIES_CREATE:
            return Object.assign({}, state, {
                companies: [
                    ...state.companies,
                    action.company
                ]
            })
        case COMPANIES_UPDATE:
            const updated_companies = state.companies.map(company => {
                if (company._id === action.company._id) {
                    return { ...company, ...action.company }
                }
                return company
            })
            return state
        case COMPANIES_REMOVE:
            return Object.assign({}, state, {
                companies: state.companies.filter(item => item._id !== action.id)
            })
        case COMPANIES_TOGGLE_EDIT_MODE:
            return Object.assign({}, state, {
                edit: action.edit
            })
        default:
            return state;
    }
}