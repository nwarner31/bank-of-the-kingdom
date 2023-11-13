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
    payments = db.relationship("PaymentModel", back_populates="loan", lazy="dynamic")

    def __str__(self):
        return (f"id: {self.id}\nloan type: {self.loan_type}\nloan name: {self.loan_name}\nloan amount: {self.loan_amount}"
                f"\nbalance: {self.balance}\nstatus: {self.status}\ncustomer income: {self.customer_income}\ncustomer credit score:"
                f" {self.customer_credit_score}\ncustomer id: {self.customer_id}")