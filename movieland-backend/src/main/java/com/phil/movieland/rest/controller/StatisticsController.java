package com.phil.movieland.rest.controller;

import com.phil.movieland.data.entity.IntermediateStatistic;
import com.phil.movieland.rest.request.GenerateReservationRequest;
import com.phil.movieland.rest.request.GenerateShowRequest;
import com.phil.movieland.rest.service.StatisticsService;
import com.phil.movieland.rest.tasks.TaskService;
import com.phil.movieland.utils.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.*;


@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/statistics")
/** Controller for Statistics API to generate/calculate Summaries*/
public class StatisticsController {
    private final StatisticsService statisticsService;
    private final TaskService taskService;

    private Logger log = LoggerFactory.getLogger(StatisticsController.class);

    @Autowired
    public StatisticsController(StatisticsService statisticsService, TaskService taskService) {
        this.statisticsService = statisticsService;
        this.taskService = taskService;
    }

    /**
     * Post Generation execution to ThreadPool and return task reference
     */
    @PostMapping("/shows")
    public ResponseEntity<?> generateShows(@RequestBody GenerateShowRequest generateRequest) throws URISyntaxException {
        Date start = getDateFormDayStartOrEnd(generateRequest.getFrom(), true);
        Date end = getDateFormDayStartOrEnd(generateRequest.getUntil(), false);
        if (start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        int taskId;
        if (generateRequest.getShowsPerMovie() == null) {
            generateRequest.setShowsPerMovie(4);
        }
        if (generateRequest.getMoviesPerDay() == null) {
            generateRequest.setMoviesPerDay(4);
        }
        log.info("Creating Task 'GenerateShows'");
        taskId = taskService.execute(statisticsService.generateShowsBetweenTask(
                start, end, generateRequest.getMoviesPerDay(), generateRequest.getShowsPerMovie(), generateRequest.getMovIds()));
        log.info("Task '{}' was posted for execution", taskId);
        return ResponseEntity.created(new URI("/api/task/" + taskId))
                .body(taskId);
    }

    /**
     * Post Generation execution to ThreadPool and return task reference
     */
    @PostMapping("/reservations")
    public ResponseEntity<?> generateReservations(@RequestBody GenerateReservationRequest resRequest) throws URISyntaxException {
        Date start = getDateFormDayStartOrEnd(resRequest.getFrom(), true);
        Date end = getDateFormDayStartOrEnd(resRequest.getUntil(), false);
        if (start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        int taskId;
        log.info("Creating Task 'GenerateReservations'");
        taskId = taskService.execute(statisticsService.generateReservationsBetweenTask(start, end, resRequest.getResPerShow(), resRequest.getMovIds()));
        log.info("Task '{}' was posted for execution", taskId);
        return ResponseEntity.created(new URI("/api/task/" + taskId))
                .body(taskId);
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
            @RequestParam(value = "from") Date from
            , @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "until") Date until) throws URISyntaxException {
        Date start = getDateFormDayStartOrEnd(from, true);
        Date end = getDateFormDayStartOrEnd(until, false);
        if (start.after(end)) {
            return 0.0;
        }
        return statisticsService.calculateIncomeBetween(start, end);
    }

    @GetMapping("/inter")
    public List<IntermediateStatistic> getIntermediates(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "from") Date from
            , @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "until") Date until) throws URISyntaxException {
        Date start = getDateFormDayStartOrEnd(from, true);
        Date end = getDateFormDayStartOrEnd(until, false);
        if (start.after(end)) {
            return new ArrayList<>();
        }
        List<IntermediateStatistic> inter = statisticsService.getIntermediates(start, end);
        return inter;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public StatisticsService.Statistics getSummaryBetween(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "from") Date from
            , @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "until") Date until) {
        Date start = getDateFormDayStartOrEnd(from, true);
        Date end = getDateFormDayStartOrEnd(until, false);
        if (start.after(end)) {
            return new StatisticsService.Statistics();
        }
        StatisticsService.Statistics stats = statisticsService.calculateStatistics(start, end);
        return stats;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/statistics")
    public ResponseEntity<?> deleteStatistics(
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "from") Date from,
            @DateTimeFormat(pattern = "yyyy-MM-dd")
            @RequestParam(value = "until") Date until) {
        Date start = getDateFormDayStartOrEnd(from, true);
        Date end = getDateFormDayStartOrEnd(until, false);
        statisticsService.deleteStatisticsBetween(start, end);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/movie/{movId}")
    public ResponseEntity<?> getMovieStats(@DateTimeFormat(pattern = "yyyy-MM-dd")
                                           @RequestParam(value = "from", required = false) Date from,
                                           @DateTimeFormat(pattern = "yyyy-MM-dd")
                                           @RequestParam(value = "until", required = false) Date until,
                                           @RequestParam Boolean aggregated,
                                           @PathVariable Integer movId) {
        if (from == null || until == null) {
            until = new Date();
            Calendar lastWeek = Calendar.getInstance();
            lastWeek.setTime(until);
            lastWeek.add(Calendar.DATE, -7);
            from = lastWeek.getTime();
        }
        return ResponseEntity.ok(statisticsService.calculateMovieStats(movId, from, until, aggregated));
    }

   /* @PostConstruct
    public void init() {
        log.info("Generating initial 7 Day summary");
        Date today=new Date();
        Calendar lastWeek=Calendar.getInstance();
        lastWeek.setTime(today);
        lastWeek.add(Calendar.DATE, -7);
        getSummaryBetween(lastWeek.getTime(), today);
    }*/


    public Date getDateFormDayStartOrEnd(Date date, boolean startEnd) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        if (startEnd) {
            calendar.set(Calendar.HOUR, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            calendar.set(Calendar.HOUR_OF_DAY, 0);
        } else {
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
        }
        return calendar.getTime();
    }
}
