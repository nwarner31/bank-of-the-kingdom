from db import db


class AccountModel(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String(60), nullable=False)
    account_type = db.Column(db.String(30), nullable=False)
    balance = db.Column(db.Float(precision=2), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)

    customer = db.relationship("CustomerModel", back_populates="accounts")
    transactions = db.relationship("TransactionModel", back_populates="account", lazy="dynamic")
