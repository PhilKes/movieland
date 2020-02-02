package com.phil.movieland.web;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.service.MovieService;
import com.phil.movieland.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/movies")
public class MovieController {
    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService=movieService;
    }

    @GetMapping
    public String getMovies(
            @RequestParam(value="name",required=false)String search,
            Model model){
        List<Movie> movies= null;
        if(null==search) {
            System.out.println("No query entered");
            movies=movieService.getAllMovies();
        }else{
            System.out.println("Searched for: "+search);
            movies=movieService.queryAllMovies(search);
        }
       /* Model can be accessed from thymeleaf in .html*/
        model.addAttribute("movies",movies);
        //model.addAttribute("movieService",movieService);
        return "movies";
    }
}
