import datetime
import json
import random

from faker import Faker

fake = Faker(['en_US'])
MAX_RANGE = 1000000
datetime_end = datetime.datetime.now()
datetime_start = datetime_end - datetime.timedelta(days=365)


def make_users():
    with open('users.json', 'w') as f:
        f.write("[\n")
        for i in range(0, 500000):
            f.write(json.dumps({
                'email': fake.unique.email(),
                'password': fake.password(),
                'name': fake.first_name(),
                'surname': fake.last_name(),
                'country': fake.country(),
                'city': fake.city(),
                'address': fake.address().replace("\n", ""),
                'phone': fake.unique.phone_number(),
                'role': 0,
                'created_at': fake.date_time_between_dates(
                    datetime_start=datetime_start,
                    datetime_end=datetime_end,
                ).isoformat(),
                'updated_at': fake.date_time_between_dates(
                    datetime_start=datetime_end,
                    datetime_end=datetime_end,
                ).isoformat()
            }) + f'{"" if i == 500000 - 1 else ","}' + "\n")
        f.write("]")


def make_comments():
    with open('comments.json', 'w') as f:
        f.write("[\n")
        for i in range(0, 3000):
            f.write(json.dumps({
                'text': fake.text().replace("\n", ""),
                'user_id': fake.random_int(min=1, max=500000),
                'product_id': fake.random_int(min=1, max=24)
            }) + f'{"" if i == 3000 - 1 else ","}' + "\n")
        f.write("]")


def make_category():
    furniture = ['armchairs', 'beds', 'chairs', 'desks', 'dressers', 'mattress', 'sofas', 'wardrobes']
    with open('categories.json', 'w') as f:
        f.write("[\n")

        for fur in furniture:
            with open(f'./categories_images/{fur}.jpg', 'rb') as image:
                b = image.read()
                data = bytes(b).hex()
                f.write(json.dumps({
                    'name': fur,
                    'image': data
                }) + f'{"" if "wardrobes" == fur else ","}' + "\n")
        f.write("]")


def make_product():
    products = {
        "Armchair Vitio": ["vitio", 1],
        "Armchair Tilar": ["tilar", 1],
        "Armchair Bons-T": ["bonst", 1],
        "Bed Empire Luxor": ["bedimperiya", 2],
        "Bed Verona": ["verona", 2],
        "Bed Eliza": ["eliza", 2],
        "Char London": ["london", 3],
        "Char DCA": ["dca", 3],
        "Char S109": ["s109", 3],
        "Desk Transformer Elit": ["transformer_elit", 4],
        "Desk Porto": ["porto", 4],
        "Desk Marsel": ["marsel", 4],
        "Dresser Keln": ["keln", 5],
        "Dresser Stefani": ["stefani", 5],
        "Dresser Style": ["style", 5],
        "Matters Hard": ["matt_hard", 6],
        "Matters Active": ["matt_active", 6],
        "Matters Memory": ["matt_memory", 6],
        "Sofa Nikoletti": ["sofasnikoletti", 7],
        "Sofa Palermo": ["palermopr", 7],
        "Sofa Manhattan": ["sofamanhattan", 7],
        "Wardrobe Hordik": ["hordik", 8],
        "Wardrobe Loren": ["loren", 8],
        "Wardrobe Ferran": ["ferran", 8],

    }
    with open('products.json', 'w') as f:
        f.write("[\n")
        for title, info in products.items():
            with open(f'./products_images/{info[0]}.jpg', 'rb') as image:
                b = image.read()
                data = bytes(b).hex()

                f.write(json.dumps({
                    'name': title,
                    'weight': fake.random_int(min=1, max=50),
                    "description": fake.text().replace("\n", ""),
                    'image': data,
                    "stock": fake.random_int(min=10000, max=100000),
                    "price": fake.random_int(min=100, max=1000),
                    "category_id": info[1]
                }) + f'{"" if "ferran" == info[0] else ","}' + "\n")
        f.write("]")


def make_orders():
    with open('orders.json', 'w') as f:
        f.write("[\n")
        status = ["OPENED", "WAIT_PAYMENT", "PAYMENT", "DELIVER", "CLOSED"]
        for i in range(0, 100000):
            current_status = random.choice(status)
            f.write(json.dumps({
                'status': current_status,
                'amount': fake.random_int(min=1, max=3),
                "created_at": fake.date_time_between_dates(
                    datetime_start=datetime_end,
                    datetime_end=datetime_end,
                ).isoformat(),
                'user_id': fake.random_int(min=1, max=100000),
            }) + f'{"" if i == 99999 else ","}' + "\n")
        f.write("]")


def make_orderdetails():
    with open('orderdetails.json', 'w') as f:
        f.write("[\n")
        for i in range(1, 100001):
            f.write(json.dumps({
                'order_id': i,
                'product_id': fake.random_int(min=1, max=24)
            }) + f'{"" if i == 100000 else ","}' + "\n")
        f.write("]")


if __name__ == '__main__':
    # make_users()
    # make_category()
    # make_comments()
    # make_product()
    make_orders()
    make_orderdetails()
