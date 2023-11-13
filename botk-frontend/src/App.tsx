import React, {useState} from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/shared/Header';
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import CreateAccount from "./components/pages/CreateAccount";
import Account from './components/pages/Account';
import Transfer from "./components/pages/Transfer";
import ApplyLoan from "./components/pages/ApplyLoan";
import Loan from './components/pages/Loan';
import { useSelector, useDispatch } from "react-redux";
import { Actions } from './store/my-data-store';
import themes from './themes.json';
import Dashboard from "./components/pages/Dashboard";

import {ReduxState} from "./store/my-data-store";

function App() {

    const theme = useSelector((state: ReduxState)  => state.theme);

    const [themeState, updateThemes] = useState([]);
    const dispatch = useDispatch();

    //let themeArray: string[] = [];
    function changeTheme(themeName: string) {
        // @ts-ignore
        const newTheme = themes[themeName];
        localStorage.setItem('theme', themeName);
        dispatch({type: Actions.ChangeTheme, payload: newTheme});
    }
    if(themeState.length === 0) {
        let themeArray: string[] = [];
            for (let themesKey in themes) {
                themeArray.push(themesKey);
                console.log(themesKey);
            }
            // @ts-ignore
            updateThemes(themeArray);
            const ltheme = localStorage.getItem('theme') ?? 'Toad';
            changeTheme(ltheme);
    }

    const rootRef = document.getElementById('root');
    if (rootRef) {
        rootRef.style.setProperty('--maincolor', theme.mainColor);
        rootRef.style.setProperty('--maintextcolor', theme.mainTextColor);
        rootRef.style.setProperty('--secondarycolor', theme.secondaryColor);
        rootRef.style.setProperty('--secondarytextcolor', theme.secondaryTextColor);
    }

  return (
    <div className="App" id='app'>
        <Header />
        {themeState.map((theme) => (<div key={theme} onClick={() => changeTheme(theme)} className='secondary-color-bg'> {theme} Theme</div>))}

        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/create-account' element={<CreateAccount />} />
            <Route path='/account/:accountId' element={<Account />} />
            <Route path='/transfer' element={<Transfer />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/loan/:loanId" element={<Loan />} />
        </Routes>
    </div>
  );
}

export default App;
