from flask.views import MethodView
from flask_smorest import Blueprint


blp = Blueprint('accounts', "accounts", description="account paths")


@blp.route("/account")
class Accounts(MethodView):
    def get(self):
        pass

    def post(self):
        pass
