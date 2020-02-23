package com.phil.movieland.rest.controller;

import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.rest.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SeatController {
    private final ReservationService reservationService;

    @Autowired
    public SeatController(ReservationService reservationService) {
        this.reservationService=reservationService;
    }

    @GetMapping("/seats/reservation/{resId}")
    List<Seat> getSeatsOfReservation(@PathVariable Long resId) {
        return reservationService.getAllSeatsOfReservation(resId);
    }

}
