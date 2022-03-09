package com.phil.movieland.rest.controller;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * REST Controller for Movies
 */
@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private final MovieService movieService;
    private Logger log = LoggerFactory.getLogger(MovieController.class);

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public Collection<Movie> getMovies(@RequestParam(value = "name", required = false) String search) {
        List<Movie> movies = null;
        if (null == search) {
            //TODO PAGING
            movies = movieService.getAllMovies();
        } else {
            movies = movieService.queryAllMovies(search);
        }
        return movies;
    }

    @GetMapping("/page/{page}")
    public ResponseEntity<Collection<Movie>> getMoviesPaged(@RequestParam(value = "name", required = false) String search,
                                                            @PathVariable(value = "page") Integer page) {
        HttpHeaders responseHeaders = new HttpHeaders();
        Slice<Movie> slice;
        if (null == search) {
            slice = movieService.getAllMoviesPaged(page, 10);

        } else {
            slice = movieService.queryAllMoviesPaged(search, page, 10);
        }
        if (slice.hasNext()) {
            responseHeaders.set("hasMore", "true");
        } else {
            responseHeaders.set("hasMore", "false");
        }
        return ResponseEntity.ok().headers(responseHeaders).body(slice.getContent());
    }

    @GetMapping("/ids")
    public Map<Long, Movie> getMoviesList(@RequestParam(value = "ids") List<Long> movIds) {
        List<Movie> movies = movieService.queryMoviesByIds(movIds);
        Map<Long, Movie> moviesMap = movies.stream()
                .collect(Collectors.toMap(Movie::getMovId, Function.identity()));
        log.info("Map of Movies by ids: {}", Utils.printMap(moviesMap));
        return moviesMap;
    }


    @GetMapping("/tmdb")
    public Collection<Movie> getTmdbMovies(@RequestParam(value = "name", required = false) String search) {
        List<Movie> movies = null;
        if (null == search) {
            movies = new ArrayList<>();
        } else {
            movies = movieService.queryTmdbMovies(search);
        }
        return movies;
    }

    @GetMapping("/tmdb/top")
    public Collection<Movie> getTmdbTopMovies() {
        return movieService.queryTmdbTop10Movies();
    }

    @GetMapping("/tmdb/images")
    public HashMap<Long, String> getTmdbImages(@RequestParam(value = "ids") List<Long> movIds) {
        HashMap<Long, String> backdrops = new HashMap<>();
        log.info("Fetching Backdrops for Movies with ids: {}", Utils.joinToStringList(movIds));
        for (Long movId : movIds) {
            //log.info("Mov: "+movId);
            backdrops.put(movId, movieService.getBackdrop(movId));
        }
        return backdrops;
    }

    @GetMapping("/{id}")
    ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        Optional<Movie> movie = movieService.queryMovie(id);
        return movie.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/trailer/{movId}")
    ResponseEntity<String> getMovieTrailer(@PathVariable Long movId) {
        Optional<String> trailer = movieService.getTrailer(movId);
        return trailer.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    ResponseEntity<?> createMovie(@RequestBody Movie movie) throws URISyntaxException {
        try {
            Movie result = movieService.saveMovie(movie);
            return ResponseEntity.created(new URI("/api/movie/" + result.getMovId()))
                    .body(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"msg\":\"" + e.getMessage() + "\"}");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<Movie> updateMovie(@Valid @RequestBody Movie movie) {
        Movie result = null;
        try {
            result = movieService.saveMovie(movie);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body(result);
    }

    //TODO PREAUTHORIZATION??
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> deleteAllMovies() {
        movieService.deleteAll();
        return ResponseEntity.ok().build();
    }

}
