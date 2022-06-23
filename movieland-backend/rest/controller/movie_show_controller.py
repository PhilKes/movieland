from collections import defaultdict
from datetime import datetime

from flask import request
from flask_restx import Namespace, Resource

from db.database import DATE_FORMAT
from db.model import MovieShow, movie_show_schema, movie_shows_schema, movies_schema, RoleName, User
from logger import get_logger
from middleware import authenticated
from rest.dto.movie_show_info import MovieShowInfo, movie_shows_infos_schema, movie_show_info_schema
from rest.service.movie_service import MovieService
from rest.service.movie_show_service import MovieShowService

api = Namespace('moviesShows', path='/shows', description='MovieShows')
service = MovieShowService()
movie_service = MovieService()

log = get_logger()


@api.route("")
class MovieShowsController(Resource):

    def get(self):
        date = request.args.get("date", default=None, type=str)
        date = datetime.strptime(date, DATE_FORMAT)
        return movie_shows_schema.dump(service.get_shows_for_date(date)), 200

    @authenticated(RoleName.ROLE_ADMIN)
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        show = MovieShow()
        show.set_from_json(json_data)
        show.showId = None
        try:
            service.save_show(show)
        except FileExistsError as err:
            return {"msg": str(err)}, 409
        return movie_show_schema.dump(show), 201

    @authenticated(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User):
        show_ids = request.args.getlist("showIds", type=int) if 'showIds' in request.args else None
        if show_ids is None:
            service.delete_all()
        else:
            service.delete_by_ids(show_ids)
        return {"msg": f"MovieShows (showIds='{show_ids}') deleted"}, 200


@api.route("/infos")
class MovieShowsInfoController(Resource):

    def get(self):
        """
        Get additional Infos about a MovieShow
        """
        date = request.args.get("date", default=None, type=str)
        date = datetime.strptime(date, DATE_FORMAT)
        shows = service.get_shows_for_date(date)

        # Group the MovieShows by movId
        show_map = defaultdict(list)

        for show in shows:
            show_map[show.movId].append(show)

        for mov_id in show_map:
            movie = movie_service.get_movie_by_id(mov_id)
            show_map[mov_id] = list(
                map(lambda x: movie_show_info_schema.dump(MovieShowInfo(mov_id, movie.name, x.date, movie.posterUrl,
                                                                        show_map[mov_id])),
                    show_map[mov_id]))

        return show_map, 200


@api.route("/movies/<int:movId>")
@api.param("movId", "Movie identifier")
class MoviesMovieShowsController(Resource):

    def get(self, movId: int):
        """
        Get all MovieShows of Movie of Week
        """
        date = request.args.get("date", default=None, type=str)
        if date is not None:
            date = datetime.strptime(date, DATE_FORMAT)
        else:
            date = datetime.now()
        movie = movie_service.get_movie_by_id(movId)
        if movie is None:
            return {"msg": f"Movie (movId='{movId}') does not exist"}, 404
        shows = service.get_shows_of_week_of_movie(movId, date)
        return movie_shows_schema.dump(shows), 200


@api.route("/week")
class MovieShowsWeekController(Resource):

    def get(self):
        """
        Get all MovieShows of the current week
        """
        return movie_shows_schema.dump(service.get_shows_of_week()), 200


@api.route("/<int:id>")
@api.param("id", "MovieShow identifier")
class MoviesShowController(Resource):

    def get(self, id: int):
        show = service.get_show_by_id(id)
        if show is None:
            return {}, 404
        return movie_show_schema.dump(show), 200

    @authenticated(RoleName.ROLE_ADMIN)
    def put(self, current_user: User, id: int):
        json_data = request.get_json(force=True)
        show = MovieShow()
        show.set_from_json(json_data)
        show.showId = id
        return movie_show_schema.dump(service.save_show(show, True)), 200

    @authenticated(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User, id: int):
        service.delete_by_ids([id])
        return {"msg": f"MovieShow (showId='{id}') deleted"}, 200
