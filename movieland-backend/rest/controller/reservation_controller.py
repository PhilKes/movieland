from collections import defaultdict
from datetime import datetime

from flask import request
from flask_restx import Namespace, Resource

from db.model import reservation_schema, Reservation, Seat, reservations_schema
from logger import get_logger
from rest.service.reservation_service import ReservationService

api = Namespace('reservations', path='/reservations', description='Reservations')
service = ReservationService()

log = get_logger()


@api.route("/")
class ReservationsController(Resource):

    def get(self):
        return reservations_schema.dump(service.get_all()), 200

    def post(self):
        json_data = request.get_json(force=True)
        reservation = Reservation()
        reservation.showId = json_data['show_id']
        reservation.resId = None
        # reservation.userId=...
        seats = list(map(lambda x: Seat(x['number'], x['type']), json_data['seats']))
        try:
            service.save_reservation(reservation, seats)
        except FileExistsError as err:
            return {"msg": str(err)}, 409
        return reservation_schema.dump(reservation), 201

    def delete(self):
        service.delete_all()
        return {"msg": f"All Reservations have been deleted"}, 200


@api.route("/<int:id>")
@api.param("id", "Reservation identifier")
class ReservationController(Resource):

    def get(self, id: int):
        reservation = service.get_reservation_by_id(id)
        if reservation is None:
            return {}, 404
        return reservation_schema.dump(reservation), 200


@api.route("/validate")
class ReservationValidateController(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        reservation = service.get_reservation_by_id(json_data['resId'])
        if reservation is None:
            return "Reservation for Validation not found", 404
        reservation.validated = json_data['validate']
        reservation.method = json_data['method']
        # reservation.cashierId= json_data['cashierId']
        try:
            reservation = service.save_reservation(reservation, update=True)
        except FileExistsError as err:
            return err.args, 400
        return f"/api/reservation/{reservation.resId}"
