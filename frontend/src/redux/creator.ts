import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import AppReducer, { dataSaga } from './appState';

const rootReducer = combineReducers({ AppReducer });

export type RootState = ReturnType<typeof rootReducer>;

function* rootSaga() {
    yield all([...dataSaga]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
