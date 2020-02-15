package com.phil.movieland.service;

import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.data.repository.ReservationRepository;
import com.phil.movieland.data.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReservationService {

    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(SeatRepository seatRepository, ReservationRepository reservationRepository) {
        this.seatRepository=seatRepository;
        this.reservationRepository=reservationRepository;
    }


    public Reservation saveReservation(Reservation reservation, List<Integer> seats) {
        /** Check if seats are already taken*/
        List<Reservation> reservations=reservationRepository.findAllByShowId(reservation.getShowId());
        for(Reservation res : reservations) {
            List<Seat> seatList=seatRepository.findAllByResId(res.getResId());
            for(Seat reserved : seatList) {
                if(seats.stream().anyMatch(selected -> reserved.getNumber()==selected)) {
                    return null;
                }
            }
        }

        Reservation result=reservationRepository.save(reservation);
        seats.stream().map(number -> {
            Seat seat=new Seat();
            seat.setNumber(number);
            seat.setResId(result.getResId());
            return seat;
        }).forEach(seat -> seatRepository.save(seat));
        return result;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();

    }

    public List<Reservation> getAllReservationsOfShow(long showId) {
        return reservationRepository.findAllByShowId(showId);
    }

    public List<Seat> getAllSeatsOfReservation(Long resId) {
        return seatRepository.findAllByResId(resId);
    }

    public void deleteAll() {
        List<Reservation> reservations=reservationRepository.findAll();
        reservations.forEach(reservation -> seatRepository.deleteAllByResId(reservation.getResId()));
        reservationRepository.deleteAll();
    }
}
