import { NameFilter, PackFilter, RootFilter, ServerResults } from '@nav-frontend/shared-types';
import {
    CaseReducer,
    combineReducers,
    createReducer,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from './creator';

const url = process.env.REACT_APP_URL ? process.env.REACT_APP_URL : 'http://localhost:3001';

enum Actions {
    'INITIAL_LOAD' = 'INITIAL_LOAD',
    'SUCCESS_LOAD' = 'SUCCESS_LOAD',
    'ERROR_LOAD' = 'ERROR_LOAD',
    'CHANGE_NAMEFILTER' = 'CHANGE_NAMEFILTER',
    'ADD_PACKAGEFILTER' = 'ADD_PACKAGEFILTER',
    'CHANGE_PACKAGEFILTER' = 'CHANGE_PACKAGEFILTER',
    'REMOVE_PACKAGEFILTER' = 'REMOVE_PACKAGEFILTER',
    'UPDATE' = 'UPDATE'
}

type AppActions =
    | { type: Actions.INITIAL_LOAD }
    | { type: Actions.UPDATE }
    | { type: Actions.SUCCESS_LOAD; payload: ServerResults }
    | { type: Actions.ERROR_LOAD; payload: ServerResults }
    | { type: Actions.CHANGE_NAMEFILTER; payload: NameFilter }
    | { type: Actions.ADD_PACKAGEFILTER; payload: PackFilter }
    | { type: Actions.CHANGE_PACKAGEFILTER; payload: PackFilter }
    | { type: Actions.REMOVE_PACKAGEFILTER; payload: string };

type AppState = {
    serverData: ServerResults;
    nameFilter: NameFilter;
    packageFilter: PackFilter[];
};

const initialState: AppState = {
    serverData: { repos: [], statistics: [], history: [] },
    nameFilter: { name: '', sortby: '', withWebsite: false, isPrivate: false },
    packageFilter: []
};
export const initialLoad = (): AppActions => {
    return { type: Actions.INITIAL_LOAD };
};
export const update = (): AppActions => {
    return { type: Actions.UPDATE };
};

const postJson = (url: string, data: string) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then((res) => res.json());

function* fetchJson(action: AppActions) {
    try {
        const data = yield call(() => fetch(url + '/initial-load').then((res) => res.json()));
        yield put(serverLoad.actions.SUCCESS_LOAD(data));
    } catch (e) {
        yield put(serverLoad.actions.ERROR_LOAD());
    }
}
function* callServer() {
    try {
        const filterStates = (state: RootState) => state.AppReducer;
        const filters = yield select(filterStates);
        const filter: RootFilter = {
            nameFilter: filters.namefilter.nameFilter,
            packFilter: filters.packfilter.packageFilter,
            preset: ''
        };
        const res = yield call(() => postJson(url + '/filter', JSON.stringify(filter)));
        yield put(serverLoad.actions.SUCCESS_LOAD(res));
        return;
    } catch (e) {
        console.log(e);
        yield put(serverLoad.actions.ERROR_LOAD());
    }
}

const serverLoad = createSlice({
    name: 'serverData',
    initialState: initialState,
    reducers: {
        SUCCESS_LOAD: (state, action: PayloadAction<ServerResults>) => {
            return { ...state, serverData: action.payload };
        },
        ERROR_LOAD: (state) => {
            return { ...state };
        }
    }
});
export const nameFilterSlice = createSlice({
    name: 'nameFilterSlice',
    initialState: initialState,
    reducers: {
        CHANGE_NAMEFILTER: (state, action: PayloadAction<NameFilter>) => {
            return { ...state, nameFilter: action.payload };
        }
    }
});
export const packFilterSlice = createSlice({
    name: 'packFilterSlice',
    initialState: initialState,
    reducers: {
        ADD_PACKAGEFILTER: (state, action: PayloadAction<PackFilter>) => {
            for (const filter of state.packageFilter) {
                if (filter.key === action.payload.key) return { ...state };
            }
            return { ...state, packageFilter: [...state.packageFilter, action.payload] };
        },
        CHANGE_PACKAGEFILTER: (state, action: PayloadAction<PackFilter>) => {
            const updated = state.packageFilter.map((filter) => {
                if (filter.key === action.payload.key) {
                    return action.payload;
                } else return filter;
            });
            return { ...state, packageFilter: updated };
        },
        REMOVE_PACKAGEFILTER: (state, action: PayloadAction<string>) => {
            const updated = state.packageFilter.filter((filter) => {
                if (filter.key === action.payload) return false;
                else return true;
            });
            return { ...state, packageFilter: updated };
        }
    }
});

export const dataSaga = [
    takeLatest(Actions.INITIAL_LOAD, fetchJson),
    takeLatest(Actions.UPDATE, callServer)
];

export default combineReducers({
    server: serverLoad.reducer,
    namefilter: nameFilterSlice.reducer,
    packfilter: packFilterSlice.reducer
});
