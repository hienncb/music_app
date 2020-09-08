import { FETCH_MOVIES, FETCH_SUCCEEDED, FETCH_FAILED, ADD_MOVIE } from '../actions/actionTypes';
//Saga effects
import { put, takeLatest } from 'redux-saga/effects';
import { Api } from './Api';

function* fetchTodayMusics() {
    try {
        var receivedMovies = yield Api.getTodayMusics();   
        yield put({ type: FETCH_SUCCEEDED, receivedMovies: receivedMovies });     
    } catch (error) {        
        yield put({ type: FETCH_FAILED, error });
    }
}

function* fetchYearMusics() {
    try {
        var receivedMovies = yield Api.getYearMusics();   
        yield put({ type: FETCH_SUCCEEDED, receivedMovies: receivedMovies });     
    } catch (error) {        
        yield put({ type: FETCH_FAILED, error });
    }
}

export function* watchFetchMovies() {
    yield takeLatest(FETCH_MOVIES, fetchTodayMusics);
    yield takeLatest(ADD_MOVIE, fetchYearMusics);
}

