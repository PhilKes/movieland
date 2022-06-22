from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'
DATE_FORMAT = '%Y-%m-%d'

db = SQLAlchemy()
ma = Marshmallow()
