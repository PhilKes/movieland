import datetime

from db.database import db, ma


class Movie(db.Model):
    movId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=True, index=True)
    date = db.Column(db.Date, nullable=True)
    description = db.Column(db.String(256), nullable=True)
    posterUrl = db.Column(db.String(1024), nullable=True)
    length = db.Column(db.Integer, nullable=True)
    tmdbId = db.Column(db.Integer, nullable=True)
    shows = db.relationship('MovieShow', backref='movie', lazy=True)

    def __init__(self, movId: int = None, name: str = None, date: datetime.date = None, description: str = None):
        self.movId = movId
        self.name = name
        self.date = date
        self.description = description

    def set_from_json(self, json):
        for key in json.keys():
            setattr(self, key, json[key])


class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        include_fk = True


movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)
