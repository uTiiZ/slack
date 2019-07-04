import { combineReducers } from 'redux';
import { tickets } from './tickets';
import { companies } from './companies';
import { threads } from './threads';
import { app } from './app';

export default combineReducers({
    app,
    tickets,
    companies,
    threads,
});