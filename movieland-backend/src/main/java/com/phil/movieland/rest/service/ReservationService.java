package com.phil.movieland.rest.service;

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


    public Reservation saveReservation(Reservation reservation, List<Seat> seats) {
        /** Check if seats are already taken*/
        List<Reservation> reservations=reservationRepository.findAllByShowId(reservation.getShowId());
        for(Reservation res : reservations) {
            List<Seat> seatList=seatRepository.findAllByResId(res.getResId());
            for(Seat reserved : seatList) {
                if(seats.stream().anyMatch(selected -> reserved.getNumber()==selected.getNumber())) {
                    return null;
                }
            }
        }

        Reservation result=reservationRepository.save(reservation);
        seats.stream().forEach(seat -> {
            seat.setResId(result.getResId());
            seatRepository.save(seat);
        });
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

    public List<Seat> getAllSeatsOfShow(Long showId) {
        return seatRepository.findSeatsOfShow(showId);
    }



    public void deleteAll() {
        List<Reservation> reservations=reservationRepository.findAll();
        reservations.forEach(reservation -> seatRepository.deleteAllByResId(reservation.getResId()));
        reservationRepository.deleteAll();
    }

    public List<Reservation> getAllReservationsOfUser(Long userId) {
        return reservationRepository.findAllByUserId(userId).subList(0, 6);
    }


    public void saveReservationsWithSeats(List<StatisticsService.ReservationWithSeats> reservations) {
        reservations.stream().forEach(res -> saveReservation(res.getReservation(), res.getSeats()));
    }

    /**
     * Return if seatList is available for show
     */
    //TODO REPLACE WITH SQL STATEMENT
    public boolean areSeatsAvailable(long showId, List<Seat> seatList) {
       /* List<Reservation> reservations= reservationRepository.findAllByShowId(showId);
        for(Reservation res: reservations){
            List<Seat> takenSeats=seatRepository.findAllByResId(res.getResId());
            for(Seat takenSeat: takenSeats){
                *//** Return false if takenSeat matches any in the list*//*
                if(seatList.stream().anyMatch(s-> s.getNumber()==takenSeat.getNumber()))
                    return false;
            }
        }
        return true;*/
        for(Seat seat : seatList) {
            if(!seatRepository.findSeatDuplicates(seat.getNumber(), showId).isEmpty()) {
                System.out.println("Seat taken("+seat.getNumber()+",show: "+showId+")");
                return false;
            }
        }
        return true;
    }


    /**
     * Returns amount of deleted reservations
     */
    public long deleteReservationsOfShows(List<Long> showIds) {
        return reservationRepository.deleteAllByShowIdIn(showIds);
    }
}
