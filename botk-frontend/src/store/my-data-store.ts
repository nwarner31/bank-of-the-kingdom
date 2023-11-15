import { configureStore } from '@reduxjs/toolkit';
import {Customer, Account, Loan, Theme} from '../models'

export enum Actions {
    Login,
    Logout,
    UpdateUser,
    AddAccount,
    UpdateAccounts,
    AddLoan,
    UpdateLoan,
    ChangeTheme
}

export interface ReduxState {
    loggedIn: boolean,
    theme: Theme,
    customer: Customer | null,
    token: string | null,
    accounts: Account[],
    loans: Loan[]
}

const myReducer = (state: ReduxState = {loggedIn: false, theme: {"mainColor": "rgb(232, 15, 39)",
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
            return { ...state, loggedIn: false, customer: null, token: null };
        }
        case Actions.UpdateUser: {
            return { ...state, customer: action.payload };
        }
        case Actions.AddAccount: {
            return { ...state, accounts: [...state.accounts, action.payload.account]};
        }
        case Actions.UpdateAccounts: {
            const accounts = [...state.accounts];
            for (let index = 0; index < action.payload.accounts.length; index++) {
                const account = action.payload.accounts[index];
                console.log(account);
                const i = accounts.findIndex(a => a.id === account.id);
                accounts[i] = account;
            }
            console.log(accounts);
            return { ...state, accounts};
        }
        case Actions.AddLoan:
            return { ...state, loans: [...state.loans, action.payload.loan]};
        case Actions.UpdateLoan:
            const loans = [...state.loans];
            const index = loans.findIndex(loan => loan.id === action.payload.id);
            loans[index] = action.payload;
            return {...state, loans}
        case Actions.ChangeTheme: {
            return { ...state, theme: action.payload }
        }
    }
    return state;
}

const store = configureStore({reducer: myReducer});
export default store;
