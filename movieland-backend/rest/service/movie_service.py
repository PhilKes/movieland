import logging
from typing import List

from flask_sqlalchemy import Pagination

from db.model import Movie


class MovieService:

    def get_movies(self, query: str) -> List[Movie]:
        logging.getLogger().info(f"Querying Movies for '{query}'")
        if query is None:
            return Movie.query.all()
        return Movie.query.filter(Movie.name.ilike(f"%{query}%")).all()

    def get_movies_by_ids(self, ids: List[int]) -> List[Movie]:
        return Movie.query.filter(Movie.movId.in_(ids)).all()

    def get_movies_paged(self, query: str, page: int) -> Pagination:
        if query is None:
            return Movie.query.paginate(page, 10, False)
        return Movie.query.filter(Movie.name.ilike(f"%{query}%")).paginate(page, 10, False)
