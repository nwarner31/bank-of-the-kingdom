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


from schemas.account_schemas import SimpleAccountSchema


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


class CustomerLoginSchema(Schema):
    customer = fields.Nested(CustomerAccountSchema)
    token = fields.Str()