import datetime
from typing import List

from db.model import MovieShow
from db.database import ma, DATETIME_FORMAT
from flask_marshmallow import fields

from db.model.movie_show import MovieShowSchema


class MovieShowInfo:
    """
    Object containing metadata about a MovieShow
    """

    def __init__(self, movId: int, name: str, date: datetime.datetime, posterUrl: str, shows: List[MovieShow]):
        self.movId = movId
        self.name = name
        self.date = date
        self.posterUrl = posterUrl
        self.shows = shows


class MovieShowInfoSchema(ma.Schema):
    class Meta:
        model = MovieShowInfo

    movId = fields.fields.Integer()
    name = fields.fields.Str()
    date = fields.fields.DateTime(DATETIME_FORMAT)
    posterUrl = fields.fields.Str()
    shows = fields.fields.List(fields.fields.Nested(MovieShowSchema))


movie_show_info_schema = MovieShowInfoSchema()
movie_shows_infos_schema = MovieShowInfoSchema(many=True)
