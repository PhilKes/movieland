package com.phil.movieland.rest;

import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService=reservationService;
    }

    @GetMapping
    public String getReservations(
            @RequestParam(value="userName",required=true)String userName,
            Model model){
        List<Reservation> userReservations= reservationService.getReservationsOfUsername(userName);
        model.addAttribute("userReservations",userReservations);
        return "reservations";
    }
}
