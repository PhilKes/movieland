"""
Initializes Database + REST Api + start Webserver on port 8080
"""
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_restx import Api

from error_handling import add_error_handlers
from db.database import db, ma

from rest.controller import movie_api, movie_show_api, reservation_api, user_api

app = Flask('MovieLand')

host = "localhost"
username = "movielandadmin"
password = "movielandadmin"
dbname = "movieland_db"

app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{username}:{password}@{host}:5432/{dbname}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
ma.init_app(app)

api = Api(app, title='MovieLand REST Api')
api.prefix = '/api'

logging.basicConfig(filename='logs.log', level=logging.DEBUG, format=f'%(asctime)s %(levelname)s %(filename)s :')
rotating_file_handler = RotatingFileHandler(filename="logs.log")
rotating_file_handler.setLevel(logging.INFO)
app.logger.addHandler(rotating_file_handler)

api.add_namespace(movie_api)
api.add_namespace(movie_show_api)
api.add_namespace(reservation_api)
api.add_namespace(user_api)

add_error_handlers(app)

app.config['SECRET_KEY'] = "JWTSuperSecretKey"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(port=8080, debug=True)
