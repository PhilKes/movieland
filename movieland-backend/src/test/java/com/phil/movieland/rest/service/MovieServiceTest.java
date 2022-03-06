package com.phil.movieland.rest.service;


import com.phil.movieland.MovielandSpringApplication;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.rest.controller.MovieController;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.utils.DateUtils;
import com.phil.movieland.utils.TmdbApiService;
import info.movito.themoviedbapi.model.MovieDb;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MovielandSpringApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MovieServiceTest {

    @Autowired
    private MockMvc mvc;

    private MovieRepository movieRepository;
    private TmdbApiService tmdbApiService;
    private MovieService movieService;

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
        movie.setTmdbId(1L);
        return movie;
    }

    @Before
    public void setUp() throws Exception {
        movieRepository = mock(MovieRepository.class);
        tmdbApiService = mock(TmdbApiService.class);
        movieService = new MovieService(movieRepository, tmdbApiService);
    }

    @Test
    public void testGetAllMovies() {
        when(movieRepository.findAllByOrderByName()).thenReturn(testMovies);
        when(movieRepository.save(any())).thenReturn(any());

        testMovies.forEach(testMovie -> when(tmdbApiService.getMovieFromTmdb(testMovie)).thenReturn(new MovieDb()));
        Collection<Movie> returnedMovies = movieService.getAllMovies();
        verify(movieRepository, times(1)).findAllByOrderByName();
        verifyNoMoreInteractions(movieRepository);
        assertEquals(testMovies, returnedMovies);
    }
}