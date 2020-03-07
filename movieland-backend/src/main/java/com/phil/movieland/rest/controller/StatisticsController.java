package com.phil.movieland.rest.controller;

import com.phil.movieland.rest.request.BetweenDatesRequest;
import com.phil.movieland.rest.request.GenerateRequest;
import com.phil.movieland.rest.request.GenerateReservationRequest;
import com.phil.movieland.rest.service.StatisticsService;
import com.phil.movieland.tasks.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Calendar;
import java.util.Date;


@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/statistics")
/** Controller for Statistics API to generate/calculate Summaries*/
public class StatisticsController {
    private final StatisticsService statisticsService;
    private final TaskService taskService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService, TaskService taskService) {
        this.statisticsService=statisticsService;
        this.taskService=taskService;
    }

    @PostMapping("/shows")
    public ResponseEntity<?> generateShows(@RequestBody GenerateRequest generateRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(generateRequest.getFrom(), true);
        Date end=getDateFormDayStartOrEnd(generateRequest.getUntil(), false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        int taskId;
        if(generateRequest.getMoviesPerDay()==null || generateRequest.getShowsPerMovie()==null) {
            taskId=taskService.execute(statisticsService.generateShowsBetweenTask(start, end));
        }
        else {
            taskId=taskService.execute(statisticsService.generateShowsBetweenTask(
                    start, end, generateRequest.getMoviesPerDay(), generateRequest.getShowsPerMovie()));
        }
        System.out.println("Task " + taskId + " posted for execution");
        return ResponseEntity.created(new URI("/api/task/" + taskId))
                .body("Posted GenerateShows Task (taskId: " + taskId + ")");
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> generateReservations(@RequestBody GenerateReservationRequest resRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(resRequest.getFrom(), true);
        Date end=getDateFormDayStartOrEnd(resRequest.getUntil(), false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        int taskId;
        taskId=taskService.execute(statisticsService.generateReservationsBetweenTask(start, end, resRequest.getResPerShow()));
        return ResponseEntity.created(new URI("/api/task/" + taskId))
                .body("Posted GenerateReservation Task (taskId: " + taskId + ")");
    }

  /*  @PostMapping("/shows")
    public ResponseEntity<?> generateShows(@RequestBody GenerateRequest datesRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(datesRequest.getFrom(),true);
        Date end= getDateFormDayStartOrEnd(datesRequest.getUntil(),false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }

        statisticsService.generateShowsBetween(start, end);

        return ResponseEntity.created(new URI("/api/shows"))
                .body("Created shows from " + start + " until " + end);
    }*/

    //TODO SPEED UP WITH SQL QUERIES
    /*@PostMapping("/reservations")
    public ResponseEntity<?> generateReservations(@RequestBody GenerateReservationRequest resRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(resRequest.getFrom(),true);
        Date end= getDateFormDayStartOrEnd(resRequest.getUntil(),false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        statisticsService.generateReservationsBetween(start, end,resRequest.getResPerShow());
        return ResponseEntity.created(new URI("/api/reservations"))
                .body("Created reservations from " + start+ " until " + end);
    }*/


    @GetMapping("/income")
    public Double getIncomeBetween(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value="from") Date from
            ,@DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value="until") Date until) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(from,true);
        Date end= getDateFormDayStartOrEnd(until,false);
        if(start.after(end)) {
            return 0.0;
        }
        return statisticsService.calculateIncomeBetween(start, end);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public StatisticsService.Statistics getSummaryBetween(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value="from") Date from
            , @DateTimeFormat(pattern="yyyy-MM-dd")
            @RequestParam(value="until") Date until) {
        Date start=getDateFormDayStartOrEnd(from,true);
        Date end= getDateFormDayStartOrEnd(until,false);
        if(start.after(end)) {
            return new StatisticsService.Statistics();
        }
        StatisticsService.Statistics stats=statisticsService.calculateStatistics(start, end);
        return stats;
    }

    @Transactional(propagation=Propagation.REQUIRES_NEW)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/statistics")
    public ResponseEntity<?> deleteStatistics(
            @DateTimeFormat(pattern="yyyy-MM-dd")
            @RequestParam(value="from") Date from
            , @DateTimeFormat(pattern="yyyy-MM-dd")
            @RequestParam(value="until") Date until) {
        Date start=getDateFormDayStartOrEnd(from, true);
        Date end=getDateFormDayStartOrEnd(until, false);
        statisticsService.deleteStatisticsBetween(start, end);
        return ResponseEntity.ok().build();
    }

    @PostConstruct
    public void init() {
        System.out.println("Generating initial 7 Day summary");
        Date today=new Date();
        Calendar lastWeek=Calendar.getInstance();
        lastWeek.setTime(today);
        lastWeek.add(Calendar.DATE, -7);
        getSummaryBetween(lastWeek.getTime(), today);

    }


    public Date getDateFormDayStartOrEnd(Date date, boolean startEnd){
        Calendar calendar=Calendar.getInstance();
        calendar.setTime(date);
        if(startEnd) {
            calendar.set(Calendar.HOUR, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
        }else {
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
        }
        return calendar.getTime();
    }
}
