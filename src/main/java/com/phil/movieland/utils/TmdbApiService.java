package com.phil.movieland.utils;

import com.phil.movieland.data.entity.Movie;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TmdbApiService {
    public static final String POSTER_BASE_URL="https://image.tmdb.org/t/p/w185/";
    private static final String API_KEY="86d157bbb36335ea938b606634e1c4ab";
    private static final TmdbApi tmdbApi= new TmdbApi(API_KEY);
    private static final TmdbMovies tmdbMovies= tmdbApi.getMovies();

    public TmdbApiService() {
    }

    public MovieDb getMovieFromTmdb(Movie movie){
        if(movie.getTmdbId() ==null){
            MovieResultsPage resultsPage=tmdbApi.getSearch().searchMovie(movie.getName(),null,"en",false,0);
            List<MovieDb> results=resultsPage.getResults();
            if(!results.isEmpty()){
                return results.get(0);
            }
        }
        MovieDb movieDb= tmdbMovies.getMovie(movie.getTmdbId().intValue(),"en");
        return movieDb;
    }
}
