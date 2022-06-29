from datetime import datetime

from flask_marshmallow import fields

from db.database import db, ma, DATETIME_FORMAT
from rest.dto.util import get_datetime


class MovieShow(db.Model):
    showId = db.Column(db.Integer, primary_key=True)
    movId = db.Column(db.Integer, db.ForeignKey('movie.movId'))
    date = db.Column(db.DateTime)
    # reservations = db.relationship('Reservation', backref='movie_show', lazy=True)

    def set_from_json(self, json):
        self.showId = json['showId'] if 'showId' in json else None
        self.movId = json['movId']
        self.date = get_datetime(json['date'], DATETIME_FORMAT)


class MovieShowSchema(ma.SQLAlchemyAutoSchema):
    date = fields.fields.DateTime(format=DATETIME_FORMAT)
    class Meta:
        model = MovieShow
        include_fk = True


movie_show_schema = MovieShowSchema()
movie_shows_schema = MovieShowSchema(many=True)
