package com.phil.movieland.rest;

import com.phil.movieland.auth.jwt.entity.UserPrincipal;
import com.phil.movieland.auth.jwt.util.CurrentUser;
import com.phil.movieland.data.UserSummary;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.request.ReservationRequest;
import com.phil.movieland.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService=reservationService;
    }

    @GetMapping("/reservations")
    public List<?> getReservations() {
        List<Reservation> userReservations=reservationService.getAllReservations();
        return userReservations;
    }

    @GetMapping("/reservations/show/{showId}")
    List<Reservation> getReservationsofShow(@PathVariable Long showId) {
        return reservationService.getAllReservationsOfShow(showId);
    }

    @PostMapping("/reservation")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest,
                                               @CurrentUser UserPrincipal currentUser) throws URISyntaxException {
        Reservation reservation=new Reservation();
        reservation.setShowId(reservationRequest.getShow_id());
        reservation.setUserId(currentUser.getId());
        //TODO CHECK IF RESERVATION OR SEATS ARE ALREADY IN DATABASE
        Reservation result=reservationService.saveReservation(reservation, reservationRequest.getSeats());
        if(result==null) {
            return ResponseEntity.badRequest()
                    .body("Seats already taken!");
        }
        return ResponseEntity.created(new URI("/api/reservation/" + result.getResId()))
                .body(result);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/reservations")
    public ResponseEntity<?> deleteReservations() {
        reservationService.deleteAll();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reservations/me")
    @PreAuthorize("hasRole('USER')")
    public List<Reservation> getCurrentUsersReservations(@CurrentUser UserPrincipal currentUser) {
        //UserSummary userSummary=new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return reservationService.getAllReservationsOfUser(currentUser.getId());
    }
}
