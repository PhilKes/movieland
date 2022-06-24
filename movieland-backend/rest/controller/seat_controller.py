from flask_restx import Namespace, Resource

from db.model import seats_schema
from logger import get_logger
from rest.service.movie_service import MovieService
from rest.service.movie_show_service import MovieShowService
from rest.service.reservation_service import ReservationService

api = Namespace('seats', path='/seats', description='Seats')
service = ReservationService()
show_service = MovieShowService()
movie_service = MovieService()

log = get_logger()


@api.route("/reservations/<int:resId>")
@api.param("resId", "Reservation identifier")
class ReservationSeatsController(Resource):

    def get(self, resId: int):
        return seats_schema.dump(service.get_seats_of_reservation(resId)), 200


@api.route("/shows/<int:showId>")
@api.param("showId", "MovieShow identifier")
class MovieShowSeatsController(Resource):

    def get(self, showId: int):
        return seats_schema.dump(service.get_seats_of_show(showId)), 200

