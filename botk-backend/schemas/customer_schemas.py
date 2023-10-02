from marshmallow import Schema, fields


class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class LogoutSchema(Schema):
    token = fields.Str()

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


class CustomerLoginSchema(Schema):
    customer = fields.Nested(CustomerSchema)
    token = fields.Str()