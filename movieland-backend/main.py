from flask import Flask
from flask_restx import Api

from rest.controller.movie_controller import api as movieApi

app = Flask(__name__)
api = Api(app, title='MovieLand REST Api')
api.prefix = '/api'

api.add_namespace(movieApi)

if __name__ == "__main__":
    app.run(port=8080, debug=True)
