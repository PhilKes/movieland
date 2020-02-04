package com.phil.movieland.web;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.service.MovieService;
import com.phil.movieland.service.MovieShowService;
import com.phil.movieland.service.ReservationService;
import com.phil.movieland.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
            @RequestParam(value="name",required=false)String search,
            @RequestParam(value="date",required=false)String dateString){
        List<Movie> movies= null;
        if(dateString!=null){
            Date date= DateUtils.createDateFromDateString(dateString);
            System.out.println("Query for "+date);
        }
        if(null==search) {
            System.out.println("No query entered");
            movies=movieService.getAllMovies();
        }else{
            System.out.println("Searched for: "+search);
            movies=movieService.queryAllMovies(search);
        }
        return movies;
    }

    @GetMapping("/movie/{id}")
    ResponseEntity<Movie> getMovie(@PathVariable Long id) {
        Optional<Movie> movie = movieService.queryMovie(id);
        return movie.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/movie")
    ResponseEntity<Movie> createMovie(@RequestBody Movie movie) throws URISyntaxException {
        Movie result = movieService.saveMovie(movie);
        return ResponseEntity.created(new URI("/api/movie/" + result.getMovId()))
                .body(result);
    }
    
    @PutMapping("/movie/{id}")
    ResponseEntity<Movie> updateGroup(@Valid @RequestBody Movie movie) {
        Movie result = movieService.saveMovie(movie);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/movie/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        movieService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
