import { call, put, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { RepoResult } from '@nav-frontend/shared-types';

const url = process.env.REACT_APP_URL ? process.env.REACT_APP_URL : 'http://localhost:3001';

enum Actions {
    'INITIAL_LOAD' = 'INITIAL_LOAD',
    'SUCCESS_LOAD' = 'SUCCESS_LOAD',
    'ERROR_LOAD' = 'ERROR_LOAD',
    'FILTER_NAMES' = 'FILTER_NAMES',
    'SUCCESS_GET_NAMES' = 'SUCCESS_GET_NAMES',
    'FILTER' = 'FILTER',
    'SUCCESS_FILTER' = 'SUCCESS_FILTER'
}

type DataAction =
    | { type: Actions.FILTER_NAMES; filter: string }
    | { type: Actions.INITIAL_LOAD }
    | { type: Actions.SUCCESS_LOAD; data: RepoResult[] }
    | { type: Actions.SUCCESS_GET_NAMES; names: string[] }
    | { type: Actions.ERROR_LOAD; error: Error }
    | { type: Actions.FILTER }
    | { type: Actions.SUCCESS_FILTER };

export function initialLoad(): DataAction {
    return { type: Actions.INITIAL_LOAD };
}
export function filterNames(s: string): DataAction {
    return { type: Actions.FILTER_NAMES, filter: s };
}

function* fetchJson(action: DataAction) {
    try {
        const user = yield call(() => fetch(url + '/get-result').then((res) => res.json()));
        yield put({ type: Actions.SUCCESS_LOAD, data: user as RepoResult[] });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}
function* filterName(action: DataAction) {
    const { type, ...rest } = action;
    try {
        const res = yield call(() =>
            fetch(url + '/filter-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(rest)
            }).then((res) => res.json())
        );
        yield put({ type: Actions.SUCCESS_LOAD, data: res });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}

export const dataSaga = [
    takeLatest(Actions.INITIAL_LOAD, fetchJson),
    takeLatest(Actions.FILTER_NAMES, filterName)
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
