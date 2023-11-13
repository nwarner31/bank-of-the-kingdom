import {useSelector, useDispatch} from "react-redux";
import {Navigate, useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useRef, useState} from "react";

import HoverButton from "../controls/HoverButton";
import TextInput from "../controls/TextInput";
import AccountSelect from "../controls/AccountSelect";
import properties from "../../utility/data/application.json";
import {ReduxState} from "../../store/my-data-store";
import {Loan as LoanModel, Payment, Account} from '../../models';
import {Actions} from '../../store/my-data-store';
import '../../common.css';
import '../../Theming.css';


function Loan() {
    const {loanId} = useParams();
    const token = useSelector((state: ReduxState) => state.token);
    const accounts = useSelector((state: ReduxState) => state.accounts);
    const dispatch = useDispatch();

    const [loan, setLoan] = useState<LoanModel | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const dataFetch = useRef(false);

    const [payment_from, setPaymentFrom] = useState<number>(-1);
    const [amount, setAmount] = useState<string>("");
    const [amountError, setAmountError] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");
    const [paymentHidden, setPaymentHidden] = useState<boolean>(true)

    useEffect(() => {
        // to prevent a second fetch request
        if (dataFetch.current)
            return;
        dataFetch.current = true;
        fetch(properties.url + `/loan/${loanId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            setPayments(data.payments);
            const l = data;
            delete l.payments;
            setLoan(l);
        });

    }, []);
    const loggedIn = useSelector((state: ReduxState) => state.loggedIn);
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}/>);
    }

    function updatePaymentFrom(newPaymentFrom: number) {
        setPaymentFrom(newPaymentFrom);
    }

    function updateAmount (event: ChangeEvent<HTMLInputElement>) {
        setAmount(event.target.value);
    }
    function updateNote(event: ChangeEvent<HTMLInputElement>) {
        setNote(event.target.value);
    }

    function cancelClicked() {
        setPaymentHidden(true);
        setAmount("");
        setNote("");
        setPaymentFrom(-1);
        setAmountError(false);
    }

    function submitPayment() {

        const accountIndex = accounts.findIndex((a: Account) => a.id === payment_from)


        if(validateFields()) {
            const paymentAccount = {...accounts[accountIndex]};
            const numAmount = Number(amount);
            if (numAmount <= paymentAccount.balance) {
                const body = JSON.stringify({payment_from, amount: numAmount, note: note === "" ? undefined : note});
                fetch(properties.url + `/loan/${loanId}/payment`, {method: "POST", body,
                    headers: {"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`}}).then(response => {
                        console.log(response);
                        return response.json()}).then(data => {
                            console.log(data);
                            if (data.id) {
                                setPayments(prevState => {return [...prevState, data]});
                                loan!.balance -= numAmount;
                                dispatch({type: Actions.UpdateLoan, payload: data});
                                paymentAccount.balance -= numAmount;
                                dispatch({type: Actions.UpdateAccounts, payload: {accounts: [paymentAccount]}})
                            }

                });
            }
        }
    }

    function validateFields(): boolean {
        let isValid = true;
        if (payment_from === -1) {
            isValid = false;
            // ToDo - add error for selects
        }
        if(isNaN(Number(amount)) || amount === "" || Number(amount) < 0) {
            setAmountError(true);
            setAmount("");
            isValid = false;
        }
        return isValid;
    }

    return (
        <div className="main-color-bg">
            <div className="wide-page float-container">

                    <div className="float-right main-column">
                        <div>
                            {loan &&
                                <div>
                                    <h4>{loan.loan_name}</h4>
                                    <div className="float-container">
                                        <div className="wp-sub-column">
                                            <div>{loan.loan_type}</div>
                                            <div>{loan.status}</div>
                                        </div>
                                        <div className="wp-sub-column">
                                            <div>Loan Amount: {loan.loan_amount}</div>
                                            <div>Current Balance: {loan.balance}</div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {loan && loan.status === "approved" &&
                                <div>
                                    <HoverButton text="Make a Payment" className="full-button" baseClass="secondary-color-bg" hoverClass="secondary-color-text" clickAction={() => setPaymentHidden(prevState => {return !prevState})} />
                                    <div className={paymentHidden ? "hidden" : ""}>
                                        <AccountSelect label="Payment From" accounts={accounts} value={payment_from} updateValue={updatePaymentFrom} />
                                        <TextInput label="Amount:" name="amount" value={amount} type="text" hasError={amountError} onChange={updateAmount} clearError={() => setAmountError(false)} />
                                        <TextInput label="Note:" name="note" value={note} type="text" onChange={updateNote}  />
                                        <HoverButton text="Cancel" baseClass="secondary-color-bg" hoverClass="secondary-color-text" clickAction={cancelClicked} className="smaller-button" />
                                        <HoverButton text="Submit Payment" baseClass="secondary-color-bg" hoverClass="secondary-color-text" clickAction={submitPayment} className="smaller-button" />
                                    </div>
                                </div>}

                        </div>
                    </div>
                    <div className="float-left main-column">
                        {payments.map(payment => <PaymentDetails key={payment.id} payment={payment} />) }
                    </div>
            </div>
        </div>
    );
}

interface pdprops {
    payment: Payment
}

function PaymentDetails(props: pdprops) {
    const payment = props.payment;
    return (
        <div className="float-container border-bottom-secondary">
            <div className="float-left">
                <div>Payment from account #: {payment.payment_from}</div>
                <div>{payment.date}</div>
                <div>Note: {payment.note}</div>
            </div>
            <div className="float-right">
                <div>-{payment.amount}</div>
                <div>{payment.balance_after}</div>
            </div>
        </div>
    );
}

export default Loan;