import {Account} from "../../models";
import {ChangeEvent, InputHTMLAttributes} from "react";
import '../../common.css';

interface asprops extends InputHTMLAttributes<HTMLSelectElement>{
    label: string,
    accounts: Account[],
    updateValue: ((ewValue: number, name?: string) => void) | ((newValue: number) => void)
}

function AccountSelect({label, accounts, updateValue, className, ...rest}: asprops) {
    function setValue(e: ChangeEvent<HTMLSelectElement>) {
        const newValue = Number(e.target.value);
        updateValue(newValue, rest.name);

    }
    return (
        <div className={className}>
            <div>
                {label}:
            </div>
            <div>
                <select onChange={setValue} {...rest} className="full-width">
                    <option value={-1} >Select an account</option>
                        {accounts.map((account: Account) => <option key={account.id} value={account.id}>{account.id}: {account.account_name} - {account.account_type} (Balance: {account.balance})</option>
                    )}
                </select>
            </div>
        </div>
    );
}

export default AccountSelect;