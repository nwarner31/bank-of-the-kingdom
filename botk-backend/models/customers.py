from db import db


class CustomerModel(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)
    address1 = db.Column(db.String(80), nullable=False)
    address2 = db.Column(db.String(80))
    city = db.Column(db.String(60), nullable=False)
    kingdom = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(60), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)


