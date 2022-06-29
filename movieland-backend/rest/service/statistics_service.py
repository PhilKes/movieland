import random
from collections import OrderedDict
from datetime import datetime, timedelta
from operator import attrgetter
from typing import List, Mapping, Dict

from flask import current_app, Flask
from flask.ctx import AppContext
from flask_marshmallow import fields
from flask_restx import Namespace

from db.database import ma, DATE_FORMAT
from db.model import SeatType, Seat, Movie, MovieShow, RoleName, Reservation
from logger import get_logger
from rest.service.dto.reservation_with_seats import ReservationWithSeats
from rest.service.movie_service import MovieService
from rest.service.movie_show_service import MovieShowService
from rest.service.reservation_service import ReservationService
from rest.service.role_service import RoleService
from rest.service.seats_service import SeatsService
from rest.service.task_service import RunnableWithProgress
from rest.service.user_service import UserService

log = get_logger()
movie_service = MovieService()
show_service = MovieShowService()
reservation_service = ReservationService()
seats_service = SeatsService()
user_service = UserService()
role_service = RoleService()


class MovieStats:

    def __init__(self, mov_id: int = -1, poster_path: str = None, grossing: float = 0, visitors: int = 0):
        self.movId = mov_id
        self.posterPath = poster_path
        self.grossing = grossing
        self.visitors = visitors


class MovieStatsSchema(ma.Schema):
    movId = fields.fields.Int()
    posterPath = fields.fields.Str()
    grossing = fields.fields.Float()
    visitors = fields.fields.Int()


movie_stats_schema = MovieStatsSchema()


class Statistics:
    amtShows: int
    amtMovies: int
    amtSeats: int
    amtWatchedMins: int
    income: int
    dailyStats: Dict[str, int] = {}
    seatsDistribution: Dict[str, int] = {}
    movieStats: Dict[int, MovieStats] = {}

    def __init__(self):
        self.seatsDistribution = {}
        for type in SeatType:
            self.seatsDistribution[type.name] = 0

    def add_seats_distribution(self, entry: List):
        seat_distr = entry[1]
        seat_type: SeatType = entry[0]
        if seat_type in self.seatsDistribution:
            seat_distr = self.seatsDistribution[seat_type.name] + seat_distr
        self.seatsDistribution[seat_type.name] = seat_distr

    def set_movie_stats(self, movie_stats: Mapping[int, MovieStats]):
        sorted_stats = OrderedDict(
            sorted(movie_stats.items(), key=lambda entry: entry[1].grossing))
        self.movieStats = sorted_stats


class StatisticsSchema(ma.Schema):
    highestGrossingMovie = fields.fields.Method('get_highest_grossing_movie')
    lowestGrossingMovie = fields.fields.Method('get_lowest_grossing_movie')
    seatsDistribution = fields.fields.Dict()
    dailyStats = fields.fields.Dict()
    amtShows = fields.fields.Integer()
    amtMovies = fields.fields.Integer()
    amtSeats = fields.fields.Integer()
    amtWatchedMins = fields.fields.Integer()
    income = fields.fields.Integer()

    def get_highest_grossing_movie(self, obj: Statistics):
        stats = obj.movieStats.values()
        if len(stats) == 0:
            return movie_stats_schema.dump(MovieStats())
        else:
            return movie_stats_schema.dump(max(stats, key=attrgetter('grossing')))

    def get_lowest_grossing_movie(self, obj: Statistics):
        stats = obj.movieStats.values()
        if len(stats) == 0:
            return movie_stats_schema.dump(MovieStats())
        else:
            return movie_stats_schema.dump(min(stats, key=attrgetter('grossing')))


statistics_schema = StatisticsSchema()


