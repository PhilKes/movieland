from typing import List

from flask import request
from flask_restx import Namespace, Resource

from db.model import reservation_schema, Reservation, Seat, reservations_schema, RoleName, User, movie_schema, \
    movie_show_schema
from logger import get_logger
from middleware import authenticated
from rest.service.movie_service import MovieService
from rest.service.movie_show_service import MovieShowService
from rest.service.reservation_service import ReservationService

api = Namespace('reservations', path='/reservations', description='Reservations')
service = ReservationService()
show_service = MovieShowService()
movie_service = MovieService()

log = get_logger()


@api.route("")
class ReservationsController(Resource):

    @authenticated(RoleName.ROLE_CASHIER)
    def get(self, current_user: User):
        return reservations_schema.dump(service.get_all()), 200

    @authenticated()
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        reservation = Reservation()
        reservation.showId = json_data['show_id']
        if show_service.get_show_by_id(reservation.showId) is None:
            return f"MovieShow (showId='{reservation.showId}' does not exist", 404
        reservation.resId = None
        reservation.userId = current_user.id
        seats = list(map(lambda x: Seat(x['number'], x['type']), json_data['seats']))
        try:
            reservation = service.save_reservation(reservation, seats)
        except FileExistsError as err:
            log.error(err)
            return "Seats already taken!", 400
        return reservation_schema.dump(reservation), 201

    @authenticated(RoleName.ROLE_ADMIN)
    def delete(self):
        service.delete_all()
        return f"All Reservations have been deleted", 200


@api.route("/<int:id>")
@api.param("id", "Reservation identifier")
class ReservationController(Resource):

    @authenticated(RoleName.ROLE_CASHIER)
    def get(self, id: int):
        reservation = service.get_reservation_by_id(id)
        if reservation is None:
            return {}, 404
        return reservation_schema.dump(reservation), 200


@api.route("/validate")
class ReservationValidateController(Resource):

    @authenticated(RoleName.ROLE_CASHIER)
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        reservation = service.get_reservation_by_id(json_data['resId'])
        if reservation is None:
            return "Reservation for Validation not found", 404
        reservation.validated = json_data['validate']
        reservation.method = json_data['method']
        reservation.cashierId = json_data['cashierId']
        try:
            reservation = service.save_reservation(reservation, update=True)
        except FileExistsError as err:
            log.error(err)
            return err.args, 400
        return reservation_schema.dump(reservation), 201


@api.route("/shows/<int:showId>")
@api.param("showId", "Show identifier")
class ShowReservationsController(Resource):

    def get(self, showId: int):
        show = show_service.get_show_by_id(showId)
        if show is None:
            return f"MovieShow (showId='{showId}') does not exist", 404
        reservations = service.get_reservations_by_show_id(showId)
        return reservations_schema.dump(reservations), 200


@api.route("/me/new")
class UserMeReservationNewController(Resource):

    @authenticated()
    def get(self, current_user: User):
        return reservations_schema.dump(service.get_reservations_by_user(current_user.id)), 200


@api.route("/me/info")
class UserMeReservationNewController(Resource):

    @authenticated()
    def get(self, current_user: User):
        reservations = service.get_reservations_by_user(current_user.id)
        try:
            reservations_infos = get_reservations_infos(reservations)
            return reservations_infos, 200
        except Exception as err:
            log.error(err)
            return str(err.args), 400


@api.route("/me/id/<int:resId>")
@api.param("resId", "Reservation identifier")
class ShowReservationsController(Resource):

    @authenticated()
    def get(self, current_user: User, resId: int):
        reservation = service.get_reservation_by_id_and_user(resId, current_user.id)
        if reservation is None:
            return "Reservation not found", 404
        try:
            return get_reservation_info(reservation), 200
        except Exception as err:
            log.error(err)
            return str(err.args), 400


def get_reservation_info(reservation: Reservation):
    info = {}
    info['reservation'] = reservation_schema.dump(reservation)
    show = show_service.get_show_by_id(reservation.showId)
    if show is None:
        raise Exception("Show of Reservation not found")
    info['movieShow'] = movie_show_schema.dump(show)
    movie = movie_service.get_movie_by_id(show.movId)
    if movie is None:
        raise Exception("Movie of MovieShow not found")
    info['movie'] = movie_schema.dump(movie)
    info['QRCodeURL'] = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={reservation.resId}"
    return info


def get_reservations_infos(reservations: List[Reservation]) -> List:
    infos = []
    for reservation in reservations:
        infos.append(get_reservation_info(reservation))
    return infos
