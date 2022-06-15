from sqlalchemy_serializer import SerializerMixin

from db.database import db, ma
from db.model.seat_type import SeatType


class Seat(db.Model):
    seatId = db.Column(db.Integer, primary_key=True)
    resId = db.Column(db.Integer, db.ForeignKey('reservation.resId'))
    number = db.Column(db.Integer)
    type = db.Column(db.Enum(SeatType))

    prices = {SeatType.CHILD: 5.5, SeatType.STUDENT: 6.0, SeatType.ADULT: 7.0, SeatType.DISABLED: 5.5}

    def __init__(self, number: int, type: SeatType):
        self.number = number
        self.type = type


class SeatSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Seat
        include_fk = True


seat_schema = SeatSchema()
seats_schema = SeatSchema(many=True)
