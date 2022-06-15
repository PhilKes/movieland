from sqlalchemy_serializer import SerializerMixin

from db.database import db, ma
from db.model.payment_method import PaymentMethod


class Reservation(db.Model):
    resId = db.Column(db.Integer, primary_key=True)
    showId = db.Column(db.Integer, db.ForeignKey('movie_show.showId'))
    # userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    validated = db.Column(db.Boolean)
    totalSum = db.Column(db.Float)
    method = db.Column(db.Enum(PaymentMethod))

    # cashierId = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, showId: int, userId: int):
        self.showId = showId
        self.userId = userId


class ReservationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reservation
        include_fk = True


reservation_schema = ReservationSchema()
reservations_schema = ReservationSchema(many=True)
