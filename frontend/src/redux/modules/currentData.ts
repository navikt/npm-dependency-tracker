import { call, put, takeLatest } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import { createReducer } from '@reduxjs/toolkit';
import Repo from '../../ts/repo';

enum Actions {
    'INITIAL_LOAD' = 'INITIAL_LOAD',
    'SUCCESS_LOAD' = 'SUCCESS_LOAD',
    'ERROR_LOAD' = 'ERROR_LOAD'
}

type DataAction =
    | { type: Actions.INITIAL_LOAD }
    | { type: Actions.SUCCESS_LOAD; data: Repo[] }
    | { type: Actions.ERROR_LOAD; error: Error };

export function initialLoad(): DataAction {
    return { type: Actions.INITIAL_LOAD };
}

function* fetchJson(action: DataAction) {
    try {
        const user = yield call(() => fetch('outputPackages.json').then((res) => res.json()));
        yield put({ type: Actions.SUCCESS_LOAD, data: user as Repo[] });
    } catch (e) {
        yield put({ type: Actions.ERROR_LOAD, error: e });
    }
}

export const dataSaga = [takeLatest(Actions.INITIAL_LOAD, fetchJson)];

const data = createReducer([], {
    SUCCESS_LOAD: (state, action) => action.data,
    ERROR_LOAD: () => []
});

export default combineReducers({
    data
});
