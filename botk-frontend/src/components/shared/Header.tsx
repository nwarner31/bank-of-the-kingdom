import './Header.css';
import '../../common.css'
import properties from "../../utility/data/application.json";
import HoverButton from "../controls/HoverButton";
import { Actions } from '../../store/my-data-store';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import '../../Theming.css';

function Header() {
    // @ts-ignore
    const theme = useSelector(state => state.theme);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);

    const useMobileLayout = useMediaQuery({query: '(max-width: 600px)'});
    // @ts-ignore
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function logout() {
        fetch(properties.url + "/logout", {method: 'POST',
            headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`}}).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            dispatch(({type: Actions.Logout}));
            navigate("/");
        })

    }
    const navButtons = loggedIn ?
        <>
            <Link to='/dashboard'> <HoverButton text="Dashboard" className='header-button' baseClass='main-color-bg' hoverClass='main-color-text' /></Link>
            <HoverButton text="Logout" className='header-button' baseClass='main-color-bg' hoverClass='main-color-text' clickAction={logout} />
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