from datetime import datetime, timedelta
from typing import List

from db.database import db
from db.model import MovieShow
from logger import get_logger

log = get_logger()


class MovieShowService:

    def get_show_by_id(self, id: int) -> MovieShow:
        return MovieShow.query.filter_by(showId=id).first()

    def get_shows_for_date(self, date: datetime, movId: int = None) -> List[MovieShow]:
        log.info(f"Querying MovieShows for date='{date}' and movIds='{movId}' ")
        start = date.replace(hour=0, minute=0, second=0)
        end = date.replace(hour=23, minute=59, second=59)
        if movId is not None:
            return MovieShow.query.filter(MovieShow.date >= start, MovieShow.date <= end,
                                          MovieShow.movId == movId).all()
        return MovieShow.query.filter(MovieShow.date >= start, MovieShow.date <= end).all()

    def get_shows_of_week(self, date: datetime.date = datetime.today()) -> List[MovieShow]:
        start = date.replace(hour=0, minute=0, second=0)
        end = (start + timedelta(days=7)).replace(hour=23, minute=59, second=59)
        log.info(f"Querying MovieShows between: '{start}' and '{end}'")
        return MovieShow.query.filter(MovieShow.date >= start, MovieShow.date <= end).all()

    def get_shows_of_week_of_movie(self, movId: int, date: datetime.date = datetime.today()) -> List[MovieShow]:
        start_datetime = date.replace(hour=0, minute=0, second=0)
        end_datetime = (start_datetime + timedelta(days=7)).replace(hour=23, minute=59, second=59)
        log.info(f"Querying MovieShows between: '{start_datetime}' and '{end_datetime}'")
        return MovieShow.query.filter(MovieShow.date >= start_datetime, MovieShow.date <= end_datetime,
                                      MovieShow.movId == movId).all()

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
        MovieShow.query.filter(MovieShow.showId.in_(show_ids)).delete()
        db.session.commit()
