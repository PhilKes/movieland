package com.phil.movieland.rest;

import com.phil.movieland.auth.jwt.entity.UserPrincipal;
import com.phil.movieland.auth.jwt.util.CurrentUser;
import com.phil.movieland.data.BetweenDatesRequest;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.request.ReservationRequest;
import com.phil.movieland.service.ReservationService;
import com.phil.movieland.service.StatisticsService;
import com.phil.movieland.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/*TODO Current Movies (amnt), weekly income,
generate Shows (from until date) + Reservations
* */


@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService=statisticsService;
    }

  /*  @GetMapping("/reservations")
    public List<?> getReservations() {
        List<Reservation> userReservations=reservationService.getAllReservations();
        return userReservations;
    }

    @GetMapping("/reservations/show/{showId}")
    List<Reservation> getReservationsofShow(@PathVariable Long showId) {
        return reservationService.getAllReservationsOfShow(showId);
    }*/

    @PostMapping("/shows")
    public ResponseEntity<?> generateShows(@RequestBody BetweenDatesRequest datesRequest) throws URISyntaxException {
        Calendar from= Calendar.getInstance();
        from.setTime(datesRequest.getFrom());
        from.set(Calendar.HOUR,0);
        from.set(Calendar.MINUTE,0);
        from.set(Calendar.SECOND,0);
        from.set(Calendar.MILLISECOND,0);
        Calendar until= Calendar.getInstance();
        until.setTime(datesRequest.getUntil());
        until.set(Calendar.HOUR,23);
        until.set(Calendar.MINUTE,59);
        until.set(Calendar.SECOND,59);
        if(from.after(until))
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        statisticsService.generateShowsBetween(from.getTime(),until.getTime());
        return ResponseEntity.created(new URI("/api/shows"))
                .body("Created shows from "+ from.getTime()+" until "+until.getTime());
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> generateReservations(@RequestBody BetweenDatesRequest datesRequest) throws URISyntaxException {
        Calendar from= Calendar.getInstance();
        from.setTime(datesRequest.getFrom());
        from.set(Calendar.HOUR,0);
        from.set(Calendar.MINUTE,0);
        from.set(Calendar.SECOND,0);
        from.set(Calendar.MILLISECOND,0);
        Calendar until= Calendar.getInstance();
        until.setTime(datesRequest.getUntil());
        until.set(Calendar.HOUR,23);
        until.set(Calendar.MINUTE,59);
        until.set(Calendar.SECOND,59);
        if(from.after(until))
            return ResponseEntity.badRequest().body("From Date must be earlier than until Date!");
        statisticsService.generateReservationsBetween(from.getTime(),until.getTime());
        return ResponseEntity.created(new URI("/api/reservations"))
                .body("Created reservations from "+ from.getTime()+" until "+until.getTime());
    }

}
