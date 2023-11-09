from db import db


class LoanModel(db.Model):
    __tablename__ = "loans"
    id = db.Column(db.Integer, primary_key=True)
    loan_type = db.Column(db.String(35), nullable=False)
    loan_name = db.Column(db.String(45), nullable=False)
    loan_amount = db.Column(db.Float(precision=2), nullable=False)
    balance = db.Column(db.Float(precision=2), nullable=False)
    status = db.Column(db.String(25), nullable=False)
    customer_income = db.Column(db.Integer, nullable=False)
    customer_credit_score = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False)

    customer = db.relationship("CustomerModel", back_populates="loans")
