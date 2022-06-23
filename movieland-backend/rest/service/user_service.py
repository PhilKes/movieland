from db.database import db
from db.model import User
from logger import get_logger

log = get_logger()


class UserService:

    def get_user_by_username(self, username: str) -> User:
        return User.query.filter_by(username=username).first()

    def get_user_by_id(self, id: int) -> User:
        return User.query.filter_by(id=id).first()

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

    def login_user(self, username, password) -> User:
        return User.query.filter_by(username=username, password=password).first()
