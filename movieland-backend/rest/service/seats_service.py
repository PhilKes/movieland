from datetime import datetime, timedelta
from typing import List

from db.database import db
from db.model import MovieShow, Reservation, Seat
from logger import get_logger

log = get_logger()


class SeatsService:

    def save_seats(self, seats: List[Seat]) -> List[Seat]:
        for seat in seats:
            db.session.add(seat)
        db.session.commit()
        return seats

    def get_seats_of_reservation(self, resId: int) -> List[Seat]:
        return Seat.query.filter_by(resId=resId).all()

    def get_seats_of_show(self, showId: int) -> List[Seat]:
        return Seat.query.join(Reservation).join(MovieShow).filter_by(showId=showId).all()

    def is_seat_available(self, number: int, showId: int) -> bool:
        return Seat.query.filter_by(number=number).join(Reservation).join(MovieShow).filter_by(showId=showId).exists()

    def delete_by_ids(self, seat_ids: List[int]):
        Seat.query.filter(Seat.seatId.in_(seat_ids)).delete()

    def delete_by_show_ids(self, show_ids: List[int]):
        seat_ids = list(map(lambda seat: seat.seatId,
                            Seat.query.join(Reservation).join(MovieShow).filter(MovieShow.showId.in_(show_ids)).all()))
        Seat.query.filter(Seat.seatId.in_(seat_ids)).delete()
