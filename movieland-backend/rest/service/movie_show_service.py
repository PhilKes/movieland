from datetime import datetime, timedelta
from typing import List

from db.database import db
from db.model import MovieShow
from logger import get_logger
from rest.service.reservation_service import ReservationService

log = get_logger()

res_service= ReservationService()

class MovieShowService:

    def get_show_by_id(self, id: int) -> MovieShow:
        return MovieShow.query.filter_by(showId=id).first()

    def get_shows_for_date(self, date: datetime, movId: int = None) -> List[MovieShow]:
        log.info(f"Querying MovieShows for date='{date}' and movIds='{movId}' ")
        date_from = date.replace(hour=0, minute=0, second=0)
        date_until = date.replace(hour=23, minute=59, second=59)
        if movId is not None:
            return MovieShow.query.filter(MovieShow.date >= date_from, MovieShow.date <= date_until,
                                          MovieShow.movId == movId).all()
        return self.get_shows_for_between(date_from, date_until)

    def get_shows_of_week(self, date: datetime = datetime.today()) -> List[MovieShow]:
        date_from = date.replace(hour=0, minute=0, second=0)
        date_until = (date_from + timedelta(days=7)).replace(hour=23, minute=59, second=59)
        log.info(f"Querying MovieShows between: '{date_from}' and '{date_until}'")
        return self.get_shows_for_between(date_from, date_until)

    def get_shows_of_week_of_movie(self, movId: int, date: datetime = datetime.today()) -> List[MovieShow]:
        start_datetime = date.replace(hour=0, minute=0, second=0)
        end_datetime = (start_datetime + timedelta(days=7)).replace(hour=23, minute=59, second=59)
        log.info(f"Querying MovieShows between: '{start_datetime}' and '{end_datetime}'")
        return MovieShow.query.filter(MovieShow.date >= start_datetime, MovieShow.date <= end_datetime,
                                      MovieShow.movId == movId).all()

    def get_shows_for_between(self, date_from, date_until) -> List[MovieShow]:
        _from = date_from.replace(hour=0, minute=0, second=0)
        _until = date_until.replace(hour=23, minute=59, second=59)
        return MovieShow.query.filter(MovieShow.date >= _from, MovieShow.date <= _until).all()

    def save_show(self, show: MovieShow, update: bool = False):
        if update:
            db.session.merge(show)
        else:
            db.session.add(show)
        db.session.commit()
        return show

    def delete_all(self):
        MovieShow.query.delete()
        db.session.commit()

    def delete_by_ids(self, show_ids: List[int]):
        res_service.delete_reservations_of_shows(show_ids)
        MovieShow.query.filter(MovieShow.showId.in_(show_ids)).delete()
        db.session.commit()

    def save_shows(self, movie_shows: List[MovieShow]):
        for show in movie_shows:
            self.save_show(show)

    def get_shows_for_mov_ids_and_between(self, mov_ids: List[int], date_from: datetime, date_until: datetime) -> List[MovieShow]:
        return MovieShow.query.filter(MovieShow.movId.in_(mov_ids), MovieShow.date >= date_from,
                                      MovieShow.date <= date_until).all()

    def get_by_movies(self, mov_ids: List[int]) -> List[MovieShow]:
        return MovieShow.query.filter(MovieShow.movId.in_(mov_ids)).all()
