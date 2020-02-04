package com.phil.movieland.web;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.service.MovieService;
import com.phil.movieland.service.MovieShowService;
import com.phil.movieland.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MovieShowController {
    private final MovieShowService movieShowService;

    @Autowired
    public MovieShowController(MovieShowService movieShowService) {
        this.movieShowService=movieShowService;
    }

    @GetMapping("/shows")
    public Collection<MovieShow> getMovieShows(
            @RequestParam(value="date",required=true)String dateString){
        List<MovieShow> shows= null;
        Date date= DateUtils.createDateFromDateString(dateString);
        System.out.println("Query for "+date);
        shows= movieShowService.getShowsForDate(date);
        return shows;
    }


    @PostMapping("/show")
    public ResponseEntity<MovieShow> postMovieShow(@RequestBody MovieShow show) throws URISyntaxException {
        System.out.println("Post Show( MovId:"+show.getMovId()+" Date: "+show.getDate());
       MovieShow result= movieShowService.saveShow(show);
        return ResponseEntity.created(new URI("/api/show/" + result.getShowId()))
                .body(result);
    }

    @GetMapping("/show/{id}")
    ResponseEntity<MovieShow> getShow(@PathVariable Long id) {
        Optional<MovieShow> show = movieShowService.queryShow(id);
        return show.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/show/{id}")
    ResponseEntity<MovieShow> updateShow(@Valid @RequestBody MovieShow show) {
        MovieShow result = movieShowService.saveShow(show);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/show/{id}")
    public ResponseEntity<?> deleteShow(@PathVariable Long id) {
        movieShowService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/shows")
    public ResponseEntity<?> deleteShows() {
        movieShowService.deleteAllMovieShows();
        return ResponseEntity.ok().build();
    }
}
