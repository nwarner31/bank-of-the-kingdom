from marshmallow import Schema, fields


class LoanSchema(Schema):
    id = fields.Int(dump_only=True)
    loan_type = fields.Str(required=True)
    loan_name = fields.Str(required=True)
    loan_amount = fields.Float(required=True)
    balance = fields.Float()
    status = fields.Str()
    customer_income = fields.Int(load_only=True)
    customer_credit_score = fields.Int(load_only=True)