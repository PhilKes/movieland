package com.phil.movieland.rest.controller;

import static java.util.stream.Collectors.groupingBy;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.rest.service.MovieShowService;
import com.phil.movieland.utils.DateUtils;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for MovieShows
 */
@RestController
@RequestMapping("/api/shows")
public class MovieShowController {
    private final MovieShowService movieShowService;
    private final MovieService movieService;
    private Logger log=LoggerFactory.getLogger(MovieShowController.class);

    @Autowired
    public MovieShowController(MovieShowService movieShowService, MovieService movieService) {
        this.movieShowService=movieShowService;
        this.movieService=movieService;
    }

    @GetMapping
    public Collection<MovieShow> getMoviesShows(
            @RequestParam(value="date", required=true) String dateString) {
        List<MovieShow> shows=null;
        Date date=DateUtils.createDateFromDateString(dateString);
        shows=movieShowService.getShowsForDate(date, false);
        return shows;
    }

    @GetMapping("/infos")
    public Collection<MovieShowInfo> getMoviesShowsInfo(
            @RequestParam(value="date", required=true) @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) Date date) {
        log.info("Query for " + date);
        List<MovieShow> shows=movieShowService.getShowsForDate(date, false);
        Map<Long, List<MovieShow>> showMap=shows.stream().collect(groupingBy(MovieShow::getMovId));
        List<Movie> movies=movieService.queryMoviesByIds(new ArrayList<>(showMap.keySet()));
        List<MovieShowInfo> showInfos=new ArrayList<>();
        movies.forEach(movie -> {
            MovieShowInfo info=new MovieShowInfo()
                    .setMovId(movie.getMovId())
                    .setName(movie.getName())
                    .setPosterUrl(movie.getPosterUrl())
                    .setDate(movie.getDate())
                    .setShows(showMap.get(movie.getMovId()));
            showInfos.add(info);
        });
        return showInfos;
    }

    public class MovieShowInfo {
        Long movId;
        String name;
        @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)
        Date date;
        String posterUrl;

        List<MovieShow> shows;

        public MovieShowInfo() {
        }

        public Long getMovId() {
            return movId;
        }

        public MovieShowInfo setMovId(Long movId) {
            this.movId=movId;
            return this;
        }

        public String getName() {
            return name;
        }

        public MovieShowInfo setName(String name) {
            this.name=name;
            return this;

        }

        public Date getDate() {
            return date;
        }

        public MovieShowInfo setDate(Date date) {
            this.date=date;
            return this;

        }

        public String getPosterUrl() {
            return posterUrl;
        }

        public MovieShowInfo setPosterUrl(String posterUrl) {
            this.posterUrl=posterUrl;
            return this;

        }

        public List<MovieShow> getShows() {
            return shows;
        }

        public MovieShowInfo setShows(List<MovieShow> shows) {
            this.shows=shows;
            return this;
        }
    }


    @GetMapping("/movies/{id}")
    public ResponseEntity<Collection<MovieShow>> getMovieShows(@PathVariable Long id,
                                                               @RequestParam(value="date", required=false) String dateString) {
        List<MovieShow> shows=null;
        Date date=dateString==null ? new Date() : DateUtils.createDateFromDateString(dateString);
        Optional<Movie> movie=movieService.queryMovie(id);
        if(!movie.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        //shows=movieShowService.getShowsForMovieDate(movie.get(),dateString);
        shows=movieShowService.getMovieShowsForWeekOf(movie.get(), date);
        return ResponseEntity.ok(shows);
    }

    @GetMapping("/week")
    public Collection<MovieShow> getMovieShowsWeek() {
        List<MovieShow> shows=null;
        shows=movieShowService.getShowsForWeekOf(new Date());
        return shows;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieShow> getShow(@PathVariable Long id) {
        Optional<MovieShow> show=movieShowService.queryShow(id);
        return show.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MovieShow> postMovieShow(@RequestBody MovieShow show) throws URISyntaxException {
        MovieShow result=movieShowService.saveShow(show);
        return ResponseEntity.created(new URI("/api/show/" + result.getShowId()))
                .body(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    ResponseEntity<MovieShow> updateShow(@Valid @RequestBody MovieShow show) {
        MovieShow result=movieShowService.saveShow(show);
        return ResponseEntity.ok().body(result);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShow(@PathVariable Long id) {
        movieShowService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> deleteShows(@RequestParam(value="showIds", required=false) List<Long> showIds) {
        if(showIds==null) {
            movieShowService.deleteAll();
        }else{
            movieShowService.deleteShowsByIds(showIds);
        }
        return ResponseEntity.ok().build();
    }
}
