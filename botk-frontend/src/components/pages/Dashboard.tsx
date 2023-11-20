import { useSelector } from "react-redux";
import {Link, Navigate} from "react-router-dom";

import HoverButton from "../controls/HoverButton";
import {ReduxState} from "../../store/my-data-store";
import {Account} from "../../models";
import '../../Theming.css';
import '../../common.css';

function Dashboard() {

    const customer = useSelector((state: ReduxState) => state.customer);
    const accounts = useSelector((state: ReduxState) => state.accounts);
    const loggedIn = useSelector((state: ReduxState) => state.loggedIn);
    const loans = useSelector((state: ReduxState) => state.loans);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }
    let accountData: JSX.Element = <></>;
    const accountGroups: { [type: string]: Account[] } = {};
    if (accounts.length === 0) {
        accountData = <h3>You do not have any accounts.</h3>;
    } else {
        // Organizes accounts based upon account type
        accounts.forEach((account: Account) => {
            if (account.account_type in accountGroups) {
                accountGroups[account.account_type].push(account)
            } else {
                accountGroups[account.account_type] = [account];
            }
        });
        // Displays the accounts grouped by account type
        accountData = <div>{Object.keys(accountGroups).map(type =>
            <div key={type}><h3>{type}</h3>
                {accountGroups[type].map((account: any) => <Link to={`/account/${account.id}`} key={account.id}><AccountDetails account={account} className='secondary-color-bg small-vertical-spacing' /></Link>)}
            </div>)}
            </div>;
    }
    return (
        <div className='main-color-bg'>
            <div className='wide-page'>
                <h1 className="headline">Dashboard Page</h1>
                <div>{customer?.first_name}</div>
                <div className="float-container">
                    <div className='float-left main-column'>
                        <h2>Accounts</h2>
                        {accountData}
                        {loans.length > 0 &&
                        <div>
                            <h3>Loans</h3>
                            {loans.map((loan: { id: number; loan_type: string; loan_name: string; loan_amount: number; balance: number; status: string; }) => <Link to={`/loan/${loan.id}`} key={loan.id}><LoanDetails  loan={loan} className='secondary-color-bg small-vertical-spacing' /></Link>)}
                        </div>}
                    </div>
                    <div className='float-left main-column'>
                        Actions
                        <Link to='/create-account' className='text-plain'>
                            <HoverButton text='Create Account' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button small-vertical-spacing' />
                        </Link>
                        {accounts.length > 1 && <Link to='/transfer' className='text-plain'>
                            <HoverButton text='Transfer' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button small-vertical-spacing' />
                        </Link>}
                        <Link to='/apply-loan' className='text-plain'>
                            <HoverButton text='Apply for a Loan' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button small-vertical-spacing' />
                        </Link>
                        <Link to='/update-customer' className='text-plain'>
                            <HoverButton text='Update Customer Information' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button small-vertical-spacing' />
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
        <div className={"small-padding-horizontal full-button secondary-color-bg small-vertical-spacing"}>
            <div className="minor-header text-left">{props.account.account_name}</div>
            <div className="line-space float-container">
                <div className="float-left">Account #: {props.account.id}</div>
                <div className="float-right">{props.account.balance}</div>
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
        <div className={"small-padding-horizontal full-button secondary-color-bg small-vertical-spacing float-container"}>
            <div className="float-left text-left">
                <div className="minor-header">{props.loan.loan_name}</div>
                <div className="line-space">Type: {props.loan.loan_type}</div>
            </div>
            <div className="float-right">
                <div>Balance: {props.loan.balance}</div>
                <div className="line-space">Status: {props.loan.status}</div>
            </div>
        </div>
    );
}

export default Dashboard;