import React, {useEffect, useRef, useState} from 'react';
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
import { useSelector, useDispatch } from "react-redux";
import { Actions } from './store/my-data-store';
import themes from './themes.json';
import Dashboard from "./components/pages/Dashboard";


function App() {



    // @ts-ignore
    const theme = useSelector(state => state.theme);

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

    const appRef = document.getElementById('app');
    if (appRef) {
        appRef.style.setProperty('--maincolor', theme.mainColor);
        appRef.style.setProperty('--maintextcolor', theme.mainTextColor);
        appRef.style.setProperty('--secondarycolor', theme.secondaryColor);
        appRef.style.setProperty('--secondarytextcolor', theme.secondaryTextColor);
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
        </Routes>
    </div>
  );
}
//f3d20d
export default App;
