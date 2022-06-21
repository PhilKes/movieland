import datetime

from tmdbv3api.as_obj import AsObj

from db.database import db, ma

POSTER_BASE_URL = "https://image.tmdb.org/t/p/w185/"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

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
            
    def set_from_tmdb_movie(self, tmdb_movie: AsObj):
        self.tmdbId = tmdb_movie['id']
        self.posterUrl = POSTER_BASE_URL + tmdb_movie['poster_path']
        self.length = tmdb_movie['runtime'] if 'runtime' in tmdb_movie else None
        self.description = tmdb_movie['overview']
        self.description = (self.description[:252] + '..') if len(self.description) > 255 else self.description
        self.date = datetime.datetime.strptime(tmdb_movie['release_date'], '%Y-%m-%d')
        self.name = tmdb_movie['title']


class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Movie
        include_fk = True


movie_schema = MovieSchema()
movies_schema = MovieSchema(many=True)
