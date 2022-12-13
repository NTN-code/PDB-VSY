from functools import wraps

from fastapi import FastAPI, Depends, UploadFile, Body, File, Form
from fastapi.middleware.cors import CORSMiddleware
from jinja2 import Environment
from sqladmin import ModelView, Admin
from sqladmin.authentication import AuthenticationBackend
from sqlalchemy.orm import Session
from starlette.requests import Request
from starlette.responses import Response, RedirectResponse

from app.dto import RegisterUser, LoginUser, CreateComment, MakeOrder
from app.handlers.passmaker import make_pass
from app.orm.orm import DBSession, create_user, get_user_by_email, get_category_model, \
    get_product_models_by_category, get_product_model_by_id, engine, Users, Products, Comments, OrderDetails, Orders, \
    Categories, edit_product_model_by_id, get_category_model_by_id, edit_category_model_by_id, create_product_model, \
    get_comment_models, get_comment_by_id, get_user_by_id, delete_user_by_id, create_comment_model, create_order_model, \
    create_orderdetails_model, edit_amount_product, get_category_models, get_product_model_by_name, get_order_by_id, \
    change_order_status, get_orderdetail_by_order_id, get_order_models_by_user_id_wait_payment, \
    change_status_to_payment, get_user_orders

APP_TOKEN = """MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCL7MfqkxBD2FxBA3PCK/mw5Ajw8lv
/IKIwUn6Pjzj7ZeRwVg7fBIK29OuNEfx1pQYggqp53ipuBrNfDGX7K8RybeUf2OXF6mEn7jCygAJBEtWbBD0kUmKPAfrAP40xB
+Lp5bZ1tsmBkM8zsTaTlbK2ItuH5EtNMmKa6f/M96RaqQIDAQAB"""

ADMIN_TOKEN = "a939c8163588bd764e860c8ad9e9c68d7d8cc9c42cc65a276d60194a0c44b768"


