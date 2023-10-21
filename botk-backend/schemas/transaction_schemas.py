from marshmallow import Schema, fields


class SubmitTransactionSchema(Schema):
    transaction_type = fields.Str(required=True)
    amount = fields.Float(required=True)


class TransactionsSchema(Schema):
    id = fields.Int(dump_only=True)
    transaction_type = fields.Str(required=True)
    amount = fields.Float(required=True)
    balance_after = fields.Float(required=True)
    date = fields.Date(required=True)
