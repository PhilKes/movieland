package com.phil.movieland.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.utils.TmdbApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final TmdbApiService tmdbApiService;

    @Autowired
    public MovieService(MovieRepository movieRepository,TmdbApiService tmdbApiService) {
        this.movieRepository=movieRepository;
        this.tmdbApiService=tmdbApiService;
    }

    public List<Movie> getAllMovies(){
        List<Movie> movies=movieRepository.findAll();
        return loadTmdbMovies(movies);
    }

    public List<Movie> queryAllMovies(String queryName){
        List<Movie> movies=movieRepository.findAllByNameContains(queryName);
        return loadTmdbMovies(movies);
    }

    private List<Movie> loadTmdbMovies(List<Movie> movies){
        for(Movie movie : movies) {
            if(movie.getTmdbId()== null) {
                System.out.println("Updating: "+movie.getName());
                movie.setTmdbMovie(tmdbApiService.getMovieFromTmdb(movie));
                updateMovie(movie);
            }else{
                System.out.println("Already loaded: "+movie.getName());
            }
        }
        return movies;

    }

    private void updateMovie(Movie movie) {
        movieRepository.save(movie);
    }

}
