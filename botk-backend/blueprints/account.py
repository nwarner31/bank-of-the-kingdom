from flask.views import MethodView
from flask_smorest import Blueprint
from flask import abort
from flask_jwt_extended import get_jwt, jwt_required
from datetime import date

from models.accounts import AccountModel
from schemas.account_schemas import CreateAccountSchema, AccountTransactionsSchema
from schemas.transaction_schemas import SubmitTransactionSchema, TransactionsSchema
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import update
from models.transactions import TransactionModel
from db import db

blp = Blueprint('accounts', "accounts", description="account paths")


@blp.route("/account")
class Accounts(MethodView):

    @blp.arguments(CreateAccountSchema)
    @jwt_required()
    def post(self, account_data):
        customer_id = get_jwt()['sub']
        print(customer_id)
        print(account_data)
        account = AccountModel()
        account.account_type = account_data['account_type']
        account.account_name = account_data['account_name']
        account.balance = 0
        account.customer_id = customer_id
        try:
            db.session.add(account)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, {"message": "An error occurred"})
        return {"message": "Got it"}


@blp.route("/account/<int:account_id>")
class Account(MethodView):
    @jwt_required()
    @blp.response(200, AccountTransactionsSchema)
    def get(self, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()
            customer_id = get_jwt()['sub']
            if account.customer_id == customer_id:
                print(account.account_type)
                return account
            else:
                return {"message": "Account does not exist or you are unauthorized to view it"}
        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})


@blp.route("/account/<int:account_id>/transaction")
class AccountTransaction(MethodView):
    @jwt_required()
    @blp.response(200, TransactionsSchema(many=True))
    def get(self, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()
            customer_id = get_jwt()['sub']
            if account.customer_id == customer_id:
                # transactions = account.transactions.all()
                transactions = TransactionModel.query.filter(TransactionModel.account_id == account_id).all()
                print(transactions)
                return transactions
            else:
                return {"message": "Account does not exist or you are unauthorized to view it"}
        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})

    @blp.arguments(SubmitTransactionSchema)
    @blp.response(200, TransactionsSchema)
    @jwt_required()
    def post(self, transaction_info, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()
            customer_id = get_jwt()['sub']
            if account.customer_id == customer_id:
                transaction = TransactionModel()
                transaction.account_id = account_id
                transaction.amount = transaction_info['amount']
                transaction.date = date.today()
                if transaction_info['transaction_type'] == 'deposit':
                    transaction.transaction_type = 'deposit'
                    new_balance = account.balance + transaction_info['amount']
                    transaction.balance_after = new_balance
                    account.balance = new_balance
                elif transaction_info['transaction_type'] == 'withdraw':
                    # If attempting to withdraw more than is in the account
                    if transaction_info['amount'] > account.balance:
                        abort(400, {"message": "Not enough in account to withdraw"})
                    else:
                        new_balance = account.balance - transaction_info['amount']
                        transaction.transaction_type = 'withdraw'
                        transaction.balance_after = new_balance
                        account.balance = new_balance

                else:
                    abort(400, {"message": "Unsupported transaction type"})
                db.session.add(transaction)
                db.session.add(account)
                db.session.commit()
                return transaction
            else:
                return {"message": "Account does not exist or you are unauthorized to view it"}
        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})
