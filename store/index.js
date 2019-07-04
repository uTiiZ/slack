import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = (initialState) => {
    return createStore(
        persistedReducer,
        initialState,
        applyMiddleware(thunk)
    );
}

export const configurePersistor = (store) => {
    return persistStore(store);
}