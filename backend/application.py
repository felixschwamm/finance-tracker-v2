from typing import Union, Optional, Literal
from jose import JWTError, jwt
from fastapi import FastAPI, Header, HTTPException, Depends, Query
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from loguru import logger
import boto3
import models
import uuid
from decimal import Decimal
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://192.168.178.146:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.add(level="TRACE", sink="logs/trace.log", rotation="1 week")


class Settings(BaseSettings):
    mode: Optional[Literal["development", "production"]] = "development"
    aws_access_key_id: str
    aws_access_key_secret: str

    class Config:
        env_file = ".env"

settings = Settings()

app.state.dynamodb = boto3.resource(
    "dynamodb",
    region_name="eu-central-1",
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_access_key_secret,
)
app.state.table = app.state.dynamodb.Table("finance-app")

logger.info(f"Running in {settings.mode} mode")

def create_user_if_not_exists(user_id: str):
    try:
        app.state.table.put_item(Item={
            "PK": f"USER#{user_id}",
            "SK": f"USER#{user_id}",
            "BUDGET": Decimal("1000")
        }, ConditionExpression="attribute_not_exists(PK) AND attribute_not_exists(SK)")
        logger.info(f"Created user {user_id}")
    except boto3.client('dynamodb').exceptions.ConditionalCheckFailedException:
        logger.trace(f"User {user_id} already exists")
        pass

def get_current_user_id(authorization: Optional[str] = Header(None)):

    if settings.mode == "development":
        create_user_if_not_exists("testUser")
        return "testUser"

    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token_prefix, _, token = authorization.partition(" ")
    if token_prefix.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid token prefix")

    try:
        # Assuming your JWT is encoded with an HS256 algorithm
        # You need to replace 'your_secret_key' with the actual key used to encode the JWT
        payload = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    create_user_if_not_exists(user_id)

    return user_id


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.put("/budget")
def set_budget(budget: models.Budget, user_id: str = Depends(get_current_user_id)):
    app.state.table.put_item(Item={
        "PK": f"USER#{user_id}",
        "SK": f"USER#{user_id}",
        "BUDGET": Decimal(str(budget.budget))
    })
    return {"success": True}

@app.get("/budget", response_model=models.Budget)
def get_budget(user_id: str = Depends(get_current_user_id)):
    response = app.state.table.get_item(Key={
        "PK": f"USER#{user_id}",
        "SK": f"USER#{user_id}",
    })
    return models.Budget(budget=float(response['Item']['BUDGET']))

@app.post('/expenses')
def create_expense(expense: models.Expense, user_id: str = Depends(get_current_user_id)):
    id = str(uuid.uuid4())
    if expense.date is None:
        expense.date = datetime.now()
    expense_with_id = models.ExpenseWithId(**expense.model_dump(), id=id)
    app.state.table.put_item(Item=expense_with_id.to_dynamodb_item(user_id))
    return expense_with_id

@app.delete('/expenses/{id}')
def delete_expense(id: str, user_id: str = Depends(get_current_user_id)):
    app.state.table.delete_item(Key={
        "PK": f"USER#{user_id}",
        "SK": f"EXPENSE#{id}",
    })
    return {"success": True}

@app.put('/expenses/{id}')
def update_expense(id: str, expense: models.Expense, user_id: str = Depends(get_current_user_id)):
    expense_with_id = models.ExpenseWithId(**expense.model_dump(), id=id)
    app.state.table.update_item(Key={
        "PK": f"USER#{user_id}",
        "SK": f"EXPENSE#{id}",
    }, UpdateExpression="SET EXPENSE_NAME = :name, EXPENSE_AMOUNT = :amount, EXPENSE_CATEGORY = :category", ExpressionAttributeValues={
        ":name": expense_with_id.name,
        ":amount": Decimal(str(expense_with_id.amount)),
        ":category": expense_with_id.category,
    })
    return expense_with_id

@app.get('/overview/{year}')
def get_overview(year: int, user_id: str = Depends(get_current_user_id)):
    response = app.state.table.query(
        KeyConditionExpression="EXPENSE_USER_YEAR = :exp_user_year",
        ExpressionAttributeValues={
            ":exp_user_year": f"{user_id}#{year}",
        },
        IndexName="EXPENSE_USER_YEAR-index", 
        ScanIndexForward=False,
    )

    # Parse the response into ExpenseWithId objects
    expenses = [models.ExpenseWithId.from_dynamodb_item(item) for item in response['Items']]

    # Hardcoded categories
    categories = ["ESSEN", "FREIZEIT", "GESUNDHEIT", "KLEIDUNG", "TRANSPORT", "WOHNEN", "SONSTIGES"]

    # Initialize a list to hold monthly expense summaries (12 months)
    monthly_expenses = [{category: 0 for category in categories} for _ in range(12)]

    # Aggregate expenses by month and category
    for expense in expenses:
        month_index = expense.date.month - 1  # month_index ranges from 0 to 11
        if expense.category in categories:
            monthly_expenses[month_index][expense.category] += expense.amount

    return monthly_expenses
    

@app.get('/expenses', response_model=list[models.ExpenseWithId])
def get_expenses(user_id: str = Depends(get_current_user_id), sort: Literal["NEWEST", "EXPENSIVE"] = "NEWEST", year: Optional[int] = None, month: Optional[int] = None):
    
    year = year or datetime.now().year
    month = month or datetime.now().month

    if sort == "NEWEST":
        query = {
            "KeyConditionExpression": "EXPENSE_USER_DATE = :exp_user_date",
            "ExpressionAttributeValues": {
                ":exp_user_date": f"{user_id}#{year}#{month}",
            },
            "IndexName": "EXPENSE_USER_DATE-EXPENSE_DATE-index",
            "ScanIndexForward": False,
        }
    else:
        query = {
            "KeyConditionExpression": "EXPENSE_USER_DATE = :exp_user_date",
            "ExpressionAttributeValues": {
                ":exp_user_date": f"{user_id}#{year}#{month}",
            },
            "IndexName": "EXPENSE_USER_DATE-EXPENSE_AMOUNT-index",
            "ScanIndexForward": False,
        }
    
    response = app.state.table.query(**query)
    return [models.ExpenseWithId.from_dynamodb_item(item) for item in response['Items']]

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}