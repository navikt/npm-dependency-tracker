import { NameFilter, PackFilter, RootFilter, ServerResults } from '@nav-frontend/shared-types';
import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from './creator';

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
    nameFilter: { name: '', sortby: '', withWebsite: false, isPrivate: false, isArchived: false },
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
        const data = yield call(() => fetch('/initial-load').then((res) => res.json()));
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
            nameFilter: filters.namefilter,
            packFilter: filters.packfilter,
            preset: ''
        };
        const res = yield call(() => postJson('/filter', JSON.stringify(filter)));
        yield put(serverLoad.actions.SUCCESS_LOAD(res));
        return;
    } catch (e) {
        console.log(e);
        yield put(serverLoad.actions.ERROR_LOAD());
    }
}

const serverLoad = createSlice({
    name: 'serverData',
    initialState: initialState.serverData,
    reducers: {
        SUCCESS_LOAD: (state, action: PayloadAction<ServerResults>) => {
            return action.payload;
        },
        ERROR_LOAD: (state) => state
    }
});

export const nameFilterSlice = createSlice({
    name: 'nameFilterSlice',
    initialState: initialState.nameFilter,
    reducers: {
        CHANGE_NAMEFILTER: (state, action: PayloadAction<NameFilter>) => action.payload
    }
});
export const packFilterSlice = createSlice({
    name: 'packFilterSlice',
    initialState: initialState.packageFilter,
    reducers: {
        ADD_PACKAGEFILTER: (state, action: PayloadAction<PackFilter>) => {
            for (const filter of state) {
                if (filter.key === action.payload.key) return { ...state };
            }
            return [...state, action.payload];
        },
        CHANGE_PACKAGEFILTER: (state, action: PayloadAction<PackFilter>) => {
            const updated = state.map((filter) => {
                if (filter.key === action.payload.key) {
                    return action.payload;
                } else return filter;
            });
            return updated;
        },
        REMOVE_PACKAGEFILTER: (state, action: PayloadAction<string>) => {
            const updated = state.filter((filter) => {
                if (filter.key === action.payload) return false;
                else return true;
            });
            return updated;
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
