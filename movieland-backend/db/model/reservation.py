from db.database import db, ma
from db.model.payment_method import PaymentMethod
from marshmallow_enum import EnumField


class Reservation(db.Model):
    resId = db.Column(db.Integer, primary_key=True)
    showId = db.Column(db.Integer, db.ForeignKey('movie_show.showId'))
    validated = db.Column(db.Boolean)
    totalSum = db.Column(db.Float)
    method = db.Column(db.Enum(PaymentMethod))
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    cashierId = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, showId: int = None, userId: int = None):
        self.showId = showId
        self.userId = userId
        self.validated = False
        self.totalSum=0

    def set_from_json(self, json):
        self.resId = json['resId'] if 'resId' in json else None
        self.showId = json['showId']
        self.validated = json['validated'] if 'validated' in json else False
        self.totalSum = json['totalSum'] if 'totalSum' in json else -1
        self.method = json['method'] if 'method' in json else None


class ReservationSchema(ma.SQLAlchemyAutoSchema):
    method = EnumField(PaymentMethod)

    class Meta:
        model = Reservation
        include_fk = True


reservation_schema = ReservationSchema()
reservations_schema = ReservationSchema(many=True)
