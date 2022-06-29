from flask_marshmallow import fields
from sqlalchemy import func

from db.database import db, ma
from db.model import Role, RoleName


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=False, index=True)
    username = db.Column(db.String(256), unique=True, index=False)
    email = db.Column(db.String(256), nullable=True)
    password = db.Column(db.String(256), nullable=False)
    roles = db.relationship('Role', secondary='UserRole', lazy=False)
    created_at = db.Column(db.TIMESTAMP, server_default=func.now())
    updated_by = db.Column(db.TIMESTAMP, server_default=func.now(), onupdate=func.current_timestamp())

    def set_from_json(self, json):
        self.id = json['id'] if 'id' in json else None
        self.name = json['name'] if 'name' in json else None
        self.username = json['username'] if 'username' in json else None
        self.email = json['email'] if 'email' in json else None
        self.password = json['password'] if 'password' in json else None
        if 'roles' in json:
            self.roles = list(map(lambda role_json: Role(role_json['id'], RoleName[role_json['name']]), json['roles']))


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True

    roles = fields.fields.Method('get_roles')

    def get_roles(self, obj: User):
        return list(map(lambda role: {"id": role.id, "name": role.name.name}, obj.roles))


user_schema = UserSchema()
users_schema = UserSchema(many=True)
