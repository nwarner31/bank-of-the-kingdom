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
        return (<Navigate to='/' replace={true}/>);
    }
    let accountData: JSX.Element = <></>;
    console.log(customer);
    const accountGroups: any = {};
    if (customer && customer.accounts.length === 0) {
        accountData = <h3>You do not have any accounts.</h3>;
    } else {
        // Organizes accounts based upon account type
        customer.accounts.forEach((account: { account_type: string; }) => {
            if (account.account_type in accountGroups) {
                // @ts-ignore
                accountGroups[account.account_type].push(account)
            } else {
                // @ts-ignore
                accountGroups[account.account_type] = [account];
            }
            console.log(accountGroups);

        });
        // Displays the accounts grouped by account type
        // @ts-ignore
        accountData = <div>{Object.keys(accountGroups).map(type =>
            <div><h3>{type}</h3>
                {accountGroups[type].map((account: any) => <AccountDetails account={account} className='secondary-color-bg' />)}
            </div>)}
            </div>;
    }
    return (
        <div className='main-color-bg'>
            <div className='dashboard-page'>
                <h1>Dashboard Page</h1>
                <div>{customer.first_name}</div>
                <div className="dashboard-main">
                    <div className='dashboard-section'>
                        Accounts
                        {accountData}
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

 interface adprops {
    account: {
        id: number,
        account_type: string,
        account_name: string,
        balance: number},
     className: string | null
 }
function AccountDetails(props: adprops) {
    return (
        <div className={"account-details " + props.className ?? ''}>
            <div className="ad-name">{props.account.account_name}</div>
            <div className="ad-bar">
                <div className="ad-info">{props.account.id}</div>
                <div className="ad-info">{props.account.balance}</div>
            </div>
        </div>
    );
}

export default Dashboard;