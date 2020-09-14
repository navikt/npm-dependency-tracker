import { call, put, takeLatest, select } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import { NameFilter, PackFilter, RepoResult, RootFilter } from '@nav-frontend/shared-types';
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
    'CHANGE_PACKFILTER' = 'CHANGE_PACKFILTER',
    'REMOVE_PACKFILTER' = 'REMOVE_PACKFILTER',
    'SET_PACKFILTER' = 'SET_PACKFILTER',
    'UPDATE' = 'UPDATE'
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
    | { type: Actions.CHANGE_PACKFILTER; packfilter: PackFilter }
    | { type: Actions.REMOVE_PACKFILTER; key: string }
    | { type: Actions.SET_PACKFILTER; packfilter: PackFilter[] }
    | { type: Actions.UPDATE };

export function initialLoad(): DataAction {
    return { type: Actions.INITIAL_LOAD };
}
export function filterNames(filter: NameFilter): DataAction {
    return { type: Actions.FILTER_NAMES, filter: filter };
}
export function addPackFilter(filter: PackFilter): DataAction {
    return { type: Actions.ADD_PACKFILTER, packfilter: filter };
}
export function changePackFilter(filter: PackFilter): DataAction {
    return { type: Actions.CHANGE_PACKFILTER, packfilter: filter };
}
export function removePackFilter(key: string): DataAction {
    return { type: Actions.REMOVE_PACKFILTER, key: key };
}
export function update(): DataAction {
    return { type: Actions.UPDATE };
}

function* getFilters() {
    const filterStates = (state: RootState) => state.dataReducer;
    const filters = yield select(filterStates);

    const f: RootFilter = {
        nameFilter: filters.namesFilter,
        packFilter: filters.packFilter,
        preset: ''
    };
    return f;
}
function* setFilter() {
    try {
        const allFilters = yield call(() => getFilters());
        //console.log(allFilters);
        const res = yield call(() => postJson(url + '/filter', JSON.stringify(allFilters)));
        yield put({ type: Actions.SUCCESS_LOAD, data: res });
        return;
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
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
    const { filter } = rest as { filter: NameFilter };
    try {
        yield put({ type: Actions.SET_NAMEFILTER, nameFilter: filter });
    } catch (e) {}
}

function* filterPackages(action: DataAction) {
    const { type, ...rest } = action;
    const { packfilter } = rest as { packfilter: PackFilter };

    const getPackfilters = (state: RootState) => state.dataReducer.packFilter;
    const filters = yield select(getPackfilters);
    const newFilters: PackFilter[] = JSON.parse(JSON.stringify(filters));

    for (let i = 0; i < newFilters.length; i++) {
        if (newFilters[i].key === packfilter.key) {
            newFilters[i].name = packfilter.name;
            newFilters[i].version = packfilter.version;
            newFilters[i].timeline = packfilter.timeline;
            yield put({ type: Actions.SET_PACKFILTER, packfilter: [...newFilters] });
            return;
        }
    }
    yield put({ type: Actions.SET_PACKFILTER, packfilter: [...filters, packfilter] });
}
function* removeFilterPackages(action: DataAction) {
    const { type, ...rest } = action;
    const { key } = rest as { key: string };

    const getPackfilters = (state: RootState) => state.dataReducer.packFilter;
    const filters = yield select(getPackfilters);
    const newFilters: PackFilter[] = JSON.parse(JSON.stringify(filters));

    for (let i = 0; i < newFilters.length; i++) {
        if (newFilters[i].key === key) {
            newFilters.splice(i, 1);
            yield put({ type: Actions.SET_PACKFILTER, packfilter: [...newFilters] });
            return;
        }
    }
    yield put({ type: Actions.SET_PACKFILTER, packfilter: [...filters] });
}

export const dataSaga = [
    takeLatest(Actions.INITIAL_LOAD, fetchJson),
    takeLatest(Actions.FILTER_NAMES, filterName),
    takeLatest(Actions.ADD_PACKFILTER, filterPackages),
    takeLatest(Actions.CHANGE_PACKFILTER, filterPackages),
    takeLatest(Actions.REMOVE_PACKFILTER, removeFilterPackages),
    takeLatest(Actions.UPDATE, setFilter)
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
