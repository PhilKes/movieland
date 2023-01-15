"""
Initializes Database + REST Api + start Webserver on port 8080
"""
import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_cors import CORS
from flask_restx import Api

from config import get_config
from error_handling import add_error_handlers
from db.database import db, ma, check_initial_data

from rest.controller import movie_api, movie_show_api, reservation_api, task_api, user_api, stats_api, auth_api, \
    seat_api

app = Flask('MovieLand')

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('APP_DATASOURCE_URL', get_config('app.datasource.url'))
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
api.add_namespace(auth_api)
api.add_namespace(user_api)
api.add_namespace(seat_api)
api.add_namespace(task_api)
api.add_namespace(stats_api)

add_error_handlers(app)

app.config['SECRET_KEY'] = get_config('app.jwtSecret')
cors = CORS(app,
            resources=r"/api/*",
            origins='*', expose_headers='*', allow_headers='*', max_age=3600)
app.url_map.strict_slashes = False

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        check_initial_data()
    app.app_context().push()
    app.run(host=os.getenv('APP_HOST', get_config('app.host')), port=int(os.getenv('APP_PORT', get_config('app.port'))),
            debug=True)
