package com.phil.movieland.web;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.service.MovieService;
import com.phil.movieland.service.MovieShowService;
import com.phil.movieland.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/movieshow")
public class MovieShowController {
    private final MovieShowService movieShowService;

    @Autowired
    public MovieShowController(MovieShowService movieShowService) {
        this.movieShowService=movieShowService;
    }

    @PostMapping
    public String postMovieShow(
            @RequestParam(value="movieid",required=true)String movieid,
            @RequestParam(value="date",required=true)String dateString,
            Model model){
        //TODO CHECK if movieid valid, date not already taken
        //TODO create new Show for movieid on dateString and save in repository
        //-> TODO reload
       /* List<Movie> movies= null;
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

        *//* Model can be accessed from thymeleaf in .html*//*
        model.addAttribute("movies",movies);
        //model.addAttribute("movieService",movieService);*/
        return "movies";
    }
}
