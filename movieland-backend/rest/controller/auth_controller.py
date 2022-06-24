import jwt
from flask import request, current_app
from flask_restx import Namespace, Resource

from db.model import User, RoleName
from logger import get_logger
from middleware import authenticated
from rest.service.role_service import RoleService
from rest.service.user_service import UserService

api = Namespace('auth', path='/auth', description='Authentication')

log = get_logger()
service = UserService()
role_service = RoleService()


@api.route("/signup")
class SignUpController(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        return sign_up_user(json_data)


@api.route("/admin/signup")
class SignUpController(Resource):

    # @authenticated(RoleName.ROLE_ADMIN)
    def post(self):
        json_data = request.get_json(force=True)
        return sign_up_user(json_data)


def sign_up_user(json):
    if service.get_user_by_username(json['username']) is not None:
        return {"message": "Username is already taken!", "success": False}, 400
    user = User()
    user.set_from_json(json)
    user.password = service.encrypt_password(user.password)
    if 'roleName' in json:
        user.roles = [role_service.get_role_by_name(RoleName.ROLE_USER.name),
                      role_service.get_role_by_name(json['roleName'])]
    else:
        user.roles = [role_service.get_role_by_name(RoleName.ROLE_USER.name)]
    try:
        service.save_user(user)
    except FileExistsError as err:
        log.error(err)
        return {"msg": str(err)}, 409
    return {"message": "User registered successfully", "succes": True}, 201


@api.route("/signin")
class SignInController(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        try:
            user = service.login_user(
                json_data["usernameOrEmail"],
                json_data["password"]
            )
            if user:
                try:
                    # token should expire after 24 hrs
                    token = jwt.encode(
                        {"user_id": user.id,
                         "authorities": list(map(lambda role: {"authority": role.name.name}, user.roles))},
                        current_app.config["SECRET_KEY"],
                        algorithm="HS256"
                    )
                    return {
                               "tokenType": "Bearer",
                               "accessToken": token
                           }, 200
                except Exception as e:
                    return {
                               "error": "Something went wrong",
                               "message": str(e)
                           }, 500
            return {
                       "message": "Error fetching auth token!, invalid email or password",
                       "data": None,
                       "error": "Unauthorized"
                   }, 404
        except Exception as e:
            return {
                       "message": "Something went wrong!",
                       "error": str(e),
                       "data": None
                   }, 500


@api.route("/signout")
class SignOutController(Resource):

    @authenticated()
    def post(self, current_user: User):
        return f"User {current_user.username} logged out", 200
