from sqlalchemy import  ForeignKey

from db.database import db

UserRole = db.Table('UserRole',
                    db.Column('user_id', db.Integer, ForeignKey('user.id'), primary_key=True),
                    db.Column('role_id', db.Integer, ForeignKey('role.id'), primary_key=True)
                    )
