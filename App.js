import React, { Component } from 'react';
//Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import allReducers from './src/reducers/index';
import MainContain from './src/navigations/MainNavigation';
//Redux saga
import createSagaMiddleware from 'redux-saga';
import rootSaga from './src/sagas/rootSaga'; 

const sagaMiddleware = createSagaMiddleware();

let store = createStore(allReducers, applyMiddleware(sagaMiddleware));
const App = () => (
    <Provider store={store}>
        <MainContain />
    </Provider>
);
sagaMiddleware.run(rootSaga);
export default App;