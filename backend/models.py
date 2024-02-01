from pydantic import BaseModel
from typing import Optional, Literal
from decimal import Decimal
from datetime import datetime

class Expense(BaseModel):
    name: str
    amount: float
    category: Literal["ESSEN", "FREIZEIT", "GESUNDHEIT", "KLEIDUNG", "TRANSPORT", "WOHNEN", "SONSTIGES"] = "SONSTIGES"
    date: Optional[datetime] = None

class Budget(BaseModel):
    budget: float

class ExpenseWithId(Expense):
    id: str

    def to_dynamodb_item(self, user_id: str):

        year = self.date.year
        month = self.date.month

        return {
            "PK": f"USER#{user_id}",
            "SK": f"EXPENSE#{self.id}",
            "EXPENSE_NAME": self.name,
            "EXPENSE_AMOUNT": Decimal(str(self.amount)),
            "EXPENSE_CATEGORY": self.category,
            "EXPENSE_DATE": Decimal(str(self.date.timestamp())),
            "EXPENSE_USER_DATE": f"{user_id}#{year}#{month}",
            "EXPENSE_USER_YEAR": f"{user_id}#{year}",
        }
    
    @classmethod
    def from_dynamodb_item(cls, item):
        return cls(id=item['SK'].split('#')[1], name=item['EXPENSE_NAME'], amount=float(item['EXPENSE_AMOUNT']), category=item['EXPENSE_CATEGORY'], date=datetime.fromtimestamp(int(item['EXPENSE_DATE'])))
