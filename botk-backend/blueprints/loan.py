from pymysql import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import jwt_required, get_jwt
from  sqlalchemy.exc import SQLAlchemyError

from schemas.loan_schemas import LoanSchema
from models.loans import LoanModel

from db import db


blp = Blueprint("loans", "loans", description="loan paths")

@blp.route("/loan")
class Loan(MethodView):
    @blp.response(200, LoanSchema)
    @blp.arguments(LoanSchema)
    @jwt_required()
    def post(self, loan_info):
        try:
            customer_id = get_jwt()["sub"]
            loan = LoanModel(**loan_info)
            loan.customer_id = customer_id
            loan.balance = loan_info["loan_amount"]
            loan.status = "Applied"
            db.session.add(loan)
            db.session.commit()
            return loan
        except SQLAlchemyError:
            return {"status_code": 500, "message": "There was an error"}