from typing import List

from flask_sqlalchemy import Pagination

from db.database import db
from db.model import Movie
from logger import get_logger
from rest.service.tmdb_service import TmdbService

log = get_logger()


class MovieService:

    def get_movies(self, query: str) -> List[Movie]:
        log.info(f"Querying Movies for '{query}'")
        if query is None:
            return Movie.query.all()
        return Movie.query.filter(Movie.name.ilike(f"%{query}%")).all()

    def get_movie_by_id(self, id: int) -> Movie:
        return Movie.query.filter_by(movId=id).first()

    def get_movie_by_tmdb_id(self, tmdb_id: int) -> Movie:
        return Movie.query.filter_by(tmdbId=tmdb_id).first()

    def get_movie_by_name(self, name: str) -> Movie:
        log.info(f"Querying Movies for '{name}'")
        return Movie.query.filter_by(name=name).first()

    def _set_tmdb_data(self, movie: Movie, update: bool):
        if movie.tmdbId is None:
            movie.set_from_tmdb_movie(TmdbService.get_movie_from_tmdb(movie))
            if update:
                log.info(f"Updating TMDB data for movie '{movie.name}'")
                db.session.commit()

    def save_movie(self, movie: Movie, update=False):
        if movie.tmdbId is None:
            self._set_tmdb_data(movie, False)
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
        Movie.query.delete()
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
