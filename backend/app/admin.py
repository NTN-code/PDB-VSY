from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app.handlers.passmaker import make_pass
from app.main import app
from app.orm.orm import engine, Users, get_user_by_email, DBSession, Products

ADMIN_TOKEN = "a939c8163588bd764e860c8ad9e9c68d7d8cc9c42cc65a276d60194a0c44b768"

admin = Admin(app, engine, authentication_backend=MyBackend())


class MyBackend(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        session = DBSession()


        request.session.update({"token": "..."})

        db_user = get_user_by_email(session, username)
        password_user = make_pass(password)

        if db_user.password == password_user:
            request.session.update({"admin_token":ADMIN_TOKEN})
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


class UsersAdmin(ModelView, model=Users):
    column_list = [Users.id, Users.name, Users.surname, Users.email]
    icon = "fa-sharp fa-solid fa-user"


class ProductsAdmin(ModelView, model=Products):
    column_list = [Products.id, Products.name]
    icon = "fa-sharp fa-solid fa-loveseat"


admin.add_view(UsersAdmin)
admin.add_view(ProductsAdmin)
