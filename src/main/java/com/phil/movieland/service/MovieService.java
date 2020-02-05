package com.phil.movieland.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.utils.DateUtils;
import com.phil.movieland.utils.TmdbApiService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public MovieService(MovieRepository movieRepository, TmdbApiService tmdbApiService) {
        this.movieRepository=movieRepository;
        this.tmdbApiService=tmdbApiService;
    }

    public List<Movie> getAllMovies() {
        List<Movie> movies=movieRepository.findAll();
        return loadTmdbMovies(movies);
    }

    public List<Movie> queryAllMovies(String queryName) {
        List<Movie> movies=movieRepository.findAllByNameContains(queryName);
        return loadTmdbMovies(movies);
    }

    public Optional<Movie> queryMovie(long movieId) {
        Optional<Movie> movie=movieRepository.findById(movieId);
        if(movie.isPresent()) {
            setTmdbData(movie.get(),true);
        }
        return movie;
    }

    public List<Movie> queryTmdbMovies(String name){

        return tmdbApiService.getMoviesFromTmdb(name).stream().map(tmdbMovie->{
           Movie mov= new Movie();
           mov.setTmdbMovie(tmdbMovie);
           return mov;
        }).collect(Collectors.toList());
    }

    public List<Movie> querTmdbTop10Movies(){
        return tmdbApiService.getTop10Movies().stream().map(tmdbMovie -> {
            Movie mov= new Movie();
            mov.setTmdbMovie(tmdbMovie);
            return mov;
        }).collect(Collectors.toList());
    }

    public Movie saveMovie(Movie movie) throws Exception {
        if(movie.getTmdbId()==null) {
            setTmdbData(movie,false);
        }
        Optional<Movie> duplicate=movieRepository.findFirstByTmdbId(movie.getTmdbId());
        if(duplicate.isPresent()) {
            if(duplicate.get().getMovId()!=movie.getMovId()) {
                System.out.println(movie.getName()+" already in Database!");
                throw new Exception(movie.getName()+" is already in the Database!");
            }
        }
        System.out.println("Saving: " + movie.getName());
        return movieRepository.save(movie);
    }

    public void deleteById(long movieId) {
        movieRepository.deleteById(movieId);
    }

    private void updateMovie(Movie movie) {
        movieRepository.save(movie);
    }

    /**
     * Load infos from TMDB and set in movies
     */
    private List<Movie> loadTmdbMovies(List<Movie> movies) {
        for(Movie movie : movies) {
            setTmdbData(movie,true);
        }
        return movies;
    }

    private void setTmdbData(Movie movie, boolean update) {
        if(movie.getTmdbId()==null) {
            System.out.println("Updating: " + movie.getName());
            movie.setTmdbMovie(tmdbApiService.getMovieFromTmdb(movie));
            if(update) {
                updateMovie(movie);
            }
        }
        else {
            System.out.println("Already loaded: " + movie.getName());
        }
    }

}
