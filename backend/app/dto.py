from fastapi import Form
from pydantic import BaseModel, EmailStr, PositiveInt, PositiveFloat


class RegisterUser(BaseModel):
    name: str
    surname: str
    email: EmailStr
    country: str
    city: str
    address: str
    phone: str
    password: str


class LoginUser(BaseModel):
    email: EmailStr
    password: str


class CreateComment(BaseModel):
    text: str
    user_id: int
    product_id: int


class MakeOrder(BaseModel):
    amount_order: int
    user_id: int
    product_name: str


