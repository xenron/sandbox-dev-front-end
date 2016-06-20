


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index';

const logger = createLogger();
let createStoreWithMiddleware = applyMiddleware(thunk, promise, logger )(createStore);
if (ENV === 'production') {
    createStoreWithMiddleware = applyMiddleware(thunk, promise)(createStore);
}

export default function configureStore(initialState) {
    const create = window.devToolsExtension ? window.devToolsExtension()(createStoreWithMiddleware) : createStoreWithMiddleware;
    const store = create(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}