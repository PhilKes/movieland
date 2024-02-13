package com.phil.movieland.rest.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.rest.MovielandTestApplication;
import com.phil.movieland.rest.service.MovieService;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = {MovieController.class}, excludeAutoConfiguration = {
    SecurityAutoConfiguration.class})
@ContextConfiguration(classes = {MovielandTestApplication.class})
public class MovieControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private MovieService movieService;

    private List<Movie> testMovies = Arrays.asList(createMovie("Movie 1", 1L),
        createMovie("Movie 2", 2L),
        createMovie("Movie 3", 3L),
        createMovie("Movie 4", 4L));


    private static Movie createMovie(String name, Long id) {
        Movie movie = new Movie();
        movie.setDate(new Date());
        movie.setMovId(id);
        movie.setName(name);
        movie.setLength(100L);
        movie.setDescription("A Movie");
        return movie;
    }


    @Test
    public void testGetAllMovies200Ok() throws Exception {
        when(movieService.getAllMovies()).thenReturn(testMovies);
        mvc.perform(MockMvcRequestBuilders.get("/api/movies"))
            .andDo(print())
            .andExpect(jsonPath("$", hasSize(4)))
            .andExpect(jsonPath("$[0].name").value("Movie 1"));
        verify(movieService, times(1)).getAllMovies();
        verifyNoMoreInteractions(movieService);
    }

    @Test
    public void testGetSearchMovies200Ok() throws Exception {
        when(movieService.queryAllMovies("Movie 1"))
            .thenReturn(testMovies.subList(0, 1));
        mvc.perform(MockMvcRequestBuilders.get("/api/movies")
                .param("name", "Movie 1"))
            .andDo(print())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].name").value("Movie 1"));
        verify(movieService, times(1)).queryAllMovies("Movie 1");
        verifyNoMoreInteractions(movieService);
    }

    @Test
    public void testGetMoviesPage200Ok() throws Exception {
        when(movieService.getAllMoviesPaged(1, 10)).thenReturn(new PageImpl<>(testMovies));
        mvc.perform(MockMvcRequestBuilders.get("/api/movies/page/1"))
            .andDo(print())
            .andExpect(jsonPath("$", hasSize(4)))
            .andExpect(header().string("hasMore", "false"))
            .andExpect(jsonPath("$[0].name").value("Movie 1"));
        verify(movieService, times(1)).getAllMoviesPaged(1, 10);
        verifyNoMoreInteractions(movieService);
    }

    @Test
    public void testGetMoviesByIds200Ok() throws Exception {
        List<Long> ids = List.of(1L, 2L);
        when(movieService.queryMoviesByIds(ids))
            .thenReturn(testMovies.subList(0, 2));
        mvc.perform(MockMvcRequestBuilders.get("/api/movies/ids")
                .param("ids", "1,2"))
            .andDo(print())
            .andExpect(jsonPath("$[\"1\"].name").value("Movie 1"))
            .andExpect(jsonPath("$[\"2\"].name").value("Movie 2"));
        verify(movieService, times(1)).queryMoviesByIds(ids);
        verifyNoMoreInteractions(movieService);
    }


    //...

}