from db.database import db, ma


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=False, index=True)
    username = db.Column(db.String(256), unique=True, index=False)
    email = db.Column(db.String(256), nullable=True)
    password = db.Column(db.String(100), nullable=False)
    roles = db.relationship('Role', secondary='UserRole', lazy=False)

    def set_from_json(self, json):
        self.id = json['id'] if 'id' in json else None
        self.name = json['name'] if 'name' in json else None
        self.username = json['username'] if 'username' in json else None
        self.email = json['email'] if 'email' in json else None
        # TODO encode password
        self.password = json['password'] if 'password' in json else None


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True


user_schema = UserSchema()
users_schema = UserSchema(many=True)
