import { configureStore } from '@reduxjs/toolkit';

export enum Actions {
    Login,
    Logout,
    AddAccount,
    UpdateAccounts,
    AddLoan,
    ChangeTheme
}

const myReducer = (state = {loggedIn: false, theme: {"mainColor": "rgb(232, 15, 39)",
        "mainTextColor": "white",
        "secondaryColor": "#FCD1A7",
        "secondaryTextColor": "black",
        "headImg": "toad-head.jpg"}, customer: null, accounts: [], loans: [], token: null }, action: { type: Actions, payload: any }) => {
    switch(action.type) {
        case Actions.Login: {
            return { ...state,
                loggedIn: true,
                customer: action.payload.customer,
                accounts: action.payload.accounts,
                loans: action.payload.loans,
                token: action.payload.token }
        }
        case Actions.Logout: {
            return { ...state, loggedIn: false, user: null, token: null };
        }
        case Actions.AddAccount: {
            return { ...state, accounts: [...state.accounts, action.payload.account]};
        }
        case Actions.UpdateAccounts: {
            const accounts = [...state.accounts];
            for (let index = 0; index < action.payload.accounts.length; index++) {
                const account = action.payload.accounts[index];
                console.log(account);
                const i = accounts.findIndex((a: { id: number; }) => a.id === account.id);
                // @ts-ignore
                accounts[i] = account;
            }
            console.log(accounts);
            return { ...state, accounts: accounts};
        }
        case Actions.AddLoan:
            return { ...state, loans: [...state.loans, action.payload.loan]};
        case Actions.ChangeTheme: {
            return { ...state, theme: action.payload }
        }
    }
    return state;
}

const store = configureStore({reducer: myReducer});
export default store;
