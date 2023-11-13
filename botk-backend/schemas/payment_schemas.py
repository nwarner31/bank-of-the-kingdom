from marshmallow import Schema, fields


class PaymentSchema(Schema):
    id = fields.Int(dump_only=True)
    date = fields.Date(dump_only=True)
    amount = fields.Float(required=True)
    balance_after = fields.Float(dump_only=True)
    note = fields.String()
    payment_from = fields.Int(required=True)
