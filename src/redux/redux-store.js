import {createStore, combineReducers,applyMiddleware} from 'redux'
import addTestReducer from './addTestReducer'
import ListTestsReducer from './ListTestsReducer'
import authReducer from './authReducer'
import thunkMiddleware from "redux-thunk" 

let reducers=combineReducers({
    addTest:addTestReducer,
    listTests:ListTestsReducer,
    auth:authReducer
}
);

let store=createStore(reducers,applyMiddleware(thunkMiddleware));

window.store=store;

export default store;