import React, {useEffect, useRef} from 'react';
import './App.css';
import Header from './components/shared/Header';
import { useSelector, useDispatch } from "react-redux";
import { Actions } from './store/my-data-store';
import themes from './themes.json';

function App() {

    // @ts-ignore
    //const theme = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const appRef = document.getElementById('app');
    if (appRef) {
        appRef.style.setProperty('--mainColor', 'red');
    }

    function changeTheme(themeName: string) {
        // @ts-ignore
        const newTheme = themes[themeName];
        localStorage.setItem('theme', themeName);
        dispatch({type: Actions.ChangeTheme, payload: newTheme});
    }

    useEffect(() => {
        const ltheme = localStorage.getItem('theme') ?? 'Toad';
        changeTheme(ltheme);
    }, [])
  return (
    <div className="App" id='app'>
        <Header />
        <div onClick={() => changeTheme('Toad')}> Toad Theme</div>
        <div onClick={() => changeTheme('Mario')}> Mario Theme</div>
        <div onClick={() => changeTheme('Luigi')}> Luigi Theme</div>
        <div onClick={() => changeTheme('Yoshi')}> Yoshi Theme</div>
    </div>
  );
}

export default App;
