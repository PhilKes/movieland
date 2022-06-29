from datetime import datetime, timedelta

from flask import request
from flask_restx import Namespace, Resource

from db.database import DATE_FORMAT, DATETIME_FORMAT
from db.model import RoleName, User
from logger import get_logger
from middleware import authenticated
from rest.dto.util import get_datetime
from rest.service.statistics_service import StatisticsService, statistics_schema, Statistics, movie_stats_schema
from rest.service.task_service import TasksService

api = Namespace('statistics', path='/statistics', description='Statistics')

log = get_logger()
service = TasksService()
stats_service = StatisticsService()


@api.route("/statistics")
class StatisticsController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def delete(self, current_user: User):
        date_from = get_datetime(request.args.get("from", default=None, type=str), DATE_FORMAT)
        date_until = get_datetime(request.args.get("until", default=None, type=str), DATE_FORMAT)
        stats_service.delete_statistics_between(date_from, date_until)


@api.route("/summary")
class SummaryController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User):
        date_from = get_datetime(request.args.get("from", default=None, type=str), DATE_FORMAT)
        date_until = get_datetime(request.args.get("until", default=None, type=str), DATE_FORMAT)
        if date_from >= date_until:
            return statistics_schema.dump(Statistics()), 200
        return statistics_schema.dump(stats_service.calculate_statistics(date_from, date_until)), 200


@api.route("/shows")
class ShowsStatisticsController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        date_from = get_datetime(json_data.get("from"), DATETIME_FORMAT)
        date_until = get_datetime(json_data.get("until"), DATETIME_FORMAT)
        if date_from > date_until:
            return "From Date must be earlier than until Date!", 400
        shows_per_movie = json_data.get("showsPerMovie") if "showsPerMovie" in json_data else 4
        movies_per_day = json_data.get("moviesPerDay") if "moviesPerDay" in json_data else 4
        mov_ids = json_data.get("movIds") if "movIds" in json_data else 4
        log.info("Creating Task 'GenerateShows'")
        task_id = service.execute(
            stats_service.generate_shows_between_task(date_from, date_until, movies_per_day, shows_per_movie, mov_ids))
        log.info(f"Task '{task_id}' was posted for execution")
        return task_id, 201


@api.route("/reservations")
class ReservationsStatisticsController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def post(self, current_user: User):
        json_data = request.get_json(force=True)
        date_from = get_datetime(json_data.get("from"), DATETIME_FORMAT)
        date_until = get_datetime(json_data.get("until"), DATETIME_FORMAT)
        if date_from > date_until:
            return "From Date must be earlier than until Date!", 400
        elif date_from == date_until:
            date_until = date_until + timedelta(days=1)
        res_per_show = json_data.get("resPerShow")
        mov_ids = json_data.get("movIds")
        log.info("Creating Task 'GenerateReservations'")
        task_id = service.execute(
            stats_service.generate_reservations_between_task(date_from, date_until, res_per_show, mov_ids))
        log.info(f"Task '{task_id}' was posted for execution")
        return task_id, 201


@api.route("/income")
class IncomeStatisticsController(Resource):

    @authenticated(RoleName.ROLE_ADMIN)
    def get(self, current_user: User):
        json_data = request.get_json(force=True)
        date_from = get_datetime(json_data.get("from"), DATE_FORMAT)
        date_until = get_datetime(json_data.get("until"), DATE_FORMAT)
        if date_from > date_until:
            return 0.0, 200
        return stats_service.calculate_income_between(date_from, date_until), 200


@api.route("/movie/<int:movId>")
@api.param("movId", "Movie Identifier")
class MovieStatsController(Resource):

    def get(self, movId: int):
        date_until_str = request.args.get("until", default=None, type=str)
        if date_until_str is None:
            date_until = datetime.today()
        else:
            date_until = get_datetime(date_until_str, DATE_FORMAT)
        date_from_str = request.args.get("from", default=None, type=str)
        if date_from_str is None:
            date_from = date_until - timedelta(days=7)
        else:
            date_from = get_datetime(date_from_str, DATE_FORMAT)
        aggregated = request.args.get("aggregated", default=False, type=bool)
        stats = stats_service.calculate_movie_stats(movId, date_from, date_until)
        stats = {k: movie_stats_schema.dump(v) for k, v in stats.items()}
        return stats, 200
