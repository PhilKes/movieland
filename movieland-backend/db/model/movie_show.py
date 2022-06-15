from db.database import db, ma


class MovieShow(db.Model):
    showId = db.Column(db.Integer, primary_key=True)
    movId = db.Column(db.Integer, db.ForeignKey('movie.movId'))
    date = db.Column(db.Date)
    reservations = db.relationship('Reservation', backref='movie_show', lazy=True)


class MovieShowSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MovieShow
        include_fk = True


movie_show_schema = MovieShowSchema()
movie_shows_schema = MovieShowSchema(many=True)
