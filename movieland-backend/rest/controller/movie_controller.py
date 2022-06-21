from flask import request
from flask_restx import Namespace, Resource

from db.model.movie import Movie, movies_schema, movie_schema
from logger import get_logger
from rest.service.movie_service import MovieService

api = Namespace('movies', path='/movies', description='Movies')
service = MovieService()

log = get_logger()


@api.route("/")
class MoviesController(Resource):

    def get(self):
        query = request.args.get("name", default=None, type=str)
        return movies_schema.dump(service.get_movies(query)), 200

    def post(self):
        json_data = request.get_json(force=True)
        movie = Movie()
        movie.set_from_json(json_data)
        movie.movId = None
        try:
            service.save_movie(movie)
        except FileExistsError as err:
            return {"msg": str(err)}, 409
        return movie_schema.dump(movie), 201

    def delete(self):
        service.delete_all()
        return {"msg": f"All Movies deleted"}, 200


@api.route("/<int:movId>")
@api.doc(params={'movId': 'Movie identifier'})
class MovieController(Resource):

    def get(self, movId: int):
        movie = Movie.query.filter_by(movId=movId).first()
        if movie is None:
            return {}, 404
        return movie_schema.dump(movie), 200

    def put(self, movId: int):
        json_data = request.get_json(force=True)
        movie = Movie()
        movie.set_from_json(json_data)
        movie.movId = movId
        return movie_schema.dump(service.save_movie(movie, True)), 200

    def delete(self, movId: int):
        service.delete_by_id(movId)
        return {"msg": f"Movie (movId='{movId}') deleted"}, 200

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
        return movies_schema.dump(service.get_movies_by_ids(ids)), 200


@api.route("/tmdb")
class MoviesTmdbController(Resource):
    def get(self):
        query = request.args.get("name", default=None, type=str)
        return movies_schema.dump(service.get_movies_from_tmdb(query)), 200


@api.route("/tmdb/top")
class MoviesTmdbTopController(Resource):
    def get(self):
        return movies_schema.dump(service.get_tmdb_top_10_movies()), 200
