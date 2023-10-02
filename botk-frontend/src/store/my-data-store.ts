import { configureStore } from '@reduxjs/toolkit';

export enum Actions {
    Login,
    Logout,
    ChangeTheme
}

const myReducer = (state = {loggedIn: false, theme: {"mainColor": "rgb(232, 15, 39)",
        "mainTextColor": "white",
        "secondaryColor": "#FCD1A7",
        "secondaryTextColor": "black",
        "headImg": "toad-head.jpg"}, customer: null, token: null }, action: { type: Actions, payload: any }) => {
    switch(action.type) {
        case Actions.Login: {
            return { ...state, loggedIn: true, customer: action.payload.customer, token: action.payload.token }
        }
        case Actions.Logout: {
            return { ...state, loggedIn: false, user: null, token: null };
        }
        case Actions.ChangeTheme: {
            return { ...state, theme: action.payload }
        }
    }
    return state;
}

const store = configureStore({reducer: myReducer});
export default store;
