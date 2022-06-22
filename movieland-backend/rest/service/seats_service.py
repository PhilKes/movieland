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
