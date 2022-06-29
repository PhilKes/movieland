from typing import List

from db.model import Reservation, Seat


class ReservationWithSeats:
    reservation: Reservation
    seats: List[Seat]