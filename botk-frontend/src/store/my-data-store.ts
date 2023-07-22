import { configureStore } from '@reduxjs/toolkit';

export enum Actions {
    Login,
    Logout,
    ChangeTheme
}

const myReducer = (state = {loggedIn: false, theme: {'mainColor': 'red'}, user: null }, action: { type: Actions, payload: any }) => {
    switch(action.type) {
        case Actions.Login: {
            return { ...state, loggedIn: true, user: action.payload }
        }
        case Actions.Logout: {
            return { ...state, loggedIn: false, user: null };
        }
        case Actions.ChangeTheme: {
            return { ...state, theme: action.payload }
        }
    }
    return state;
}

const store = configureStore({reducer: myReducer});
export default store;
