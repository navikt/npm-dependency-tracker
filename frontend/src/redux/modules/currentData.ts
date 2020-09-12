import { call, put, takeLatest, select } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { NameFilter, PackFilter, RepoResult } from '@nav-frontend/shared-types';
import { RootState } from '../create';

const url = process.env.REACT_APP_URL ? process.env.REACT_APP_URL : 'http://localhost:3001';

enum Actions {
    'INITIAL_LOAD' = 'INITIAL_LOAD',
    'SUCCESS_LOAD' = 'SUCCESS_LOAD',
    'ERROR_LOAD' = 'ERROR_LOAD',
    'FILTER_NAMES' = 'FILTER_NAMES',
    'SUCCESS_GET_NAMES' = 'SUCCESS_GET_NAMES',
    'FILTER' = 'FILTER',
    'SUCCESS_FILTER' = 'SUCCESS_FILTER',
    'SORT_BY' = 'SORT_BY',
    'SET_NAMEFILTER' = 'SET_NAMEFILTER',
    'ADD_PACKFILTER' = 'ADD_PACKFILTER',
    'SET_PACKFILTER' = 'SET_PACKFILTER'
}

type DataAction =
    | { type: Actions.INITIAL_LOAD }
    | { type: Actions.SUCCESS_LOAD; data: RepoResult[] }
    | { type: Actions.SUCCESS_GET_NAMES; names: string[] }
    | { type: Actions.ERROR_LOAD; error: Error }
    | { type: Actions.FILTER_NAMES; filter: NameFilter }
    | { type: Actions.FILTER }
    | { type: Actions.SET_NAMEFILTER; filter: NameFilter }
    | { type: Actions.SUCCESS_FILTER }
    | { type: Actions.ADD_PACKFILTER; packfilter: PackFilter }
    | { type: Actions.SET_PACKFILTER; packfilter: PackFilter[] };

export function initialLoad(): DataAction {
    return { type: Actions.INITIAL_LOAD };
}
export function filterNames(filter: NameFilter): DataAction {
    return { type: Actions.FILTER_NAMES, filter: filter };
}
export function addPackFilter(filter: PackFilter): DataAction {
    return { type: Actions.ADD_PACKFILTER, packfilter: filter };
}

const postJson = (url: string, data: string) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then((res) => res.json());

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
        const res = yield call(() => postJson(url + '/filter-name', JSON.stringify(rest)));
        yield put({ type: Actions.SUCCESS_LOAD, data: res });
        yield put({ type: Actions.SET_NAMEFILTER, filter: rest });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}
function* filterPackages(action: DataAction) {
    const { type, ...rest } = action;
    const { packfilter } = rest as { packfilter: PackFilter };

    const getPackfilters = (state: RootState) => state.dataReducer.packFilter;
    const filters = yield select(getPackfilters);
    try {
        //const res = yield call(() => postJson(url + '/filter-name', JSON.stringify(rest)));
        //yield put({ type: Actions.SUCCESS_LOAD, data: res });
        yield put({ type: Actions.SET_PACKFILTER, packfilter: [...filters, packfilter] });
    } catch (e) {
        // yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}

export const dataSaga = [
    takeLatest(Actions.INITIAL_LOAD, fetchJson),
    takeLatest(Actions.FILTER_NAMES, filterName),
    takeLatest(Actions.ADD_PACKFILTER, filterPackages)
];

const data = createReducer([], {
    SUCCESS_LOAD: (state, action) => action.data,
    ERROR_LOAD: () => []
});
const names = createReducer([], {
    SUCCESS_GET_NAMES: (state, action) => action.names,
    ERROR_LOAD: () => []
});
const namesFilter = createReducer([], {
    SET_NAMEFILTER: (state, action) => action.nameFilter,
    ERROR_LOAD: () => []
});
const packFilter = createReducer([], {
    SET_PACKFILTER: (state, action) => action.packfilter,
    ERROR_LOAD: () => []
});

export default combineReducers({
    data,
    names,
    namesFilter,
    packFilter
});
