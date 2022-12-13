import hashlib

HASHING_KEY = "6ADSFDSFSADYFSFSADFS6DHFGGHGFF76769S6G897FD687"


def make_pass(plain_password: str) -> str:
    return hashlib.sha256(HASHING_KEY.encode() + plain_password.encode()).hexdigest()


def compare_password(user_password: str, db_password: str) -> bool:
    return user_password == db_password
