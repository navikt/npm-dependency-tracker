import { call, put, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import {} from '@nav-frontend/shared-types';

const url = process.env.REACT_APP_URL ? process.env.REACT_APP_URL : 'http://localhost:3001';

enum Actions {
    'INITIAL_LOAD' = 'INITIAL_LOAD',
    'SUCCESS_LOAD' = 'SUCCESS_LOAD',
    'ERROR_LOAD' = 'ERROR_LOAD',
    'GET_NAMES' = 'GET_NAMES',
    'SUCCESS_GET_NAMES' = 'SUCCESS_GET_NAMES',
    'FILTER' = 'FILTER',
    'SUCCESS_FILTER' = 'SUCCESS_FILTER'
}

type DataAction =
    | { type: Actions.INITIAL_LOAD }
    | { type: Actions.SUCCESS_LOAD; data: any[] }
    | { type: Actions.SUCCESS_GET_NAMES; names: string[] }
    | { type: Actions.ERROR_LOAD; error: Error }
    | { type: Actions.GET_NAMES }
    | { type: Actions.FILTER }
    | { type: Actions.SUCCESS_FILTER };

export function initialLoad(): DataAction {
    return { type: Actions.INITIAL_LOAD };
}
export function getNames(): DataAction {
    return { type: Actions.GET_NAMES };
}
export function filter(): DataAction {
    return { type: Actions.GET_NAMES };
}

function* fetchJson(action: DataAction) {
    try {
        const user = yield call(() =>
            fetch(url + '/get-current-packages').then((res) => res.json())
        );
        yield put({ type: Actions.SUCCESS_LOAD, data: user });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}
function* fetchNames(action: DataAction) {
    try {
        const names = yield call(() => fetch(url + '/get-repo-names').then((res) => res.json()));
        yield put({ type: Actions.SUCCESS_GET_NAMES, names: names });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}

export const dataSaga = [
    takeLatest(Actions.INITIAL_LOAD, fetchJson),
    takeLatest(Actions.GET_NAMES, fetchNames)
];

const data = createReducer([], {
    SUCCESS_LOAD: (state, action) => action.data,
    ERROR_LOAD: () => []
});
const names = createReducer([], {
    SUCCESS_GET_NAMES: (state, action) => action.names,
    ERROR_LOAD: () => []
});

export default combineReducers({
    data,
    names
});
