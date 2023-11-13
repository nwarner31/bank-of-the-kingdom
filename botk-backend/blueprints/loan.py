from pymysql import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required, get_jwt
from  sqlalchemy.exc import SQLAlchemyError
from datetime import date

from schemas.loan_schemas import LoanSchema, LoanPaymentSchema
from models.loans import LoanModel
from models.accounts import AccountModel
from models.transactions import TransactionModel
from schemas.payment_schemas import PaymentSchema
from models.payments import PaymentModel

from db import db


blp = Blueprint("loans", "loans", description="loan paths")


@blp.route("/loan")
class Loans(MethodView):
    @blp.response(200, LoanSchema)
    @blp.arguments(LoanSchema)
    @jwt_required()
    def post(self, loan_info):
        try:
            customer_id = get_jwt()["sub"]
            loan = LoanModel(**loan_info)
            loan.customer_id = customer_id
            loan.balance = loan_info["loan_amount"]
            loan.status = "applied"
            db.session.add(loan)
            db.session.commit()
            return loan
        except SQLAlchemyError:
            return {"status_code": 500, "message": "There was an error"}


@blp.route("/loan/<int:loan_id>")
class Loan(MethodView):
    @blp.response(200, LoanPaymentSchema)
    @jwt_required()
    def get(self, loan_id):
        try:
            loan = LoanModel.query.filter(LoanModel.id == loan_id).first()
            customer_id = get_jwt()["sub"]
            if loan and loan.customer_id == customer_id:
                return loan
            else:
                return {"status_code": 400, "message": "Loan does not exist or you are not authorized to view it"}
        except SQLAlchemyError:
            return {"status_code": 500, "message": "There was a server error"}


@blp.route("/loan/<int:loan_id>/payment")
class LoanPayment(MethodView):
    @blp.response(200, PaymentSchema)
    @blp.arguments(PaymentSchema)
    @jwt_required()
    def post(self, payment_info, loan_id):
        try:
            loan = LoanModel.query.filter(LoanModel.id == loan_id).first()
            account = AccountModel.query.filter(AccountModel.id == payment_info["payment_from"]).first()
            customer_id = get_jwt()["sub"]
            if loan and loan.customer_id == customer_id and account and account.customer_id == customer_id:
                if account.balance < payment_info["amount"]:
                    pass
                else:
                    payment = PaymentModel(**payment_info)
                    payment.date = date.today()
                    balance_after_loan = loan.balance - payment_info["amount"]
                    payment.balance_after = balance_after_loan
                    payment.loan_id = loan_id
                    loan.balance = balance_after_loan
                    balance_after_account = account.balance - payment_info["amount"]
                    account.balance = balance_after_account
                    account_transaction = TransactionModel()
                    account_transaction.account_id = account.id
                    account_transaction.transaction_type = "withdraw"
                    account_transaction.amount = payment_info["amount"]
                    account_transaction.balance_after = balance_after_account
                    account_transaction.date = date.today()
                    db.session.add(payment)
                    db.session.add(loan)
                    db.session.add(account)
                    db.session.add(account_transaction)
                    db.session.commit()

                    return payment
            else:
                return {"status_code": 400, "message": "Loan and/ or account does not exist or you are not authorized to view it"}
        except SQLAlchemyError:
            return {"status_code": 500, "message": "There was a server error"}
        except Exception as e:
            print(e)
            return {"status_code": 500, "message": "Exception"}
