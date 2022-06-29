from typing import List

from db.database import db
from db.model import MovieShow, Reservation, Seat
from logger import get_logger
from rest.service.dto.reservation_with_seats import ReservationWithSeats
from rest.service.seats_service import SeatsService

log = get_logger()
seats_service = SeatsService()


class ReservationService:

    def get_reservation_by_id(self, id: int) -> Reservation:
        return Reservation.query.filter_by(resId=id).first()

    def get_reservation_by_id_and_user(self, id: int, userId: int) -> Reservation:
        return Reservation.query.filter_by(resId=id, userId=userId).first()

    def get_reservations_by_show_id(self, showId: int) -> List[Reservation]:
        return Reservation.query.filter_by(showId=showId).all()

    def get_reservations_by_user(self, user_id: int) -> List[Reservation]:
        return Reservation.query.filter_by(userId=user_id).all()

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
            total_sum = sum([Seat.prices[seat.type.name] for seat in seats])
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

    def delete_by_ids(self, res_ids: List[int]):
        Reservation.query.filter(Reservation.resId.in_(res_ids)).delete()

    def get_reservations_by_show(self, showId: int) -> List[Reservation]:
        return Reservation.query.filter_by(showId=showId).all()

    def get_seats_of_reservation(self, resId: int) -> List[Seat]:
        return seats_service.get_seats_of_reservation(resId)

    def get_seats_of_show(self, showId: int) -> List[Seat]:
        return Seat.query.join(Reservation).join(MovieShow).filter_by(showId=showId).all()

    def delete_reservations_of_shows(self, show_ids: List[int]):
        seats_service.delete_by_show_ids(show_ids)
        return Reservation.query.filter(Reservation.showId.in_(show_ids)).delete()

    def are_seats_available(self, showId: int, seat_list: List[Seat]) -> bool:
        for seat in seat_list:
            if not seats_service.is_seat_available(seat.number, showId):
                return False
        return True

    def save_reservations_with_seats(self, reservations: List[ReservationWithSeats]):
        log.info("Saving Reservations List")
        for reservation in reservations:
            self.save_reservation(reservation.reservation, reservation.seats)

    def get_reservations_by_shows(self, show_ids: List[int]) -> List[Reservation]:
        return Reservation.query.filter(Reservation.showId.in_(show_ids)).all()

    def get_seats_of_reservations(self, res_ids: List[int]):
        return Seat.query.filter(Seat.resId.in_(res_ids)).all()
