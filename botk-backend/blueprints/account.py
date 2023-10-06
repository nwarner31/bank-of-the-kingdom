from flask.views import MethodView
from flask_smorest import Blueprint
from flask import abort
from flask_jwt_extended import get_jwt, jwt_required

from models.accounts import AccountModel
from schemas.account_schemas import CreateAccountSchema
from sqlalchemy.exc import SQLAlchemyError

blp = Blueprint('accounts', "accounts", description="account paths")


@jwt_required
@blp.route("/account")
class Accounts(MethodView):
    def get(self):
        pass

    @blp.arguments(CreateAccountSchema)
    def post(self, account_data):
        jti = get_jwt()['jti']


@blp.route("/account/<int:account_id>")
class Account(MethodView):
    def get(self, account_id):
        try:
            account = AccountModel.query.filter(AccountModel.id == account_id).first()

        except SQLAlchemyError:
            abort(500, {"message": "There was a server error"})