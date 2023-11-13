from marshmallow import Schema, fields

from schemas.customer_schemas import CustomerSchema
from schemas.transaction_schemas import TransactionsSchema


class CreateAccountSchema(Schema):
    account_type = fields.Str(required=True)
    account_name = fields.Str(required=True)


class SimpleAccountSchema(Schema):
    id = fields.Int(required=True)
    account_type = fields.Str(required=True)
    account_name = fields.Str(required=True)
    balance = fields.Float()


class AccountSchema(Schema):
    id = fields.Int(dump_only=True)
    account_type = fields.Str(required=True)
    account_name = fields.Str()
    balance = fields.Float()
    customer = fields.Nested(CustomerSchema)


class AccountTransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    account_id = fields.Int()
    type = fields.Str(required=True)
    amount = fields.Float()


class AccountTransactionsSchema(Schema):
    id = fields.Int(dump_only=True)
    account_type = fields.Str(required=True)
    account_name = fields.Str()
    balance = fields.Float()
    transactions = fields.Nested(TransactionsSchema(), many=True)
