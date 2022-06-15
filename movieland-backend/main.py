"""
Initializes Database + REST Api + start Webserver on port 8080
"""
import logging

from flask import Flask
from flask_restx import Api

from logger import log_handler
from rest.controller.movie_controller import api as movieApi
from db.database import db, ma

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

api.add_namespace(movieApi)
#app.logger(filename='logs.log', level=logging.INFO, format=f'%(asctime)s %(levelname)s %(filename)s :')
app.logger.addHandler(log_handler)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(port=8080, debug=True)

