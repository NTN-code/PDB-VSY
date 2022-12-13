from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.orm.orm import Products

engine = create_engine(
    "postgresql+psycopg2://postgres:1111@127.0.0.1:5432/vsy",
    echo=True
)


Session = sessionmaker(bind = engine)


def main():
    session = Session()
    product = session.query(Products).filter(Products.id == 1).first()
    with open('NewImage.jpg', 'wb') as img:
        img.write(product.image)

    print("Hello World!")



if __name__ == '__main__':
    main()