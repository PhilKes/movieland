package com.phil.movieland.rest.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.data.repository.ReservationRepository;
import com.phil.movieland.data.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(SeatRepository seatRepository, ReservationRepository reservationRepository) {
        this.seatRepository=seatRepository;
        this.reservationRepository=reservationRepository;
    }


    public Reservation updateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
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
        /**Calculate total Sum */
        double totalSum=seats.stream().mapToDouble(seat -> Seat.getPrice(seat.getType())).sum();
        reservation.setTotalSum(totalSum);

        Reservation result=reservationRepository.save(reservation);
        /** Store Seats */
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

    public Optional<Reservation> getReservationById(Long resId) {
        return reservationRepository.findById(resId);
    }


    public void deleteAll() {
        List<Reservation> reservations=reservationRepository.findAll();
        reservations.forEach(reservation -> seatRepository.deleteAllByResId(reservation.getResId()));
        reservationRepository.deleteAll();
    }

    public List<Reservation> getAllReservationsOfUser(Long userId, boolean futureReservations) {
        if(futureReservations) {
            return reservationRepository.findFutureAllByUserId(userId, new Date());
        }
        return reservationRepository.findAllByUserId(userId);
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

    public Optional<Reservation> getReservationInfoOfUser(Long userId, Long resId) {
        return reservationRepository.findByResIdAndUserId(resId, userId);
    }

    public static class ReservationInfo {
        private Reservation reservation;
        private MovieShow movieShow;
        private Movie movie;
        private String QRCodeURL;

        public Reservation getReservation() {
            return reservation;
        }

        public void setReservation(Reservation reservation) {
            this.reservation=reservation;
        }

        public MovieShow getMovieShow() {
            return movieShow;
        }

        public void setMovieShow(MovieShow movieShow) {
            this.movieShow=movieShow;
        }

        public Movie getMovie() {
            return movie;
        }

        public void setMovie(Movie movie) {
            this.movie=movie;
        }

        public String getQRCodeURL() {
            return QRCodeURL;
        }

        public void setQRCodeURL(String QRCodeURL) {
            this.QRCodeURL=QRCodeURL;
        }
    }
}
