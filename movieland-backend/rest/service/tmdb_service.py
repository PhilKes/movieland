from typing import List

from tmdbv3api import TMDb
from tmdbv3api.as_obj import AsObj

from db.model import Movie
from tmdbv3api import Movie as TmdbMovie


class _TmdbService:

    def __init__(self):
        self.tmdb = TMDb()
        self.tmdb.api_key = '7034789c8e20ce00ad84dc8661c288bf'

    def to_movie(self, tmdb_movie) -> Movie:
        movie = Movie()
        movie.set_from_tmdb_movie(tmdb_movie)
        return movie

    def query_by_name(self, query: str) -> List[Movie]:
        tmdb_movies = TmdbMovie().search(query)
        movies = list(map(self.tmdb_movie_to_movie, tmdb_movies))
        return movies

    def get_tmdb_movie_by_id(self, id: int) -> AsObj:
        return TmdbMovie().details(id)

    def get_top_10_movies(self) -> List[Movie]:
        tmdb_movies = TmdbMovie().now_playing(1)[:10]
        movies = list(map(self.to_movie, tmdb_movies))
        return movies

    def get_movie_from_tmdb(self, movie: Movie) -> AsObj:
        if movie.tmdbId is None:
            tmdb_movie = TmdbMovie().search(movie.name)
            if tmdb_movie is not None:
                return tmdb_movie[0]
        return self.get_tmdb_movie_by_id(movie.tmdbId)


TmdbService = _TmdbService()
