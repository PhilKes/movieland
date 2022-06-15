import logging

from flask import request
from flask_restx import Namespace, Resource

from db.database import db
from db.model.movie import Movie, movies_schema, movie_schema
from rest.service.movie_service import MovieService

api = Namespace('movies', path='/movies', description='Movies')
service = MovieService()

log = logging.getLogger('MovieLand.sub')


@api.route("/")
class MoviesController(Resource):

    def get(self):
        args = request.args
        query = args.get("name", default=None, type=str)
        return movies_schema.dump(service.get_movies(query)), 200

    def post(self):
        json_data = request.get_json(force=True)
        movie = Movie()
        movie.set_from_json(json_data)
        movie.movId = None
        db.session.add(movie)
        db.session.commit()
        return movie_schema.dump(movie), 201


@api.route("/<movId>")
@api.param('movId', 'Movie identifier')
class MovieController(Resource):

    def get(self, movId: int):
        return movie_schema.dump(Movie.query.filter_by(movId=movId).first()), 200


@api.route("/page/<int:page>")
@api.param('page', 'Page number')
class MoviesPagedController(Resource):
    def get(self, page: int):
        query = request.args.get("name", default=None, type=str)
        pagination = service.get_movies_paged(query, page)
        return movies_schema.dump(pagination.items), 200, {"hasMore": "true"} if pagination.has_next else {
            "hasMore": "false"}


@api.route("/ids")
class MoviesListController(Resource):
    def get(self):
        ids = request.args.getlist("ids", type=int)
        log.info(f"Map of Movies by ids: {ids}")
        return movies_schema.dump(service.get_movies_by_ids(ids)), 200
