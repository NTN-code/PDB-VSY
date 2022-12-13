import datetime
import re

from sqlalchemy import Column, Integer, String, create_engine, DateTime, Float, \
    Text, LargeBinary, ForeignKey, CheckConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from app.dto import RegisterUser, CreateComment, MakeOrder
from app.handlers.passmaker import make_pass

regex_email = re.compile("\w+@\w+\.\w+")
regex_phone = re.compile("\+[0-9]{12}")

Base = declarative_base()

# TODO INDEX


class Categories(Base):
    __tablename__ = "categories"
    __table_args__ = (
        CheckConstraint('length(name)>0', name="categories_name_gt_0"),
    )
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    image = Column(LargeBinary, nullable=False)


class Users(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint('length(name)>0', name="users_name_gt_0"),
        CheckConstraint('length(surname)>0', name="users_surname_gt_0"),
    )
    id = Column(Integer, primary_key=True)
    email = Column(String(50), nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    name = Column(String(30), nullable=False)
    surname = Column(String(30), nullable=False)
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    address = Column(String(120), nullable=True)
    phone = Column(String(30), unique=True, nullable=False, index=True)
    role = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow(), nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow(),
        onupdate=datetime.datetime.utcnow()
    )
    deleted_at = Column(DateTime, default=None, nullable=True)


class Products(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint('weight>0', name="products_weight_gt_0"),
        CheckConstraint('stock>-1', name="products_stock_nature_or_0"),
        CheckConstraint('price>0', name="products_price_gt_0"),
    )
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    weight = Column(Float)
    description = Column(Text, nullable=True)
    image = Column(LargeBinary)
    stock = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    category_id = Column(Integer, ForeignKey('categories.id'))


class Orders(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint('amount>0', name="orders_amount_gt_0"),
    )
    id = Column(Integer, primary_key=True)
    status = Column(String, default="OPENED")
    amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow())

    user_id = Column(Integer, ForeignKey('users.id'))


class Comments(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id'))
    product_id = Column(Integer, ForeignKey('products.id'))


class OrderDetails(Base):
    __tablename__ = "orderdetails"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))


# PRIMARY
engine = create_engine(
    "postgresql+psycopg2://postgres:1111@127.0.0.1:5432/vsy",
    echo=True
)

# REPLICA
# engine = create_engine(
#     "postgresql+psycopg2://repluser:12345678@localhost/vsy",
#     echo=True
# )

if __name__ == '__main__':

    Base.metadata.create_all(engine)

    # Base.metadata.drop_all(engine)


DBSession = sessionmaker(bind=engine)


def create_user(session: Session, data: RegisterUser) -> Users:
    user_data = dict(data)

    password = make_pass(user_data["password"])

    user = Users(**user_data)
    user.password = password

    session.add(user)
    session.commit()

    return user


def get_user_by_email(session: Session, email: str) -> Users:
    return session.query(Users).filter(Users.email == email).first()


def get_user_by_phone(session: Session, phone: str) -> Users:
    return session.query(Users).filter(Users.phone == phone).first()


def get_category_model(session: Session, category_name: str) -> list[Categories]:
    return session.query(Categories).filter(Categories.name == category_name).first()


def get_category_models(session: Session) -> list[Categories]:
    return session.query(Categories).all()


def get_product_models_by_category(session: Session, category_name: str) -> list[Products]:
    category = get_category_model(session, category_name)
    products = session.query(Products).filter(Products.category_id == category.id).all()
    return products


def get_product_model_by_id(session: Session, id: int) -> Products:
    return session.query(Products).filter(Products.id == id).first()


def edit_product_model_by_id(session: Session, id: int, data={}, image=None):
    product = session.query(Products).get(id)
    if data.get("name"):
        product.name = data.get("name")
    if data.get("weight"):
        product.weight = data["weight"]
    if data.get("description"):
        product.description = data["description"]
    if data.get("stock"):
        product.stock = data["stock"]
    if data.get("price"):
        product.price = data["price"]
    if image:
        product.image = image
    session.commit()


def create_product_model(session: Session, data={}, image=None):
    product = Products(image=image, **data)
    session.add(product)
    session.commit()
    return product


def get_category_model_by_id(session: Session, id: int) -> Categories:
    return session.query(Categories).filter(Categories.id == id).first()


def edit_category_model_by_id(session: Session, id: int, name: str | None, image=None):
    category = get_category_model_by_id(session, id)
    if name:
         category.name = name
    if image:
        category.image = image
    session.commit()


def get_comment_models(session: Session, product_id: int):
    products = session.query(Comments).filter(Comments.product_id == product_id).all()
    return products


def get_comment_by_id(session: Session, comment_id: int):
    return session.query(Comments).filter(Comments.id == comment_id).first()


def get_user_by_id(session: Session, user_id: int):
    return session.query(Users).filter(Users.id == user_id).first()


def delete_user_by_id(session: Session, user_id: int):
    session.query(Users).filter(Users.id == user_id).delete()


def create_comment_model(session: Session, data: CreateComment):
    comment = Comments(
        text=data.text,
        user_id=data.user_id,
        product_id=data.product_id
    )
    session.add(comment)
    session.commit()
    return comment


def create_order_model(session: Session, data: MakeOrder):
    order = Orders(
        status="OPENED",
        amount=data.amount_order,
        user_id=data.user_id
    )
    session.add(order)
    session.commit()
    return order


def create_orderdetails_model(session: Session, order_id: int, product_id: int):
    orderdetail = OrderDetails(order_id=order_id, product_id=product_id)
    session.add(orderdetail)
    session.commit()
    return orderdetail


def edit_amount_product(session: Session,  product_id: int, order_amount:int):
    product = session.query(Products).filter(Products.id == product_id).first()
    product.stock -= order_amount
    session.commit()


def get_product_model_by_name(session: Session, product_name: str):
    product = session.query(Products).filter(Products.name == product_name).first()
    return product


def get_order_by_id(session: Session, order_id: int):
    order = session.query(Orders).filter(Orders.id == order_id).first()
    return order


def change_order_status(session: Session, order_id: int):
    order = get_order_by_id(session, order_id=order_id)
    order.status = 'WAIT_PAYMENT'
    session.commit()
    return order


def get_order_models_by_user_id_wait_payment(session: Session, user_id: int):
    orders = session.query(Orders).filter(Orders.user_id == user_id, Orders.status == "WAIT_PAYMENT").all()
    return orders


def get_orderdetail_by_order_id(session: Session, order_id: int):
    orderdetail = session.query(OrderDetails).filter(OrderDetails.order_id == order_id).first()
    return orderdetail


def get_orders_by_ids(sessions: Session, order_ids: int):
    orders = sessions.query(Orders).filter(Orders.id.in_(order_ids)).all()
    return orders


def change_status_to_payment(session: Session, orders_ids: list[int]):
    orders = get_orders_by_ids(session, orders_ids)
    for order in orders:
        order.status = 'PAYMENT'
        session.commit()


def get_user_orders(sessions: Session, user_id: int):
    orders = sessions.query(Orders).filter(Orders.user_id == user_id).all()
    return orders


def get_comment_models(sessions: Session):
    comments = sessions.query(Comments).order_by(Comments.id.desc()).limit(100).all()
    return comments
