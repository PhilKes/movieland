package com.phil.movieland.utils;

import com.phil.movieland.data.entity.Movie;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import org.springframework.stereotype.Service;

import java.util.List;

/** Service for Tmdb Api interface*/
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
        return tmdbMovies.getMovie(movie.getTmdbId().intValue(),"en");
    }

    public List<MovieDb> getMoviesFromTmdb(String name){
        MovieResultsPage resultsPage=tmdbApi.getSearch().searchMovie(name,null,"en",false,0);
        List<MovieDb> results=resultsPage.getResults();
        return results;
    }

    public List<MovieDb> getTop10Movies(){

        //return tmdbApi.getMovies().getTopRatedMovies("en",0).getResults().subList(0,10);
        return tmdbApi.getMovies().getNowPlayingMovies("en",0,"US").getResults().subList(0,10);
    }
}
