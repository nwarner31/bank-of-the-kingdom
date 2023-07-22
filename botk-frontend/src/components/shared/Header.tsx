import './Header.css';
import '../../Main.css'
import HoverButton from "../controls/HoverButton";
import {useSelector} from "react-redux";

function Header() {
    // @ts-ignore
    const theme = useSelector(state => state.theme);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);

    const navButtons = loggedIn ?
        <>
            <HoverButton mainColor={theme ? theme.mainColor : "green"} secondColor={theme ? theme.textColor: "black"} text="Dashboard" />
            <HoverButton mainColor={theme ? theme.mainColor : "green"} secondColor={theme ? theme.textColor: "black"} text="Logout" />
        </> :
        <>
            <HoverButton className='header-button' mainColor={theme ? theme.mainColor : "green"} secondColor={theme ? theme.textColor: "black"} text="Login" />
            <HoverButton className='header-button' mainColor={theme ? theme.mainColor : "green"} secondColor={theme ? theme.textColor: "black"} text="Register" />
        </>
    return (
        <div className='nav-bar' style={{backgroundColor: theme ? theme.mainColor : "green", color: theme ? theme.textColor: "black"}}>
            <div className='nav-body'>
                <span className='left-content'>
                    <img src={`./resources/images/${theme.headImg}`} className='header-image' />
                    <span className='header-title-box'>
                        <span className='header-title'><h1 className='headline title-headline'>Bank of the Kingdom</h1></span>
                        <span className='header-title'>Trusted by Toads and Goombas</span>
                    </span>

                </span>
                <span className='right-content'>{navButtons}</span>
            </div>
        </div>
    )
}

export default Header;