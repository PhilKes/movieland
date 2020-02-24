package com.phil.movieland.rest.controller;

import com.phil.movieland.rest.request.BetweenDatesRequest;
import com.phil.movieland.rest.service.StatisticsService;
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

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService=statisticsService;
    }

    @PostMapping("/shows")
    public ResponseEntity<?> generateShows(@RequestBody BetweenDatesRequest datesRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(datesRequest.getFrom(),true);
        Date end= getDateFormDayStartOrEnd(datesRequest.getUntil(),false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        statisticsService.generateShowsBetween(start, end);
        return ResponseEntity.created(new URI("/api/shows"))
                .body("Created shows from " + start + " until " + end);
    }


    //TODO SPEED UP WITH SQL QUERIES
    @PostMapping("/reservations")
    public ResponseEntity<?> generateReservations(@RequestBody BetweenDatesRequest datesRequest) throws URISyntaxException {
        Date start=getDateFormDayStartOrEnd(datesRequest.getFrom(),true);
        Date end= getDateFormDayStartOrEnd(datesRequest.getUntil(),false);
        if(start.after(end)) {
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        }
        statisticsService.generateReservationsBetween(start, end);
        return ResponseEntity.created(new URI("/api/reservations"))
                .body("Created reservations from " + start+ " until " + end);
    }

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
        return statisticsService.calculateStatistics(start,end);
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
