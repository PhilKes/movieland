package com.phil.movieland.rest.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.utils.TmdbApiService;
import com.phil.movieland.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service to interface movieRepository + TmdbApi
 */
@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final TmdbApiService tmdbApiService;

    private Logger log = LoggerFactory.getLogger(MovieService.class);

    @Autowired
    public MovieService(MovieRepository movieRepository, TmdbApiService tmdbApiService) {
        this.movieRepository = movieRepository;
        this.tmdbApiService = tmdbApiService;
    }

    public List<Movie> getAllMovies() {
        List<Movie> movies = movieRepository.findAllByOrderByName();
        return loadTmdbMovies(movies);
    }

    public Slice<Movie> getAllMoviesPaged(int page, int size) {
        Slice<Movie> movies = movieRepository.findAllByOrderByName(PageRequest.of(page, size));
        loadTmdbMovies(movies.getContent());
        return movies;
    }

    public List<Movie> queryAllMovies(String queryName) {
        log.info("Querying Movies for '{}'", queryName);
        List<Movie> movies = movieRepository.findAllByNameContainsOrderByName(queryName);
        return loadTmdbMovies(movies);
    }

    public Slice<Movie> queryAllMoviesPaged(String queryName, int page, int size) {
        log.info("Querying Movies for '{}', page {}, size {}", queryName, page, size);
        Slice<Movie> movies = movieRepository.findAllByNameContainsOrderByName(queryName, PageRequest.of(page, size));
        loadTmdbMovies(movies.getContent());
        return movies;
    }

    public Optional<Movie> queryMovie(long movieId) {
        log.info("Fetching Movie by id '{}'", movieId);
        Optional<Movie> movie = movieRepository.findById(movieId);
        movie.ifPresent(value -> setTmdbData(value, true));
        return movie;
    }

    public List<Movie> queryTmdbMovies(String name) {
        return tmdbApiService.getMoviesFromTmdb(name).stream().map(tmdbMovie -> {
            Movie mov = new Movie();
            mov.setTmdbMovie(tmdbMovie);
            return mov;
        }).collect(Collectors.toList());
    }

    public List<Movie> queryTmdbTop10Movies() {
        return tmdbApiService.getTop10Movies().stream().map(tmdbMovie -> {
            Movie mov = new Movie();
            mov.setTmdbMovie(tmdbMovie);
            return mov;
        }).collect(Collectors.toList());
    }

    public Movie saveMovie(Movie movie) throws Exception {
        if (movie.getTmdbId() == null) {
            setTmdbData(movie, false);
        }
        Optional<Movie> duplicate = movieRepository.findFirstByTmdbId(movie.getTmdbId());
        if (duplicate.isPresent()) {
            if (duplicate.get().getMovId() != movie.getMovId()) {
                log.warn("Movie '{}' already exists!", movie.getName());
                throw new Exception(movie.getName() + " is already in the Database!");
            }
        }
        log.info("Saving Movie: '{}' ", movie.getName());
        return movieRepository.save(movie);
    }

    public Movie saveMovieIfNotExists(Movie movie) {
        if (!movieRepository.findById(movie.getMovId()).isEmpty()) {
            log.info("Movie '{}' (id: '{}') already exists", movie.getName(), movie.getMovId());
            return movie;
        }
        log.info("Saving Movie: '{}' ", movie.getName());
        return movieRepository.save(movie);
    }

    public void deleteById(long movieId) {
        log.info("Deleting Movie by id: '{}'", movieId);
        movieRepository.deleteById(movieId);
    }

    private void updateMovie(Movie movie) {
        log.info("Updating Movie '{}'", movie.getName());
        movieRepository.save(movie);
    }

    /**
     * Load infos from TMDB and set in movies
     */
    private List<Movie> loadTmdbMovies(List<Movie> movies) {
        for (Movie movie : movies) {
            setTmdbData(movie, true);
        }
        return movies;
    }

    private void setTmdbData(Movie movie, boolean update) {
        if (movie.getTmdbId() == null) {
            log.info("Updating TMDB data for movie '{}'", movie.getName());
            movie.setTmdbMovie(tmdbApiService.getMovieFromTmdb(movie));
            if (update) {
                updateMovie(movie);
            }
        }

    }

    public String getBackdrop(Long movId) {
        return tmdbApiService.getBackdrop(movId);
    }

    public Optional<String> getTrailer(Long movId) {
        Optional<Movie> movie = movieRepository.findById(movId);
        if (movie.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(tmdbApiService.getTrailerURL(movie.get().getTmdbId()));
    }

    public List<Movie> queryMoviesByIds(List<Long> movIds) {
        log.info("Fetching Movies by ids '{}'", Utils.joinToStringList(movIds));
        return movieRepository.findAllByMovIdIn(movIds);
    }

    public void deleteAll() {
        log.info("Deleting all Movies");
        movieRepository.deleteAll();
    }
}
