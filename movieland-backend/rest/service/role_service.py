from db.model import Role
from logger import get_logger

log = get_logger()


class RoleService:

    def get_role_by_name(self, role_name: str) -> Role:
        return Role.query.filter_by(name=role_name).first()
