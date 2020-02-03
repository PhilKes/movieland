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

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/movies/show")
public class MovieShowController {
    private final MovieShowService movieShowService;

    @Autowired
    public MovieShowController(MovieShowService movieShowService) {
        this.movieShowService=movieShowService;
    }

    @PostMapping
    public String postMovieShow(
            @RequestParam(value="_method",required=false)String method,
            /** POST Parameters*/
            @RequestParam(value="movieid",required=false)String movieid,
            @RequestParam(value="date",required=true)String date,
            @RequestParam(value="time",required=false)String time,
            @RequestParam(value="name",required=true)String name,

            /** DELETE Parameters*/
            @RequestParam(value="showid",required=false)Long showid,

            Model model,
            RedirectAttributes redirectAttributes){
        /** HTML Forms only support GET,POST*/
        if(method!=null && method.equals("DELETE")){
            if(showid!=null){
                deleteMovieShow(showid);
            }else{
                return ResponseEntity.badRequest().toString();
            }
        }else {
            Date showDate=DateUtils.createDateFromDateString(date);
            String[] times=time.split(":");
            showDate.setHours(Integer.parseInt(times[0]));
            showDate.setMinutes(Integer.parseInt(times[1]));
            movieShowService.postMovieShow(Long.parseLong(movieid), showDate);
        }
        redirectAttributes.addAttribute("name", name);
        redirectAttributes.addAttribute("date", date);
        return "redirect:/movies";
    }

    public void deleteMovieShow(Long showid){
        movieShowService.deleteMovieShow(showid);
    }
}
