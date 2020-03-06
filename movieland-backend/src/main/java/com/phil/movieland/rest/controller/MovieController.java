package com.phil.movieland.rest.controller;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.rest.service.MovieShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Slice;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.websocket.server.PathParam;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/** REST Controller for Movies*/
@RestController
@RequestMapping("/api")
public class MovieController {
    private final MovieService movieService;
    private final MovieShowService movieShowService;

    @Autowired
    public MovieController(MovieService movieService,MovieShowService movieShowService) {
        this.movieService=movieService;
        this.movieShowService=movieShowService;
    }

    @GetMapping("/movies")
    public Collection<Movie> getMovies(
            @RequestParam(value="name",required=false)String search){
        List<Movie> movies= null;
        if(null==search) {
            //TODO PAGING
            System.out.println("No query entered");
            movies=movieService.getAllMovies();
        }else{
            System.out.println("Searched for: "+search);
            movies=movieService.queryAllMovies(search);
        }
        return movies;
    }

    @GetMapping("/movies/page/{page}")
    public ResponseEntity<Collection<Movie>> getMoviesPaged(
            @RequestParam(value="name", required=false) String search,
            @PathVariable(value="page") Integer page) {
        HttpHeaders responseHeaders=new HttpHeaders();
        Slice<Movie> slice;
        if(null==search) {
            System.out.println("No query entered");
            slice=movieService.getAllMoviesPaged(page, 10);

        }
        else {
            System.out.println("Searched for: " + search);
            slice=movieService.queryAllMoviesPaged(search, page, 10);
        }
        if(slice.hasNext()) {
            responseHeaders.set("hasMore", "true");
        }
        else {
            responseHeaders.set("hasMore", "false");
        }
        return ResponseEntity.ok().headers(responseHeaders).body(slice.getContent());
    }

    @GetMapping("/movies/ids")
    public Map<Long, Movie> getMoviesList(
            @RequestParam(value="ids") List<Long> movIds) {
        List<Movie> movies=movieService.queryMoviesByIds(movIds);
        Map<Long, Movie> moviesMap=movies.stream()
                .collect(Collectors.toMap(Movie::getMovId, Function.identity()));
        System.out.println("Movies by ids:");
        System.out.println(moviesMap);
        return moviesMap;
    }


    @GetMapping("/movies/tmdb")
    public Collection<Movie> getTmdbMovies(
            @RequestParam(value="name",required=false)String search){
        List<Movie> movies= null;
        if(null==search) {
            System.out.println("No query entered");
            movies= new ArrayList<>();
        }else{
            System.out.println("Searched for: "+search);
            movies=movieService.queryTmdbMovies(search);
        }
        return movies;
    }

    @GetMapping("/movies/tmdb/top")
    public Collection<Movie> getTmdbTopMovies(){
        return movieService.querTmdbTop10Movies();
    }

    @GetMapping("/movies/tmdb/images")
    public HashMap<Long, String> getTmdbImages(@RequestParam(value="ids") List<Long> movIds) {
        HashMap<Long, String> backdrops=new HashMap<>();
        System.out.println("Requesting backdrops...");
        for(Long movId : movIds) {
            //System.out.println("Mov: "+movId);
            backdrops.put(movId, movieService.getBackdrop(movId));
        }
        return backdrops;
    }

    @GetMapping("/movie/{id}")
    ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        Optional<Movie> movie = movieService.queryMovie(id);
        return movie.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/movie/trailer/{movId}")
    ResponseEntity<String> getMovieTrailer(@PathVariable Long movId) {
        Optional<String> trailer=movieService.getTrailer(movId);
        return trailer.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/movie")
    ResponseEntity<?> createMovie(@RequestBody Movie movie) throws URISyntaxException {
        try {
            Movie result=movieService.saveMovie(movie);
            return ResponseEntity.created(new URI("/api/movie/" + result.getMovId()))
                    .body(result);
        }catch(Exception e){
            e.getMessage();
            return ResponseEntity.badRequest().body("{\"msg\":\""+e.getMessage()+"\"}");
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/movie/{id}")
    ResponseEntity<Movie> updateMovie(@Valid @RequestBody Movie movie) {
        Movie result =null;
        try {
            result=movieService.saveMovie(movie);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok().body(result);
    }

    //TODO PREAUTHORIZATION??
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/movie/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
