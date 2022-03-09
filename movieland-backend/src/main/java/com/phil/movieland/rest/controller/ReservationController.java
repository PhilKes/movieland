package com.phil.movieland.rest.controller;

import com.phil.movieland.auth.jwt.entity.UserPrincipal;
import com.phil.movieland.auth.jwt.util.CurrentUser;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.rest.request.ReservationRequest;
import com.phil.movieland.rest.request.ReservationValidationRequest;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.rest.service.MovieShowService;
import com.phil.movieland.rest.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final MovieService movieService;
    private final MovieShowService movieShowService;

    private Logger log=LoggerFactory.getLogger(ReservationController.class);

    @Autowired
    public ReservationController(ReservationService reservationService,
                                 MovieService movieService, MovieShowService movieShowService) {
        this.reservationService=reservationService;
        this.movieService=movieService;
        this.movieShowService=movieShowService;
    }

    @PreAuthorize("hasRole('CASHIER')")
    @GetMapping
    public List<?> getReservations() {
        return reservationService.getAllReservations();
    }

    //TODO Do not expose other reservation to user
    @GetMapping("/shows/{showId}")
    List<Reservation> getReservationsofShow(@PathVariable Long showId) {
        return reservationService.getAllReservationsOfShow(showId);
    }

    @PreAuthorize("hasRole('CASHIER')")
    @GetMapping("/{resId}")
    public ResponseEntity<?> getReservation(@PathVariable(name="resId") Long resId) {
        Optional<Reservation> reservation=reservationService.getReservationById(resId);
        if(reservation.isEmpty()) {
            return ResponseEntity.badRequest().body("Reservation not found");
        }
        return ResponseEntity.ok(reservation.get());
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest reservationRequest,
                                               @CurrentUser UserPrincipal currentUser) throws URISyntaxException {
        Reservation reservation=new Reservation();
        reservation.setShowId(reservationRequest.getShow_id());
        reservation.setUserId(currentUser.getId());
        Reservation result=reservationService.saveReservation(reservation, reservationRequest.getSeats());
        if(result==null) {
            return ResponseEntity.badRequest()
                    .body("Seats already taken!");
        }
        return ResponseEntity.created(new URI("/api/reservation/" + result.getResId()))
                .body(result);
    }

    //TODO Cashier Page to scan and validate Reservations
    @PreAuthorize("hasRole('CASHIER')")
    @PostMapping("/validate")
    public ResponseEntity<?> postReservationValidation(@RequestBody ReservationValidationRequest reservationRequest,
                                                       @CurrentUser UserPrincipal cashierUser) throws URISyntaxException {
        Optional<Reservation> reservation=reservationService.getReservationById(reservationRequest.getResId());
        if(reservation.isEmpty()) {
            return ResponseEntity.badRequest().body("Reservation for Validation not found");
        }
        reservationRequest.setCashierId(cashierUser.getId());
        reservation.get().setValidated(reservationRequest.isValidate());
        reservation.get().setMethod(reservationRequest.getMethod());
        reservation.get().setCashierId(reservationRequest.getCashierId());
        log.info("Validating Reservation: " + reservation.get().getResId());
        Reservation result=reservationService.updateReservation(reservation.get());

        return ResponseEntity.created(new URI("/api/reservation/" + result.getResId()))
                .body(result);
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<?> deleteReservations() {
        reservationService.deleteAll();
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/new")
    public List<Reservation> getCurrentUsersNewReservations(@CurrentUser UserPrincipal currentUser) {
        //UserSummary userSummary=new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        return reservationService.getAllReservationsOfUser(currentUser.getId(), true);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/info")
    public ResponseEntity<?> getCurrentUsersReservationsInfo(@CurrentUser UserPrincipal currentUser) {
        List<Reservation> reservations=reservationService.getAllReservationsOfUser(currentUser.getId(), false);
        List<ReservationService.ReservationInfo> infos;
        try {
            infos=getReservationInfos(reservations);
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(infos);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me/id/{resId}")
    public ResponseEntity<?> getCurrentUserReservationInfo(@CurrentUser UserPrincipal currentUser,
                                                           @PathVariable(name="resId") Long resId) {
        //UserSummary userSummary=new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
        Optional<Reservation> res=reservationService.getReservationInfoOfUser(currentUser.getId(), resId);
        if(res.isEmpty()) {
            return ResponseEntity.badRequest().body("Reservation not found");
        }
        ReservationService.ReservationInfo info;
        try {
            info=getReservationInfo(res.get());
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        return ResponseEntity.ok().body(info);
    }

    private ReservationService.ReservationInfo getReservationInfo(Reservation res) throws Exception {
        ReservationService.ReservationInfo info=new ReservationService.ReservationInfo();
        info.setReservation(res);
        Optional<MovieShow> show=movieShowService.queryShow(res.getShowId());
        if(show.isEmpty()) {
            throw new Exception("Show of Reservation not found");
        }
        info.setMovieShow(show.get());
        Optional<Movie> movie=movieService.queryMovie(show.get().getMovId());
        if(movie.isEmpty()) {
            throw new Exception("Movie of Show not found");
        }
        info.setMovie(movie.get());
        info.setQRCodeURL("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + res.getResId());
        return info;
    }

    private List<ReservationService.ReservationInfo> getReservationInfos(List<Reservation> reservations) throws Exception {
        List<ReservationService.ReservationInfo> infos=new ArrayList<>();
        for(Reservation reservation : reservations) {
            infos.add(getReservationInfo(reservation));
        }
        return infos;
    }
}
