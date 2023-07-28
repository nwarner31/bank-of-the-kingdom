import React, {useEffect, useRef, useState} from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/shared/Header';
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { useSelector, useDispatch } from "react-redux";
import { Actions } from './store/my-data-store';
import themes from './themes.json';


function App() {



    // @ts-ignore
    const theme = useSelector(state => state.theme);

    const [themeState, updateThemes] = useState([]);
    const dispatch = useDispatch();
    const appRef = document.getElementById('app');
    if (appRef) {
        appRef.style.setProperty('--maincolor', theme.mainColor);
        appRef.style.setProperty('--maintextcolor', theme.mainTextColor);
        appRef.style.setProperty('--secondarycolor', theme.secondaryColor);
        appRef.style.setProperty('--secondarytextcolor', theme.secondaryTextColor);
    }
    //let themeArray: string[] = [];
    function changeTheme(themeName: string) {
        // @ts-ignore
        const newTheme = themes[themeName];
        localStorage.setItem('theme', themeName);
        dispatch({type: Actions.ChangeTheme, payload: newTheme});
    }

    useEffect(() => {
            let themeArray: string[] = [];
        for (let themesKey in themes) {
            themeArray.push(themesKey);
            console.log(themesKey);
        }
        // @ts-ignore
        updateThemes(themeArray);
        const ltheme = localStorage.getItem('theme') ?? 'Toad';
        changeTheme(ltheme);
    }, [])
  return (
    <div className="App" id='app'>
        <Header />
        {themeState.map((theme) => (<div onClick={() => changeTheme(theme)} className='secondary-color-bg'> {theme} Theme</div>))}

        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    </div>
  );
}
//f3d20d
export default App;
