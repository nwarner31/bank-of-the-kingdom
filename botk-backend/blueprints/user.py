from MySQLdb import IntegrityError
from flask.views import MethodView
from flask_smorest import Blueprint
import bcrypt
from sqlalchemy.exc import SQLAlchemyError

import properties
from db import db

from flask import jsonify, abort

from flask_cors import cross_origin

from models import CustomerModel
from schemas.customer_schemas import CustomerSchema, LoginSchema

blp = Blueprint('customers', "customers", description="customer paths")


@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginSchema)
    @blp.response(200, CustomerSchema)
    def post(self, login_info):
        password_bytes = (login_info['password'] + properties.pepper).encode('utf-8')
        salt = bcrypt.gensalt()
        hash_password = bcrypt.hashpw(password_bytes, salt)
        try:
            customer = CustomerModel.query.filter(CustomerModel.username == login_info['username']).first()
            if customer and bcrypt.checkpw(password_bytes, customer.password.encode('utf-8')):
                return customer
            else:
                abort(400, {"message": "User credentials invalid"})

        except SQLAlchemyError:
            abort(500, {"message": "There was an error"})


@blp.route("/register")
class Register(MethodView):

    def get(self):
        print("Register get")
        return jsonify("Hello")

    @blp.arguments(CustomerSchema)
    @blp.response(200, CustomerSchema)
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
            abort(200, {"message": "An error occured"})

        print(customer)
        return customer