class MyBackend(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        session = DBSession()

        db_user = get_user_by_email(session, username)
        password_user = make_pass(password)

        if db_user.password == password_user and db_user.role == 1:
            request.session.update({"admin_token": ADMIN_TOKEN})
            return True

        return False

    async def logout(self, request: Request) -> bool:
        # Usually you'd want to just clear the session
        del request.session["admin_token"]
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("admin_token")

        if token and token == ADMIN_TOKEN:
            return True

        return False



app = FastAPI()
admin = Admin(app, engine, authentication_backend=MyBackend(secret_key=ADMIN_TOKEN))


class UsersAdmin(ModelView, model=Users):
    column_list = [Users.id, Users.name, Users.surname, Users.email]
    icon = "fa-sharp fa-solid fa-user"


class ProductsAdmin(ModelView, model=Products):
    column_list = [Products.id, Products.name]
    icon = "fa-sharp fa-solid fa-cart-flatbed"
    details_template = "details_image_product.html"
    edit_template = "edit_image_product.html"
    create_template = "create_product.html"


class CommentsAdmin(ModelView, model=Comments):
    column_list = [Comments.id, Comments.user_id]
    icon = "fa-sharp fa-solid fa-comments"


class OrderDetailsAdmin(ModelView, model=OrderDetails):
    column_list = [OrderDetails.id, OrderDetails.order_id, OrderDetails.product_id]
    icon = "fa-sharp fa-solid fa-briefcase"


class OrdersAdmin(ModelView, model=Orders):
    column_list = [Orders.id, Orders.user_id, Orders.created_at]
    icon = "fa-sharp fa-solid fa-dollar"


class CategoriesAdmin(ModelView, model=Categories):
    column_list = [Categories.id, Categories.name]
    icon = "fa-sharp fa-solid fa-box"
    details_template = "details_image_category.html"
    edit_template = "edit_image_category.html"


admin.add_view(UsersAdmin)
admin.add_view(ProductsAdmin)
admin.add_view(CategoriesAdmin)
admin.add_view(CommentsAdmin)
admin.add_view(OrderDetailsAdmin)
admin.add_view(OrdersAdmin)


origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def get_db():
    db = DBSession()
    try:
        yield db
    finally:
        db.close()


def auth_required(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # TODO
        return await func(*args, **kwargs)
    return wrapper


def only_admin(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # TODO
        print("only for admin")
        return await func(*args, **kwargs)
    return wrapper


def convert_model_to_dict(model) -> dict:
    dict_model = {column: str(getattr(model, column)) for column in model.__table__.c.keys()}
    return dict_model


@app.post("/register", status_code=201)
async def register(data: RegisterUser, db: Session = Depends(get_db)):
    user = create_user(db, data)
    # return RedirectResponse("http://localhost:3000/login")


@app.post("/login", status_code=200)
async def login(data: LoginUser, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, data.email)
    password_user = make_pass(data.password)
    if db_user.password == password_user:
        dict_model = convert_model_to_dict(db_user)
        dict_model["api_token"] = APP_TOKEN
        return dict_model
    return Response(status_code=400)


@app.get("/")
@auth_required
async def read_root(request: Request):
    return "Working!"


@app.get("/categories")
@auth_required
async def get_categories(request: Request, db: Session = Depends(get_db)):
    categories = get_category_models(db)
    response = []
    for category in categories:
        data = {}
        data['id'] = category.id
        data['name'] = category.name
        response.append(data)
    return response


@app.get("/categoryimage", )
@auth_required
async def get_category_image(request: Request, category_id: int, db: Session = Depends(get_db)):
    category = get_category_model_by_id(db, category_id)
    return Response(content=category.image, media_type="image/jpg")


@app.get("/category")
@auth_required
async def get_category(request: Request, category_id: int, db: Session = Depends(get_db)):
    category = get_category_model_by_id(db, category_id)
    dict_category = convert_model_to_dict(category)
    return dict_category


@app.post("/category", status_code=200)
@auth_required
async def edit_category(request: Request, category_id: int, name: str = Form(), image: UploadFile = File(None),         db: Session = Depends(get_db)
):
    bytes_image = await image.read()
    edit_category_model_by_id(db, category_id, name, bytes_image)
    return RedirectResponse("http://localhost:8000/admin")


@app.get("/products")
@auth_required
async def get_products(request: Request, category_name: str, db: Session = Depends(get_db)):
    products = get_product_models_by_category(db, category_name)
    dict_products = []
    for p in products:
        p = convert_model_to_dict(p)
        del p["image"]
        dict_products.append(p)
    return dict_products


@app.get("/product")
@auth_required
async def get_product(request: Request, product_id: int, db: Session = Depends(get_db)):
    product = get_product_model_by_id(db, product_id)
    dict_product = convert_model_to_dict(product)
    del dict_product["image"]
    return dict_product


@app.get("/productimage")
@auth_required
async def get_product_image(request: Request, product_id: int, db: Session = Depends(get_db)):
    product = get_product_model_by_id(db, product_id)
    return Response(content=product.image, media_type="image/jpg")


@app.post("/product", status_code=200)
@only_admin
async def edit_product(
        request: Request,
        product_id: int,
        name: str|None = Form(),
        weight: float|None = Form(),
        description: str|None = Form(),
        stock: int|None = Form(),
        price: float|None = Form(),
        image: UploadFile = File(None),
        db: Session = Depends(get_db)
):
    data = {
        "name":name,
        "weight": weight,
        "description": description,
        "stock": stock,
        "price": price
    }
    if image:
        image = await image.read()
    edit_product_model_by_id(db, product_id, data, image)
    return RedirectResponse("http://localhost:8000/admin")


@app.post("/productcreate", status_code=200)
@only_admin
async def create_product(
        request: Request,
        name: str = Form(),
        weight: float = Form(),
        description: str = Form(),
        stock: int = Form(),
        price: float = Form(),
        image: UploadFile = File(None),
        db: Session = Depends(get_db)
):
    data = {
        "name": name,
        "weight": weight,
        "description": description,
        "stock": stock,
        "price": price
    }
    if image:
        image = await image.read()
    product = create_product_model(db, data, image)
    return RedirectResponse("http://localhost:8000/admin")


@app.get("/comment", status_code=200)
@auth_required
async def get_comments(request: Request, product_id: int, db: Session = Depends(get_db)):
    comments = get_comment_models(db, product_id)
    data = []
    for comment in comments:
        data.append(convert_model_to_dict(comment))
    return data


@app.delete("/comment", status_code=200)
@auth_required
async def delete_comment(request: Request, comment_id: int, email=Form(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    comment = get_comment_by_id(db, comment_id)
    user_comment = get_user_by_id(db, comment.user_id)

    if user.id == user_comment.id:
        delete_user_by_id(db, user.id)
    else:
        return Response(status_code=405, content="Not have permissions")


@app.post("/comment", status_code=201)
@auth_required
async def create_comment(request: Request, data: CreateComment, db: Session = Depends(get_db)):
    comment = create_comment_model(db, data)
    return comment


@app.post("/makeorder", status_code=200)
@auth_required
async def make_order(request: Request, data: MakeOrder, db: Session = Depends(get_db)):
    product = get_product_model_by_name(db, data.product_name)

    if(product.stock < data.amount_order):
        return Response(status_code=400, content=f"Sorry, but we have only {product.stock} {product.name}")

    order = create_order_model(db, data)
    order_detail = create_orderdetails_model(db, order_id=order.id, product_id=product.id)
    edit_amount_product(db, product.id, data.amount_order)

    change_order_status(db, order.id)

    response = {
        "order": convert_model_to_dict(order),
        "order_detail": convert_model_to_dict(order_detail),
        "product": convert_model_to_dict(product)
    }
    return response


@app.get('/orderspay')
@auth_required
async def get_orders_user_to_pay(request: Request, user_id: int, db: Session = Depends(get_db)):
    response = []
    orders = get_order_models_by_user_id_wait_payment(db, user_id)
    for order in orders:
        response_ord = {}
        order_dict = convert_model_to_dict(order)
        # del order_dict['image']
        response_ord['order'] = order_dict
        ordersdetails = get_orderdetail_by_order_id(db, order.id)
        product = get_product_model_by_id(db, ordersdetails.product_id)
        product_dict = convert_model_to_dict(product)
        del product_dict['image']
        response_ord['product'] = product_dict
        response.append(response_ord)
    return response


@app.post('/makepayment', status_code=200)
@auth_required
async def make_payment(request: Request, orders_ids=Body(), db: Session = Depends(get_db)):
    change_status_to_payment(db, orders_ids['idsForPay'])


@app.get('/myorders', status_code=200)
@auth_required
async def get_my_orders(request: Request, id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, id)
    orders = get_user_orders(db, user.id)
    response = []
    for order in orders:
        data = {}

        dict_order = convert_model_to_dict(order)
        data.update(dict_order)

        ordersdetails = get_orderdetail_by_order_id(db, order.id)
        product = get_product_model_by_id(db, ordersdetails.product_id)

        data.update({'product_name': product.name, 'price': product.price})

        response.append(data)
    return response


@app.get('/comments')
@auth_required
async def get_comments(request: Request, db: Session = Depends(get_db)):
    comments = get_comment_models(db)

    response = []

    for comment in comments:
        product = get_product_model_by_id(db, comment.product_id)
        user = get_user_by_id(db, comment.user_id)
        data = {
            'username': user.name + user.surname,
            'product': product.name,
            'text': comment.text,
        }
        response.append(data)
    return response