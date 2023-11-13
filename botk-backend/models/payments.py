from db import db


class PaymentModel(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float(precision=2), nullable=False)
    balance_after = db.Column(db.Float(precision=2), nullable=False)
    note = db.Column(db.String(35))
    loan_id = db.Column(db.Integer, db.ForeignKey("loans.id"), nullable=False)
    payment_from = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)

    loan = db.relationship("LoanModel", back_populates="payments")
    payment_account = db.relationship("AccountModel")

    def __str__(self):
        return (f"id: {self.id}\ndate: {self.date}\namount: {self.amount}\nbalance after: {self.balance_after}\nnote: {self.note}"
                f"\nloan id: {self.loan_id}\npayment from: {self.payment_from}")