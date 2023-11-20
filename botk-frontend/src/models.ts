export interface Customer {
    id?: number,
    username: string,
    first_name: string,
    last_name: string,
    address1: string,
    address2?: string,
    city: string,
    kingdom: string,
    email: string
}

export interface Account {
    id?: number,
    account_type: string,
    account_name: string,
    balance: number
}

export interface Loan {
    id: number,
    loan_type: string,
    loan_name: string,
    loan_amount: number,
    balance: number,
    status: string
}

export interface Payment {
    id: number,
    date: string,
    amount: number,
    balance_after: number,
    note?: string,
    payment_from: number
}

export interface Transaction {
    id?: number,
    account_id: number,
    transaction_type: string,
    amount: number,
    balance_after?: number,
    date?: string
}

export interface Theme {
    mainColor: string,
    mainTextColor: string,
    secondaryColor: string,
    secondaryTextColor: string,
    headImg: string
}