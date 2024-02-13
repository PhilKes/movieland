package com.phil.movieland.rest.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.utils.TmdbApiService;
import info.movito.themoviedbapi.model.MovieDb;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class MovieServiceTest {

    @InjectMocks
    private MovieService movieService;
    @Mock
    private MovieRepository movieRepository;
    @Mock
    private TmdbApiService tmdbApiService;

    private List<Movie> testMovies = Arrays.asList(createMovie("Movie 1"),
            createMovie("Movie 2"),
            createMovie("Movie 3"),
            createMovie("Movie 4"));

    private static Movie createMovie(String name) {
        Movie movie = new Movie();
        movie.setDate(new Date());
        movie.setName(name);
        movie.setLength(100L);
        movie.setDescription("A Movie");
        return movie;
    }

    private static MovieDb createMovieDb(String name) {
        MovieDb movieDb = new MovieDb();
        movieDb.setTitle(name);
        movieDb.setOverview("Description for " + name);
        return movieDb;

    }

    @Test
    public void testGetAllMovies() {
        when(movieRepository.findAllByOrderByName()).thenReturn(testMovies);
        when(movieRepository.save(any())).thenReturn(any());

        testMovies.forEach(testMovie -> when(tmdbApiService.getMovieFromTmdb(testMovie)).thenReturn(
            createMovieDb(testMovie.getName())));
        Collection<Movie> returnedMovies = movieService.getAllMovies();
        verify(movieRepository, times(1)).findAllByOrderByName();
        verify(movieRepository, times(4)).save(any());
        verifyNoMoreInteractions(movieRepository);
        assertEquals(testMovies, returnedMovies);
    }

    //...
}