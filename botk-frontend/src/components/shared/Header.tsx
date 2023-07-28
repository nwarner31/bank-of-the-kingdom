import './Header.css';
import '../../Main.css'
import HoverButton from "../controls/HoverButton";
import {useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import '../../Theming.css';

function Header() {
    // @ts-ignore
    const theme = useSelector(state => state.theme);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);

    const useMobileLayout = useMediaQuery({query: '(max-width: 600px)'});

    const navButtons = loggedIn ?
        <>
            <HoverButton text="Dashboard" className='header-button' baseClass='main-color-bg' hoverClass='main-color-text' />
            <HoverButton text="Logout" className='header-button' baseClass='main-color-bg' hoverClass='main-color-text' />
        </> :
        <>
            <Link to='/login'><HoverButton className='header-button' text="Login" baseClass='main-color-bg' hoverClass='main-color-text' /></Link>
            <Link to='/register'><HoverButton className='header-button' text="Register" baseClass='main-color-bg' hoverClass='main-color-text' /></Link>
        </>
    return (
        <div className='nav-bar main-color-bg' >
            <div className='nav-body'>
                <span className='left-content'>
                    <Link to='/' >
                    <img src={`./resources/images/${theme.headImg}`} className='header-image' />
                    <span className='header-title-box'>
                        <span className='header-title header-main-title'><h1 className='headline title-headline'>Bank of the Kingdom</h1></span>
                        <span className='header-title'>Trusted by Toads and Goombas</span>
                    </span>
                    </Link>
                </span>
                <span className='right-content'>{useMobileLayout ? '' :  navButtons}</span>
            </div>
            { useMobileLayout && <div className='right-content'><div className='header-button-group'>{navButtons}</div></div>}
        </div>
    )
}

export default Header;