class StatisticsService:
    precalculated_statistics: Dict[str, Statistics] = {}

    def execute_reservations_between_task(self, context: AppContext, runnable: RunnableWithProgress,
                                          date_from: datetime,
                                          date_until: datetime, res_per_show: int, mov_ids: List[int]):
        with context:
            runnable.message = "Generating Reservations"
            runnable.progress = 0
            log.info(f"Start generation of reservations for: {date_from} until {date_until}")
            user_ids = list(map(lambda user: user.id,
                                user_service.get_all_by_role(role_service.get_role_by_name(RoleName.ROLE_USER.name))))
            shows: List[MovieShow] = []
            if mov_ids is None or len(mov_ids) == 0:
                shows = show_service.get_shows_for_between(date_from, date_until)
            else:
                shows = show_service.get_shows_for_mov_ids_and_between(mov_ids, date_from, date_until)
            runnable.progress_max = len(shows)
            for show in shows:
                reservations: List[ReservationWithSeats] = []
                users: List[int] = user_ids.copy()
                shows_taken_seats = reservation_service.get_seats_of_show(show.showId)
                free_seats = [x for x in range(160) if x not in shows_taken_seats]
                amt_reservations = min(res_per_show, len(user_ids))

                for i in range(amt_reservations):
                    reservation = Reservation()
                    reservation.showId = show.showId
                    user = -1
                    if len(users) == 0:
                        users = user_ids.copy()
                    # Determine user (never 2 Reservations of same user for same show)
                    user = users.pop(random.randint(0, len(users) - 1))
                    reservation.userId = user
                    reservationWithSeats = ReservationWithSeats()
                    reservationWithSeats.reservation = reservation
                    # Determine Seats
                    seat_list: List[Seat] = []

                    amt_seats = 2 + random.randint(0, 3)
                    if amt_seats > len(free_seats):
                        break
                    for j in range(amt_seats):
                        seat = Seat()
                        seat.resId = reservation.resId
                        seat.number = free_seats.pop(0)
                        type = random.randint(0, 10)
                        if type <= 4:
                            seat.type = SeatType.ADULT
                        elif type <= 7:
                            seat.type = SeatType.STUDENT
                        elif type <= 9:
                            seat.type = SeatType.CHILD
                        else:
                            seat.type = SeatType.DISABLED
                        seat_list.append(seat)
                    reservationWithSeats.seats = seat_list
                    reservations.append(reservationWithSeats)
                reservation_service.save_reservations_with_seats(reservations)
                runnable.progress += 1
            log.info("Finished generation of reservations")

    def generate_reservations_between_task(self, date_from: datetime, date_until: datetime, res_per_show: int,
                                           mov_ids: List[int]):
        runnable = RunnableWithProgress()
        runnable.args = dict(context=current_app.app_context(), runnable=runnable, date_from=date_from,
                             date_until=date_until, res_per_show=res_per_show,
                             mov_ids=mov_ids)
        runnable.runnable = self.execute_reservations_between_task
        self.precalculated_statistics = {}
        return runnable

    def execute_shows_between_task(self, context: AppContext, runnable: RunnableWithProgress, date_from: datetime,
                                   date_until: datetime,
                                   movies_per_day: int,
                                   shows_per_movie: int,
                                   mov_ids: List[int]):

        with context:
            runnable.message = "Generating Shows"
            runnable.progress = 0
            days = (date_until - date_from).days
            runnable.progress_max = days + 1
            count_date = date_from.replace()

            movies: List[Movie] = None
            if (mov_ids is None or len(mov_ids) == 0):
                movies = movie_service.get_all()
                random.shuffle(movies)
                movies = movies[:movies_per_day]
            else:
                movies = movie_service.get_movies_by_ids(mov_ids)
            while count_date <= date_until:
                for movie in movies:
                    movie_shows: List[MovieShow] = []
                    hours: List[int] = []
                    amt_shows = shows_per_movie
                    for i in range(amt_shows):
                        show_time = count_date.replace()
                        movie_show = MovieShow()
                        movie_show.movId = movie.movId
                        hour = -1
                        while True:
                            hour = 11 + random.randint(0, 12)
                            if hour not in hours:
                                break
                        hours.append(hour)
                        show_time = show_time.replace(hour=hour)
                        movie_show.date = show_time
                        movie_shows.append(movie_show)

                    show_service.save_shows(movie_shows)

                log.info(f"Generated shows for: ${count_date}")
                count_date = count_date + timedelta(days=1)
                runnable.progress += 1

    def generate_shows_between_task(self, date_from: datetime, date_until: datetime, movies_per_day: int,
                                    shows_per_movie: int,
                                    mov_ids: List[int]):
        runnable = RunnableWithProgress()
        runnable.args = dict(context=current_app.app_context(), runnable=runnable, date_from=date_from,
                             date_until=date_until,
                             movies_per_day=movies_per_day, shows_per_movie=shows_per_movie, mov_ids=mov_ids)
        runnable.runnable = self.execute_shows_between_task
        return runnable

    def generate_shows_between(self, date_from: datetime, date_until: datetime, movies_per_day: int,
                               shows_per_movie: int):
        count_date = date_from.replace()
        movies = movie_service.get_all()
        random.shuffle(movies)
        movies = movies[:movies_per_day]

        while count_date <= date_until:
            for movie in movies:
                movie_shows: List[MovieShow] = []
                hours: List[int] = []
                amt_shows = shows_per_movie
                for i in range(amt_shows):
                    show_time = count_date.replace()
                    movie_show = MovieShow()
                    movie_show.movId = movie.movId
                    hour = -1
                    while True:
                        hour = 11 + random.randint(0, 12)
                        if hour not in hours:
                            break
                    hours.append(hour)
                    show_time = show_time.replace(hour=hour)
                    movie_show.date = show_time
                    movie_shows.append(movie_show)
                show_service.save_shows(movie_shows)
            log.info(f"Generated shows for: {count_date}")
        self.precalculated_statistics = {}

    def generate_reservations_between(self, date_from: datetime, date_until: datetime, res_per_show: int):
        count_date = date_from.replace()
        user_ids = user_service.get_all_by_role(role_service.get_role_by_name(RoleName.ROLE_USER.name))
        while count_date < date_until:
            shows = show_service.get_shows_for_date(count_date)

            for show in shows:
                reservations: List[ReservationWithSeats] = []
                users: List[int] = []

                # Between 2-4 reservations per show
                amt_reservations = res_per_show
                for i in range(amt_reservations):
                    show_time = count_date.replace()
                    reservation = Reservation()
                    reservation.showId = show.showId
                    user = -1
                    while True:
                        user = user_ids[random.randint(0, len(user_ids))]
                        if user not in users:
                            break
                    users.append(user)
                    reservation.userId = user
                    reservation_with_seats = ReservationWithSeats()
                    reservation_with_seats.reservation = reservation

                    seat_list = []
                    while True:
                        seat_list = []
                        amt_seats = 2 + random.randint(0, 3)
                        start_seat = random.randint(159) - amt_seats
                        if start_seat < 0:
                            start_seat = 0
                        for j in range(amt_seats):
                            seat = Seat()
                            seat.resId = reservation.resId
                            seat.number = start_seat + j
                            type = random.randint(0, 3)
                            if type == 0:
                                seat.type = SeatType.CHILD
                            elif type == 1:
                                seat.type = SeatType.STUDENT
                            elif type == 2:
                                seat.type = SeatType.ADULT
                            elif type == 3:
                                seat.type = SeatType.DISABLED
                            else:
                                seat.type = SeatType.ADULT
                        seat_list.append(seat)
                        if reservation_service.are_seats_available(show.showId, seat_list):
                            break
                    reservation_with_seats.seats = seat_list
                    reservations.append(reservation_with_seats)
                reservation_service.save_reservations_with_seats(reservations)
            log.info(f"Generated reservations for: {count_date}")
            count_date = count_date + timedelta(days=1)
        self.precalculated_statistics = {}

    def delete_statistics_between(self, date_from: datetime, date_until: datetime):
        log.info(f"Deleting Statistics from: {date_from} until {date_until}")
        show_ids = list(map(lambda show: show.showId, show_service.get_shows_for_between(date_from, date_until)))
        reservation_service.delete_reservations_of_shows(show_ids)
        show_service.delete_by_ids(show_ids)
        self.precalculated_statistics = {}

    def calculate_income_between(self, date_from: datetime, date_until: datetime) -> float:
        log.info(f"Calculating income between '{date_from}' and '{date_until}'")
        shows = show_service.get_shows_for_between(date_from, date_until)
        income_sum = 0.0
        for show in shows:
            seats = seats_service.get_seats_of_show(show.showId)
            income_sum += sum(list(map(lambda seat: Seat.prices[seat.type.name], seats)))
        log.info(f"Finished calculating income between '{date_from}' and '{date_until}'")
        return income_sum

    def calculate_statistics(self, date_from: datetime, date_until: datetime) -> Statistics:
        summary_key = f"{date_from.strftime(DATE_FORMAT)}-to-{date_until.strftime(DATE_FORMAT)}"
        if summary_key in self.precalculated_statistics:
            return self.precalculated_statistics[summary_key]
        log.info(f"Calculating statistics between '{date_from}' and '{date_until}'")
        statistics = Statistics()
        amt_shows = 0
        amt_movies = 0
        amt_seats = 0
        amt_watched_mins = 0
        income = 0
        shows = show_service.get_shows_for_between(date_from, date_until)
        daily_stats: Dict[str, int] = {}
        count_date = date_from.replace(hour=1)
        while count_date < date_until:
            daily_stats[count_date.strftime(DATE_FORMAT)] = 0
            count_date = count_date + timedelta(days=1)

        movie_grossing: Dict[int, MovieStats] = {}
        movies: Dict[int, Movie] = self.get_movies_from_shows(shows)
        amt_shows = len(shows)
        amt_movies = len(movies)

        for show in shows:
            seats = seats_service.get_seats_of_show(show.showId)
            seats_map: Dict[SeatType, int] = {}
            for seat in seats:
                if seat.type not in seats_map:
                    seats_map[seat.type] = 1
                else:
                    seats_map[seat.type] += 1
            for seat_type in seats_map:
                statistics.add_seats_distribution([seat_type, seats_map[seat_type]])
            show_day = show.date
            show_day = show_day.replace(hour=1)

            date = show_day.replace()
            day_seats = len(seats)
            amt_seats += day_seats
            date_str = date.strftime(DATE_FORMAT)
            if date_str not in daily_stats:
                daily_stats[date_str] = day_seats
            else:
                daily_stats[date_str] = daily_stats[date_str] + day_seats
            seats_income = sum(list(map(lambda seat: Seat.prices[seat.type.name], seats)))
            income += seats_income
            mov_id = show.movId
            if mov_id not in movie_grossing:
                movie_grossing[mov_id] = MovieStats(mov_id, movies[mov_id].posterUrl, seats_income, len(seats))
            else:
                movie_grossing[mov_id].grossing += seats_income
                movie_grossing[mov_id].visitors += len(seats)
            amt_watched_mins += movies[mov_id].length

        statistics.amtMovies = amt_movies
        statistics.amtSeats = amt_seats
        statistics.amtShows = amt_shows
        statistics.income = income
        statistics.amtWatchedMins = amt_watched_mins
        statistics.dailyStats = daily_stats
        statistics.movieStats = movie_grossing
        self.precalculated_statistics[summary_key] = statistics
        log.info(f"Finished calculating statistics between '{date_from}' and '{date_until}'")
        return statistics

    def get_movies_from_shows(self, shows: List[MovieShow]) -> Dict[int, Movie]:
        movies: Dict[int, Movie] = {}
        for show in shows:
            if show.movId not in movies:
                movies[show.movId] = movie_service.get_movie_by_id(show.movId)
        return movies

    def calculate_movie_stats(self, movId: int, date_from: datetime, date_until: datetime) -> Dict[str, MovieStats]:
        log.info(f"Calculating MovieStats between '{date_from}' and '{date_until}'")
        count_date = date_from.replace(hour=1)

        dailyStats: Dict[str, MovieStats] = {}

        while count_date < date_until:
            shows = show_service.get_shows_for_date(count_date, movId)
            movie_stats = MovieStats()
            for show in shows:
                seats = seats_service.get_seats_of_show(show.showId)
                day_seats = len(seats)
                movie_stats.visitors += day_seats
                seats_income: float = sum(list(map(lambda seat: Seat.prices[seat.type.name], seats)))
                movie_stats.grossing += seats_income
            dailyStats[count_date.strftime(DATE_FORMAT)] = movie_stats
            count_date = count_date + timedelta(days=1)
        log.info(f"Finished calculating MovieStats between '{date_from}' and '{date_until}'")
        return dailyStats
