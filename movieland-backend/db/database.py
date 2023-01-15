from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import insert
from werkzeug.security import generate_password_hash


DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'
DATE_FORMAT = '%Y-%m-%d'

db = SQLAlchemy()
ma = Marshmallow()


def check_initial_data():
    if len(Role.query.all()) == 0:
        for role_name in RoleName:
            role = Role(role_name.value, role_name)
            db.session.add(role)

            insert_stmt = insert('role').values(
                id=role_name.value,
                name=role_name,
            )
            db.session.execute(insert_stmt)
        db.session.commit()

        role_admin = Role.query.filter_by(id=2)
        role_user = Role.query.filter_by(id=1)
        user = User()
        user.id = 2
        user.name = "admin"
        user.email = "admin@admin.de"
        user.password = generate_password_hash("admin123")
        user.roles.append(role_admin)
        db.session.add(user)
        user = User()
        user.id = 3
        user.name = "user"
        user.email = "user@user.de"
        user.password = generate_password_hash("user123")
        user.roles.append(role_user)
        db.session.add(user)

        insert_stmt = insert('').values(
            id='xxx',
            col1='insert value',
        )
        db.session.execute(on_duplicate_key_stmt)
        db.session.commit()

    db.session.commit()
