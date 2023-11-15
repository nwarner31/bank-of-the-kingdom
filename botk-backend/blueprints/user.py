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
from schemas.customer_schemas import CustomerSchema, LoginSchema, CustomerLoginSchema, UpdateCustomerSchema

blp = Blueprint('customers', "customers", description="customer paths")


@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginSchema)
    @blp.response(200, CustomerLoginSchema)
    def post(self, login_info):
        password_bytes = (login_info['password'] + properties.pepper).encode('utf-8')

        try:
            customer = CustomerModel.query.filter(CustomerModel.username == login_info['username']).first()
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
        password_bytes = (customer_data['password'] + properties.pepper).encode('utf-8')
        salt = bcrypt.gensalt()
        hash_password = bcrypt.hashpw(password_bytes, salt)
        customer_data['password'] = hash_password
        customer = CustomerModel(**customer_data)
        try:
            db.session.add(customer)
            db.session.commit()
        except IntegrityError:
            abort(499, {"message": "A user with that username already exists"})
        except SQLAlchemyError:
            abort(500, {"message": "An error occurred"})

        access_token = create_access_token(customer.id)
        cs = CustomerLoginSchema()
        cs.customer = customer
        cs.token = access_token
        return cs


@blp.route("/customer/<int:customer_id>")
class Customer(MethodView):
    @blp.response(200, CustomerSchema)
    @blp.arguments(UpdateCustomerSchema)
    @jwt_required()
    def put(self, customer_data, customer_id):
        try:
            customer_jwt_id = get_jwt()["sub"]
            if customer_jwt_id == customer_id:
                print(customer_data)
                customer = CustomerModel.query.filter(CustomerModel.id == customer_jwt_id).first()
                customer.first_name = customer_data["first_name"]
                customer.last_name = customer_data["last_name"]
                customer.address1 = customer_data["address1"]
                customer.address2 = customer_data["address2"]
                customer.city = customer_data["city"]
                customer.kingdom = customer_data["kingdom"]
                customer.email = customer_data["email"]
                db.session.add(customer)
                db.session.commit()
                print(customer)
                return customer
            else:
                pass
        except SQLAlchemyError:
            pass
