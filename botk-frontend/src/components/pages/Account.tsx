import {Navigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";

import HoverButton from "../controls/HoverButton";
import TextInput from "../controls/TextInput";

import '../../Theming.css';
import '../../common.css';
import properties from '../../utility/data/application.json'
import {SetStateAction, useEffect, useRef, useState} from "react";


function Account() {
    const {accountId} = useParams();
    // variable for if the inputs to deposit or withdraw are visible
    const [dwHidden, setDwHidden] = useState(true);
    // variable for if the transaction is a deposit or withdraw
    const [dw, setDw] = useState('deposit');
    const [amount, setAmount] = useState(0);
    // variable to hold the transaction history
    const [transactions, setTransactions] = useState(null);
    const [account, setAccount] = useState(null);

    // @ts-ignore
    const token = useSelector(state => state.token);


    const dataFetch = useRef(false);

    useEffect(() => {
        // to prevent a second fetch request
        if (dataFetch.current)
            return;
        dataFetch.current = true;
                fetch(properties.url + `/account/${accountId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    setTransactions(data.transactions);
                    const a = data;
                    delete a.transactions;
                    setAccount(a);

                });

    }, []);

    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }

    let transactionData: JSX.Element = <></>;
    // @ts-ignore
    if(transactions === undefined || transactions === null || transactions.length === 0) {
        transactionData = (
            <div>
                This account does not have any transactions.
            </div>
        );
    } else {
        // @ts-ignore
        transactionData = Array.isArray(transactions) ? (<div>{transactions.map(transaction =>
                <TransactionDetails transaction={transaction} />
            )}
            </div>
        ) : <></>;
    }
    function updateDw(event: { target: { value: SetStateAction<string>; }; }) {
        setDw(event.target.value);
    }
    function updateAmount(event: { target: { value: SetStateAction<string>; }; }) {
        if (!isNaN(parseFloat(event.target.value as string))) {
            const newAmount = Number(event.target.value);
            setAmount(newAmount);
        }
    }

    //Event handler for the deposit / withdraw button
    function dwClicked() {
        if(!dw) {
            clearInputs();
        }
        setDwHidden((prevState: any) => {return !prevState;});
    }
    function cancelClicked() {
        setDwHidden(true);
        clearInputs();
    }
    function clearInputs() {
        setDw('deposit');
        setAmount(0);
    }
    function submitClicked() {
        // @ts-ignore
        if (amount > 0 && (dw === 'deposit' || (account !== null && amount < account.balance))) {
            const body = JSON.stringify({transaction_type: dw, amount: amount});
            fetch(properties.url + `/account/${accountId}/transaction`,
                {method: 'POST', body: body, headers: {
                    'Content-Type': 'application/json',
                    'Authorization':  `Bearer ${token}`
                    }}).then(response => {
                        return response.json();
            }).then(data => {
                console.log(data);
                // @ts-ignore
                setTransactions(prevState => {return [...prevState, data]});
            })
        }
    }

    return (
        <div className='main-color-bg '>
            <div className='wide-page'>
            <h1 className="headline">Account Information</h1>
            <div className='float-container'>

                <div className='main-column float-right'>
                    <HoverButton text="Deposit / Withdraw" baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button' clickAction={dwClicked} />
                    <div className={dwHidden ? 'hidden': ''}>
                        <select className='full-width line-space' onChange={updateDw} value={dw}>
                            <option value='deposit'>Deposit</option>
                            <option value='withdraw'>Withdraw</option>
                        </select>
                        <TextInput label="Amount" onChange={updateAmount} value={amount} type="number" className="line-space" />
                        <div className='line-space'>
                            <div className='half-button'>
                                <HoverButton text='Cancel' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button' clickAction={cancelClicked} />
                            </div>
                            <div className='half-button'>
                                <HoverButton text='Submit' baseClass='secondary-color-bg' hoverClass='secondary-color-text' className='full-button' clickAction={submitClicked} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='main-column float-right mobile-line'>
                    {transactionData}
                </div>
            </div>
            </div>
        </div>
    );
}

interface tdprops {
    transaction: {
        transaction_type: string,
        amount: number,
        balance_after: number,
        date: string
    },
    className?: string
}
function TransactionDetails(props: tdprops) {
    const transaction = props.transaction;
    return (
        <div className='float-container small-padding-horizontal border-bottom-secondary'>
            <div className='float-left text-left'>
                <div>{transaction.transaction_type}</div>
                <div>{transaction.date}</div>
            </div>
            <div className='float-right text-right'>
                <div>{transaction.transaction_type === 'deposit' ? '+' : '-'}{transaction.amount}</div>
                <div>{transaction.balance_after}</div>
            </div>
        </div>
    );
}

export default Account;