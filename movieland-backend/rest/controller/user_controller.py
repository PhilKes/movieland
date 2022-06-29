from datetime import datetime

from flask import request
from flask_restx import Namespace, Resource

from db.database import DATETIME_FORMAT
from db.model import User, RoleName, users_schema
from logger import get_logger
from middleware import authenticated
from rest.service.role_service import RoleService
from rest.service.user_service import UserService

api = Namespace('user', path='/users', description='User')

log = get_logger()
service = UserService()
role_service = RoleService()


def fill_user_update(before_user: User, user: User):
    if user.password is not None:
        before_user.password = service.encrypt_password(user.password)
    if user.name is not None:
        before_user.name = user.name
    if user.username is not None:
        before_user.username = user.username
    if user.email is not None:
        before_user.email = user.email
    if user.roles is not None:
        before_user.roles.clear()
        for role in user.roles:
            db_role = role_service.get_role_by_name(role.name.name)
            before_user.roles.append(db_role)

    return before_user


@api.route("/me")
class UserMeController(Resource):

    @authenticated()
    def get(self, current_user: User):
        log.info(f"Querying current User '{current_user.username}'")
        return {"id": current_user.id, "username": current_user.username, "name": current_user.name}, 200

    @authenticated()
    def put(self, current_user: User):
        json_data = request.get_json(force=True)
        user = User()
        user.set_from_json(json_data)
        log.info(f"Updating current User '{current_user.username}'")
        before_user = service.get_user_by_id(current_user.id)
        before_user = fill_user_update(before_user, user)
        service.save_user(before_user, True)
        return "User updated", 200


@api.route("/<int:id>")
@api.param("id", "User identifier")
class UserController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def put(self, current_user: User, id: int):
        json_data = request.get_json(force=True)
        user = User()
        user.set_from_json(json_data)
        log.info(f"Updating User '{user.username}'")
        before_user = service.get_user_by_id(id)
        before_user = fill_user_update(before_user, user)
        service.save_user(before_user, True)
        return "User updated", 200

    @authenticated(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User, id: int):
        log.info(f"Deleting User by id='{id}'")
        service.delete_by_id(id)
        return f"User (id:{id}) deleted", 200


@api.route("/all")
class UsersAllController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User):
        log.info("Querying all Users")
        return users_schema.dump(service.get_all()), 200


@api.route("/users")
class UsersController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User):
        log.info("Querying all Users of Role USER")
        role = role_service.get_role_by_name(RoleName.ROLE_USER.name)
        return users_schema.dump(service.get_all_by_role(role)), 200


@api.route("/admins")
class UsersAdminsController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User):
        log.info("Querying all Users of Role ADMIN")
        role = role_service.get_role_by_name(RoleName.ROLE_ADMIN.name)
        return users_schema.dump(service.get_all_by_role(role)), 200


@api.route("/<string:username>")
@api.param("username", "Username of User")
class UsernameController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User, username: str):
        log.info(f"Querying UserProfile of User '{username}'")
        user = service.get_user_by_username(username)
        if user is None:
            return {"ressourceName": "User", "fieldName": "username", "fieldValue": username}, 404
        return {"id": user.id, "username": user.username, "name": user.name, "joinedAt": user.created_at.strftime(DATETIME_FORMAT)}
