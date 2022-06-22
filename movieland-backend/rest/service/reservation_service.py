from datetime import datetime, timedelta
from typing import List

from db.database import db
from db.model import MovieShow, Reservation, Seat
from logger import get_logger
from rest.service.seats_service import SeatsService

log = get_logger()
seats_service = SeatsService()


class ReservationService:

    def get_reservation_by_id(self, id: int) -> Reservation:
        return Reservation.query.filter_by(resId=id).first()

    def get_all(self) -> List[Reservation]:
        return Reservation.query.all()

    def save_reservation(self, reservation: Reservation, seats: List[Seat] = None, update=False) -> Reservation:
        if seats is not None:
            # Check if seats are already taken
            reservations = self.get_reservations_by_show(reservation.showId)
            for res in reservations:
                res_seats = seats_service.get_seats_of_reservation(res.resId)
                already_taken_seats = set(res_seats).intersection(seats)
                if len(already_taken_seats) > 0:
                    raise FileExistsError(f"Seats {already_taken_seats} are already taken")

        # Calculate total sum
        if seats is not None:
            total_sum = sum([Seat.prices[seat.type] for seat in seats])
            reservation.totalSum = total_sum
        if update:
            db.session.merge(reservation)
        else:
            db.session.add(reservation)
        db.session.commit()
        if seats is not None:
            for seat in seats:
                seat.resId = reservation.resId
            seats_service.save_seats(seats)
        return reservation

    def delete_all(self):
        Reservation.query.delete()

    def get_reservations_by_show(self, showId: int) -> List[Reservation]:
        return Reservation.query.filter_by(showId=showId).all()
