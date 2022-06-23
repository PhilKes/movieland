# Source:
# https://www.loginradius.com/blog/engineering/guest-post/securing-flask-api-with-jwt/


from functools import wraps
import jwt
from flask import request, abort
from flask import current_app

from db.model import RoleName
from rest.service.user_service import UserService


def authenticated(rolename: RoleName = None):
    """
    Decorator to check if HTTP Request includes Bearer Token for User Authentication
    :param rolename Optionally check if authenticated User has Role
    """
    def authenticated_wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]
            if not token:
                return {
                           "message": "Authentication Token is missing!",
                           "data": None,
                           "error": "Unauthorized"
                       }, 401
            try:
                data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
                current_user = UserService().get_user_by_id(data["user_id"])
                if current_user is None:
                    return {
                               "message": "Invalid Authentication token!",
                               "data": None,
                               "error": "Unauthorized"
                           }, 401
                if rolename is not None and rolename not in list(map(lambda role: role.name, current_user.roles)):
                    abort(403)
                # if not current_user["active"]:
                #     abort(403)
            except Exception as e:
                return {
                           "message": "Something went wrong",
                           "data": None,
                           "error": str(e)
                       }, 500

            return f(args[0], current_user, *(args[1:]), **kwargs)

        return decorated

    return authenticated_wrapper
