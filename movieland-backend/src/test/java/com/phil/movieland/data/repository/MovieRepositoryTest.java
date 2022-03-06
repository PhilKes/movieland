package com.phil.movieland.data.repository;

import com.phil.movieland.MovielandSpringApplication;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.utils.DateUtils;
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

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MovielandSpringApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MovieRepositoryTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MovieRepository movieRepository;

    private List<Movie> testMovies = Arrays.asList(createMovie("Movie 1"),
            createMovie("Movie 2"),
            createMovie("Movie 3"),
            createMovie("Movie 4"));

    private static Movie createMovie(String name) {
        Movie movie = new Movie();
        movie.setDate(new Timestamp(new Date().getTime()));
        movie.setName(name);
        movie.setLength(100L);
        movie.setDescription("A Movie");
        movie.setTmdbId(1L);
        return movie;
    }

    private static List<MovieDb> createTmdbMockMovies(List<Movie> movies){
        return movies.stream().map(movie -> {
            MovieDb movieDb= new MovieDb();
            movieDb.setTitle(movie.getName());
            movieDb.setOverview(movie.getDescription());
            movieDb.setPosterPath(movie.getPosterUrl());
            movieDb.setRuntime(movie.getLength().intValue());
            movieDb.setReleaseDate(DateUtils.getDateStringFromDate(movie.getDate()));
            return movieDb;
        }).collect(Collectors.toList());
    }

    @Before
    public void setUp() throws Exception {
    }

    @Test
    public void testSaveAndDelete(){
        Movie movie=createMovie("Test Movie");
        movie= movieRepository.save(movie);
        assertTrue(movieRepository.findById(movie.getMovId()).isPresent());
        movieRepository.delete(movie);
        assertTrue(movieRepository.findById(movie.getMovId()).isEmpty());
    }


    @Test
    public void testFindAllByOrderByName() {
       movieRepository.saveAll(testMovies);
       List<Movie> foundMovies=movieRepository.findAllByOrderByName();
        for (int movIdx = 0; movIdx < testMovies.size(); movIdx++) {
            Movie testMovie=testMovies.get(movIdx);
            Movie foundMovie=foundMovies.get(movIdx);
            assertEquals(testMovie.getName(),foundMovie.getName());
            assertEquals(testMovie.getDescription(),foundMovie.getDescription());

        }
       movieRepository.deleteAll(testMovies);
       assertEquals(0,movieRepository.findAllByOrderByName().size());
    }
}
