from typing import List

from werkzeug.security import generate_password_hash, check_password_hash

from db.database import db
from db.model import User, Role
from logger import get_logger

log = get_logger()


class UserService:

    def get_user_by_username(self, username: str) -> User:
        return User.query.filter_by(username=username).first()

    def get_user_by_id(self, id: int) -> User:
        return User.query.filter_by(id=id).first()

    def get_all(self) -> List[User]:
        return User.query.all()

    def get_all_by_role(self, role: Role) -> List[User]:
        return User.query.filter(User.roles.contains(role)).all()

    def save_user(self, user: User, update: bool = False):
        if not update and self.get_user_by_id(user.id) is not None:
            msg = f"User id='{user.id}' already exists!"
            log.warn(msg)
            raise FileExistsError(msg)
        if update:
            db.session.merge(user)
        else:
            log.info(f"Registering new User '{user.username}'")
            db.session.add(user)
        db.session.commit()
        return user

    def login_user(self, username: str, password: str) -> User:
        user = User.query.filter_by(username=username).first()
        if user is None or not check_password_hash(user.password, password):
            return None
        return user

    def encrypt_password(self, password: str) -> str:
        return generate_password_hash(password)

    def delete_by_id(self, id: int):
        User.query.filter_by(id=id).delete()
