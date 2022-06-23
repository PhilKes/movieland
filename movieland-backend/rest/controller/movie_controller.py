from flask import request
from flask_restx import Namespace, Resource

from db.model import RoleName, User
from db.model.movie import Movie, movies_schema, movie_schema
from logger import get_logger
from middleware import authenticated_by_role
from rest.service.movie_service import MovieService

api = Namespace('movies', path='/movies', description='Movies')
service = MovieService()

log = get_logger()


@api.route("/")
class MoviesController(Resource):

    def get(self):
        query = request.args.get("name", default=None, type=str)
        return movies_schema.dump(service.get_movies(query)), 200

    @authenticated_by_role(RoleName.ROLE_ADMIN)
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        movie = Movie()
        movie.set_from_json(json_data)
        movie.movId = None
        try:
            service.save_movie(movie)
        except FileExistsError as err:
            return {"msg": str(err)}, 409
        return movie_schema.dump(movie), 201

    @authenticated_by_role(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User):
        service.delete_all()
        return {"msg": f"All Movies deleted"}, 200


@api.route("/<int:movId>")
@api.doc(params={'movId': 'Movie identifier'})
class MovieController(Resource):

    def get(self, movId: int):
        movie = service.get_movie_by_id(movId)
        if movie is None:
            return {}, 404
        return movie_schema.dump(movie), 200

    @authenticated_by_role(RoleName.ROLE_ADMIN)
    def put(self, current_user: User, movId: int):
        json_data = request.get_json(force=True)
        movie = Movie()
        movie.set_from_json(json_data)
        movie.movId = movId
        return movie_schema.dump(service.save_movie(movie, True)), 200

    @authenticated_by_role(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User, movId: int):
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


@api.route("/trailer/<int:movId>")
@api.param('movId', 'Movie identifier')
class MovieTrailerController(Resource):
    def get(self, movId: int):
        trailer_url = service.get_movie_trailer(movId)
        if trailer_url is None:
            return {"msg": f"Movie (movId='{movId}') does not exist"}
        return trailer_url, 200


@api.route("/tmdb/images")
class MoviesTmdbImagesController(Resource):
    def get(self):
        ids = request.args.getlist("ids", type=int)
        backdrops = {}
        for id in ids:
            backdrops[id] = service.get_backdrop(id)
        return backdrops, 200
