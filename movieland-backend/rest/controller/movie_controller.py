from flask import request, jsonify
from flask_restx import Namespace, Resource

api = Namespace('movies', path='/movies', description='Movies')


@api.route("/")
class MoviesController(Resource):

    def get(self):
        return {"data": "Hello World"}

    def post(self):
        json_data = request.get_json(force=True)
        return json_data


@api.route("/<id>")
@api.param('id', 'Movie identifier')
class MovieController(Resource):

    def get(self, id):
        return {"data": "Movie " + id}
