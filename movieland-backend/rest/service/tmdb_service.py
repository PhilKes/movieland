from typing import List

from tmdbv3api import TMDb
from tmdbv3api.as_obj import AsObj

from config import get_config
from db.model import Movie
from tmdbv3api import Movie as TmdbMovie

from logger import get_logger

log = get_logger()
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"


class _TmdbService:
    backdrops_cache = {}
    trailers_cache = {}

    def __init__(self):
        self.tmdb = TMDb()
        self.tmdb.api_key = get_config('tmdbApi.apikey')

    def to_movie(self, tmdb_movie) -> Movie:
        movie = Movie()
        movie.set_from_tmdb_movie(tmdb_movie)
        return movie

    def to_detailed_movie(self, tmdb_movie) -> Movie:
        movie = self.get_tmdb_movie_by_id(tmdb_movie.id)
        return self.to_movie(movie)

    def query_by_name(self, query: str) -> List[Movie]:
        tmdb_movies = TmdbMovie().search(query)
        movies = list(map(self.to_detailed_movie, tmdb_movies))
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
                return self.get_tmdb_movie_by_id(tmdb_movie[0].id)
        return self.get_tmdb_movie_by_id(movie.tmdbId)

    def get_backdrop(self, id: int) -> str:
        if id in self.backdrops_cache:
            log.debug(f"Loading Backdrop for Movie tmdbId='{id}' from cache")
            return self.backdrops_cache[id]
        log.debug(f"Fetching Backdrop for Movie tmdbId='{id}' from TMDB Api")
        movie = self.get_tmdb_movie_by_id(id)
        backdrop = IMAGE_BASE_URL + movie.get("backdrop_path")
        self.backdrops_cache[id] = backdrop
        return backdrop

    def get_trailer(self, id: int) -> str:
        if id in self.trailers_cache:
            log.debug(f"Loading Trailer for Movie tmdbId='{id}' from cache")
            return self.trailers_cache[id]
        log.debug(f"Fetching Trailer for Movie tmdbId='{id}' from TMDB Api")
        movie = self.get_tmdb_movie_by_id(id)
        trailer = next(filter(lambda x: x.get("site") == "YouTube", movie.get("videos").get("results")))
        if trailer is None:
            return None
        self.trailers_cache[id] = trailer.get("key")
        return self.trailers_cache[id]


TmdbService = _TmdbService()
