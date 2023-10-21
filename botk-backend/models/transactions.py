from db import db


class TransactionModel(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    transaction_type = db.Column(db.String(35), nullable=False)
    amount = db.Column(db.Float(precision=2), nullable=False)
    balance_after = db.Column(db.Float(precision=2), nullable=False)
    date = db.Column(db.Date, nullable=False)

    account = db.relationship("AccountModel", back_populates="transactions")
