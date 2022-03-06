package com.phil.movieland.rest.controller;

import com.phil.movieland.MovielandSpringApplication;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.rest.service.MovieService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest( classes = MovielandSpringApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MovieControllerTest {

    @Autowired
    private MockMvc mvc;

    private MovieService movieService;
    private MovieController movieController;

    private List<Movie> testMovies= Arrays.asList(createMovie("Movie 1"),
            createMovie("Movie 2"),
            createMovie("Movie 3"),
            createMovie("Movie 4"));

    private static Movie createMovie(String name){
        Movie movie= new Movie();
        movie.setDate(new Date());
        movie.setName(name);
        movie.setLength(100L);
        movie.setDescription("A Movie");
        return movie;
    }


    @Before
    public void setUp() throws Exception {
        movieService= mock(MovieService.class);
        movieController= new MovieController(movieService);
    }

    @Test
    public void testGetMovies200Ok(){
        when(movieService.getAllMovies()).thenReturn(testMovies);
        Collection<Movie> returnedMovies= movieController.getMovies(null);
        verify(movieService, times(1)).getAllMovies();
        verifyNoMoreInteractions(movieService);
        assertEquals(testMovies,returnedMovies);
    }
}