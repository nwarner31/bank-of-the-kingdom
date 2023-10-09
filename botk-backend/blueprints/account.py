from flask.views import MethodView
from flask_smorest import Blueprint
from flask import abort
from flask_jwt_extended import get_jwt, jwt_required

from models.accounts import AccountModel
from schemas.account_schemas import CreateAccountSchema
from sqlalchemy.exc import SQLAlchemyError
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
            abort(500, {"message": "An error occured"})
        return {"message": "Got it"}


@blp.route("/account/<int:account_id>")
class Account(MethodView):
    def get(self, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()

        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})

        return {"message": "Test"}
