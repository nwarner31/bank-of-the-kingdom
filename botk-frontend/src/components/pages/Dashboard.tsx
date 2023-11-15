import { useSelector } from "react-redux";
import {Link, Navigate} from "react-router-dom";

import HoverButton from "../controls/HoverButton";
import './Dashboard.css';
import '../../Theming.css';

function Dashboard() {
    // @ts-ignore
    const customer = useSelector(state => state.customer);
    // @ts-ignore
    const accounts = useSelector(state => state.accounts);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);

    // @ts-ignore
    const loans = useSelector(state => state.loans);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }
    let accountData: JSX.Element = <></>;
    const accountGroups: any = {};
    if (accounts.length === 0) {
        accountData = <h3>You do not have any accounts.</h3>;
    } else {
        // Organizes accounts based upon account type
        accounts.forEach((account: { account_type: string; }) => {
            if (account.account_type in accountGroups) {
                // @ts-ignore
                accountGroups[account.account_type].push(account)
            } else {
                // @ts-ignore
                accountGroups[account.account_type] = [account];
            }
        });
        // Displays the accounts grouped by account type
        // @ts-ignore
        accountData = <div>{Object.keys(accountGroups).map(type =>
            <div key={type}><h3>{type}</h3>
                {accountGroups[type].map((account: any) => <Link to={`/account/${account.id}`} key={account.id}><AccountDetails account={account} className='secondary-color-bg' /></Link>)}
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
                        <h2>Accounts</h2>
                        {accountData}
                        {loans.length > 0 &&
                        <div>
                            <h3>Loans</h3>
                            {loans.map((loan: { id: number; loan_type: string; loan_name: string; loan_amount: number; balance: number; status: string; }) => <Link to={`/loan/${loan.id}`} key={loan.id}><LoanDetails  loan={loan} className='secondary-color-bg' /></Link>)}
                        </div>}
                    </div>
                    <div className='dashboard-section'>
                        Actions
                        <Link to='/create-account' className='dashboard-link'>
                            <HoverButton text='Create Account' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='dashboard-button' />
                        </Link>
                        {accounts.length > 1 && <Link to='/transfer' className='dashboard-link'>
                            <HoverButton text='Transfer' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='dashboard-button' />
                        </Link>}
                        <Link to='/apply-loan' className='dashboard-link'>
                            <HoverButton text='Apply for a Loan' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='dashboard-button' />
                        </Link>
                        <Link to='/update-customer' className='dashboard-link'>
                            <HoverButton text='Update Customer Information' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='dashboard-button' />
                        </Link>
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
     className?: string
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

interface ldprops {
    loan: {
        id: number,
        loan_type: string,
        loan_name: string,
        loan_amount: number,
        balance: number,
        status: string
    },
    className?: string
}

function LoanDetails (props: ldprops) {
    return (
        <div className={"float-container display-tile clickable " + props.className ?? ""}>
            <div className="float-left">
                <div className="minor-header">{props.loan.loan_name}</div>
                <div>{props.loan.loan_type}</div>
            </div>
            <div className="float-right">
                <div>{props.loan.balance}</div>
                <div>{props.loan.status}</div>
            </div>
        </div>
    );
}

export default Dashboard;