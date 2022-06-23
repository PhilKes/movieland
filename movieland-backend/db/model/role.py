from enum import Enum

from marshmallow_enum import EnumField
from sqlalchemy import event

from db.database import db, ma


class RoleName(Enum):
    ROLE_USER = 1,
    ROLE_ADMIN = 2,
    ROLE_CASHIER = 3


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Enum(RoleName))

    def __init__(self, id: int, name: RoleName):
        self.id = id
        self.name = name


class RoleSchema(ma.SQLAlchemyAutoSchema):
    name = EnumField(RoleName)

    class Meta:
        model = Role
        include_fk = True


role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
