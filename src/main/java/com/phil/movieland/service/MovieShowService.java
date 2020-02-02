package com.phil.movieland.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.data.repository.MovieShowRepository;
import com.phil.movieland.utils.DateUtils;
import com.phil.movieland.utils.TmdbApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MovieShowService {

    private final MovieShowRepository movieShowRepository;

    @Autowired
    public MovieShowService(MovieShowRepository movieShowRepository) {
        this.movieShowRepository=movieShowRepository;
    }

    public List<MovieShow> getShowsForMovie(Movie movie){
        List<MovieShow> shows= movieShowRepository.findAllByMovId(movie.getMovId());
        for(MovieShow show : shows) {
            System.out.println("Show at: "+show.getDate());
        }
        return shows;
    }

    public List<MovieShow> getShowsForMovieDate(Movie movie,String dateString){
        Date date=DateUtils.createDateFromDateString(dateString);
        Date dateStart=new Date(date.getTime());
        dateStart.setHours(0);
        dateStart.setMinutes(0);
        Date dateEnd=new Date(date.getTime());
        dateEnd.setHours(23);
        dateEnd.setMinutes(59);
        List<MovieShow> shows= movieShowRepository.findAllByMovIdAndDateBetween(movie.getMovId(),dateStart,dateEnd);
        for(MovieShow show : shows) {
            System.out.println("Show at: "+show.getDate());
        }
        return shows;
    }
   /* public List<Movie> getAllMovies(){
        List<Movie> movies=movieShowRepository.findAll();
        return loadTmdbMovies(movies);
    }

    public List<Movie> queryAllMovies(String queryName){
        List<Movie> movies=movieShowRepository.findAllByNameContains(queryName);
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
        movieShowRepository.save(movie);
    }*/

}
