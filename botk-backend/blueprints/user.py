from pymysql import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
import bcrypt
from sqlalchemy.exc import SQLAlchemyError

import properties
from db import db

from flask import jsonify, abort

from flask_cors import cross_origin

from models.customers import CustomerModel
from models.blocklist import BLOCKLIST
from schemas.customer_schemas import CustomerSchema, LoginSchema, CustomerLoginSchema, LogoutSchema

blp = Blueprint('customers', "customers", description="customer paths")


@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginSchema)
    @blp.response(200, CustomerLoginSchema)
    def post(self, login_info):
        password_bytes = (login_info['password'] + properties.pepper).encode('utf-8')
        salt = bcrypt.gensalt()
        hash_password = bcrypt.hashpw(password_bytes, salt)
        print(login_info['username'])
        try:
            customer = CustomerModel.query.filter(CustomerModel.username == login_info['username']).first()
            print("Test")
            if customer and bcrypt.checkpw(password_bytes, customer.password.encode('utf-8')):

                access_token = create_access_token(customer.id)
                cs = CustomerLoginSchema()
                cs.customer = customer
                cs.token = access_token
                return cs
            else:
                abort(400, {"message": "User credentials invalid"})

        except SQLAlchemyError:
            abort(500, {"message": "There was an error"})
        except Exception as e:
            print(e)


@blp.route("/logout")
class Logout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        BLOCKLIST.add(jti)
        return {"message": "You have logged out"}


@blp.route("/register")
class Register(MethodView):

    @blp.arguments(CustomerSchema)
    @blp.response(200, CustomerLoginSchema)
    def post(self, customer_data):
        print(customer_data)
        password_bytes = (customer_data['password'] + properties.pepper).encode('utf-8')
        salt = bcrypt.gensalt()
        hash_password = bcrypt.hashpw(password_bytes, salt)
        print(f'hash 1: {hash_password}')
        print("Register")
        customer_data['password'] = hash_password
        customer = CustomerModel(**customer_data)
        try:
            db.session.add(customer)
            db.session.commit()
        except IntegrityError:
            abort(499, {"message": "A user with that username already exists"})
        except SQLAlchemyError:
            abort(500, {"message": "An error occurred"})

        print(customer)
        access_token = create_access_token(customer.id)
        cs = CustomerLoginSchema()
        cs.customer = customer
        cs.token = access_token
        return cs
