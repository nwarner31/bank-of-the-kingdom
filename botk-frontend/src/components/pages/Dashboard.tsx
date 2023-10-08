import { useSelector } from "react-redux";
import {Link, Navigate} from "react-router-dom";

import HoverButton from "../controls/HoverButton";
import './Dashboard.css';
import '../../Theming.css';

function Dashboard() {
    // @ts-ignore
    const customer = useSelector(state => state.customer);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}  />);
    }
    return (
        <div className='main-color-bg'>
            <div className='dashboard-page'>
                <h1>Dashboard Page</h1>
                <div>{customer.first_name}</div>
                <div>
                    <div className='dashboard-section'>
                        Accounts
                    </div>
                    <div className='dashboard-section'>
                        Actions
                        <Link to='/create-account' className='dashboard-link'><HoverButton text='Create Account' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='dashboard-button' /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Dashboard;