from marshmallow import Schema, fields

from schemas.customer_schemas import CustomerSchema


class SimpleAccount(Schema):
    id = fields.Int(required=True)
    account_type = fields.Str()


class Account(Schema):
    id = fields.Int(dump_only=True)
    account_type = fields.Str(required=True)
    balance = fields.Float()
    customer = fields.Nested(CustomerSchema)

