from typing import List

from flask_sqlalchemy import Pagination

from db.database import db
from db.model import Movie
from logger import get_logger
from rest.service.movie_show_service import MovieShowService
from rest.service.reservation_service import ReservationService
from rest.service.seats_service import SeatsService
from rest.service.tmdb_service import TmdbService

log = get_logger()

show_service = MovieShowService()
res_service = ReservationService()
seat_service = SeatsService()


class MovieService:

    def get_movies(self, query: str) -> List[Movie]:
        log.info(f"Querying Movies for '{query}'")
        if query is None:
            return Movie.query.all()
        return Movie.query.filter(Movie.name.ilike(f"%{query}%")).all()

    def get_movie_by_id(self, id: int) -> Movie:
        return Movie.query.filter_by(movId=id).first()

    def get_movie_trailer(self, id: int) -> str:
        movie = self.get_movie_by_id(id)
        if movie is None:
            return None
        return TmdbService.get_trailer(movie.tmdbId)

    def get_movie_by_tmdb_id(self, tmdb_id: int) -> Movie:
        return Movie.query.filter_by(tmdbId=tmdb_id).first()

    def get_movie_by_name(self, name: str) -> Movie:
        log.info(f"Querying Movies for '{name}'")
        return Movie.query.filter_by(name=name).first()

    def __set_tmdb_data__(self, movie: Movie, update: bool):
        if movie.tmdbId is None:
            movie.set_from_tmdb_movie(TmdbService.get_movie_from_tmdb(movie))
            if update:
                log.info(f"Updating TMDB data for movie '{movie.name}'")
                db.session.commit()

    def save_movie(self, movie: Movie, update=False):
        if movie.tmdbId is None:
            self.__set_tmdb_data__(movie, False)
        if not update and self.get_movie_by_tmdb_id(movie.tmdbId) is not None:
            msg = f"Movie '{movie.name} already exists!"
            log.warn(msg)
            raise FileExistsError(msg)
        log.info(f"Saving Movie: '{movie.name}'")
        if update:
            db.session.merge(movie)
        else:
            db.session.add(movie)
        db.session.commit()
        return movie

    def delete_by_id(self, movId: int):
        Movie.query.filter_by(movId=movId).delete()
        db.session.commit()

    def delete_all(self):
        movies = Movie.query.all()
        movie_ids = list(map(lambda movie: movie.movId, movies))
        shows = show_service.get_by_movies(movie_ids)
        show_ids = list(map(lambda show: show.showId, shows))
        reservations = res_service.get_reservations_by_shows(show_ids)
        res_ids = list(map(lambda res: res.resId, reservations))
        seats = res_service.get_seats_of_reservations(res_ids)
        seat_ids = list(map(lambda seat: seat.seatId, seats))
        seat_service.delete_by_ids(seat_ids)
        res_service.delete_by_ids(res_ids)
        show_service.delete_by_ids(show_ids)
        self.delete_by_ids(movie_ids)
        db.session.commit()

    def get_movies_by_ids(self, ids: List[int]) -> List[Movie]:
        log.info(f"Querying Movies for ids in '{ids}'")
        return Movie.query.filter(Movie.movId.in_(ids)).all()

    def get_movies_paged(self, query: str, page: int) -> Pagination:
        log.info(f"Querying Movies for '{query}', page {page}")
        if query is None:
            return Movie.query.paginate(page, 10, False)
        return Movie.query.filter(Movie.name.ilike(f"%{query}%")).paginate(page, 10, False)

    def get_movies_from_tmdb(self, name: str) -> List[Movie]:
        log.info(f"Querying TMDB for '{name}'")
        return TmdbService.query_by_name(name)

    def get_tmdb_top_10_movies(self) -> List[Movie]:
        log.info(f"Querying TMDB Top 10 Movies")
        return TmdbService.get_top_10_movies()

    def get_backdrop(self, tmdbId: int) -> str:
        log.info(f"Querying TMDB backdrop for Movie tmdbId='{tmdbId}'")
        return TmdbService.get_backdrop(tmdbId)

    def get_all(self) -> List[Movie]:
        return Movie.query.all()

    def delete_by_ids(self, movie_ids: List[int]):
        Movie.query.filter(Movie.movId.in_(movie_ids)).delete()
