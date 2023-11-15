from marshmallow import Schema, fields


class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class CustomerSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    address1 = fields.Str(required=True)
    address2 = fields.Str()
    city = fields.Str(required=True)
    kingdom = fields.Str(required=True)
    email = fields.Str(required=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class UpdateCustomerSchema(Schema):
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    address1 = fields.Str(required=True)
    address2 = fields.Str()
    city = fields.Str(required=True)
    kingdom = fields.Str(required=True)
    email = fields.Str(required=True)
    username = fields.Str()


from schemas.account_schemas import SimpleAccountSchema
from schemas.loan_schemas import LoanSchema


class CustomerAccountSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    address1 = fields.Str(required=True)
    address2 = fields.Str()
    city = fields.Str(required=True)
    kingdom = fields.Str(required=True)
    email = fields.Str(required=True)
    username = fields.Str(required=True)
    accounts = fields.List(fields.Nested(SimpleAccountSchema()), dump_only=True)
    loans = fields.List(fields.Nested(LoanSchema()), dump_only=True)


class CustomerLoginSchema(Schema):
    customer = fields.Nested(CustomerAccountSchema())
    token = fields.Str()
