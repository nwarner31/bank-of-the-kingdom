from flask.views import MethodView
from flask_smorest import Blueprint
from flask import abort
from flask_jwt_extended import get_jwt, jwt_required
from datetime import date

from models.accounts import AccountModel
from schemas.account_schemas import AccountTransactionsSchema, SimpleAccountSchema
from schemas.transaction_schemas import SubmitTransactionSchema, TransactionsSchema, TransferSchema
from sqlalchemy.exc import SQLAlchemyError
from models.transactions import TransactionModel
from db import db

blp = Blueprint('accounts', "accounts", description="account paths")


@blp.route("/account")
class Accounts(MethodView):
    # Commented out until determine if needed
    # @blp.response(200, SimpleAccountSchema(many=True))
    # @jwt_required()
    # def get(self):
    #     try:
    #         customer_id = get_jwt()['sub']
    #         accounts = AccountModel.query.filter(AccountModel.customer_id == customer_id).all()
    #         return accounts
    #
    #     except SQLAlchemyError:
    #         abort(500, {"message": "There was an error"})

    @blp.arguments(SimpleAccountSchema)
    @blp.response(200, SimpleAccountSchema)
    @jwt_required()
    def post(self, account_data):
        customer_id = get_jwt()['sub']
        account = AccountModel()
        account.account_type = account_data['account_type']
        account.account_name = account_data['account_name']
        account.balance = 0
        account.customer_id = customer_id
        try:
            db.session.add(account)
            db.session.commit()
            return account
        except SQLAlchemyError:
            abort(500, {"message": "An error occurred"})


@blp.route("/account/<int:account_id>")
class Account(MethodView):
    @jwt_required()
    @blp.response(200, AccountTransactionsSchema)
    def get(self, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()
            customer_id = get_jwt()['sub']
            if account.customer_id == customer_id:
                return account
            else:
                return {"message": "Account does not exist or you are unauthorized to view it"}
        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})


@blp.route("/account/<int:account_id>/transaction")
class AccountTransaction(MethodView):
    # @jwt_required()
    # @blp.response(200, TransactionsSchema(many=True))
    # def get(self, account_id):
    #     try:
    #         account = AccountModel.query.filter(AccountModel.id == account_id).first()
    #         customer_id = get_jwt()['sub']
    #         if account.customer_id == customer_id:
    #             transactions = TransactionModel.query.filter(TransactionModel.account_id == account_id).all()
    #             print(transactions)
    #             return transactions
    #         else:
    #             return {"message": "Account does not exist or you are unauthorized to view it"}
    #     except SQLAlchemyError:
    #         abort(500, {"message": "There was a server error"})

    @blp.arguments(SubmitTransactionSchema)
    @blp.response(200, TransactionsSchema)
    @jwt_required()
    def post(self, transaction_info, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()
            customer_id = get_jwt()['sub']
            if account and account.customer_id == customer_id:
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


@blp.route("/transfer")
class Transfer(MethodView):
    @blp.arguments(TransferSchema)
    @jwt_required()
    def post(self, transfer_info):
        try:
            customer_id = get_jwt()["sub"]
            to_account = AccountModel.query.filter(AccountModel.id == transfer_info["to_id"]).first()
            from_account = AccountModel.query.filter(AccountModel.id == transfer_info["from_id"]).first()
            # Check to make sure the logged in user owns both the accounts involved in the transfer
            if to_account.customer_id == customer_id and from_account.customer_id == customer_id:
                amount = transfer_info["amount"]
                # Check to make sure the from account has enough for the transfer
                if from_account.balance >= amount:
                    # From
                    from_transaction = TransactionModel()
                    from_transaction.account_id = from_account.id
                    from_transaction.transaction_type = "withdraw"
                    from_transaction.amount = amount
                    from_transaction.date = date.today()
                    from_after_balance = from_account.balance - amount
                    from_transaction.balance_after = from_after_balance
                    from_account.balance = from_after_balance
                    # To
                    to_transaction = TransactionModel()
                    to_transaction.account_id = to_account.id
                    to_transaction.transaction_type = "deposit"
                    to_transaction.amount = amount
                    to_transaction.date = date.today()
                    to_after_balance = to_account.balance + amount
                    to_transaction.balance_after = to_after_balance
                    to_account.balance = to_after_balance
                    # Commit all changes
                    db.session.add(from_transaction)
                    db.session.add(from_account)
                    db.session.add(to_transaction)
                    db.session.add(to_account)
                    db.session.commit()
                    return {"status_code": 200, "message": "Transfer complete"}
                else:
                    return {"status_code": 400, "message": "Insufficient funds"}
            else:
                return {"status_code": 400, "message": "Account does not exist or you do not have permission"}
        except SQLAlchemyError:
            return {"status_code": 500, "message": "There was a server error"}
