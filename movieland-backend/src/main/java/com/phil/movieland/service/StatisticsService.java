package com.phil.movieland.service;

import com.phil.movieland.auth.AuthenticationController;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.data.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StatisticsService {

    private final MovieShowService movieShowService;
    private final AuthenticationController authenticationController;
    private final MovieService movieService;
    private final SeatRepository seatRepository;
    private final ReservationService reservationService;

    @Autowired
    public StatisticsService(SeatRepository seatRepository, ReservationService reservationService,
                             MovieShowService movieShowService, MovieService movieService,
                             AuthenticationController authenticationController) {
        this.seatRepository=seatRepository;
        this.reservationService=reservationService;
        this.movieShowService=movieShowService;
        this.movieService=movieService;
        this.authenticationController=authenticationController;
    }


    public void generateShowsBetween(Date from, Date until) {
        Calendar countDate=Calendar.getInstance();
        countDate.setTime(from);
        /** Generate shows for each day until Date until is reached*/
        Random rand=new Random();
        List<Movie> movies=movieService.getAllMovies();
        while(countDate.getTime().before(until)) {
            /** For each movie generate shows every day */
            for(Movie movie : movies) {
                List<MovieShow> movieShows=new ArrayList<>();
                List<Integer> hours=new ArrayList<>();
                /** Between 2 - 5 shows every day per movie*/
                int amtShows=2 + rand.nextInt(3);
                for(int i=0; i<amtShows; i++) {
                    Calendar showTime=Calendar.getInstance();
                    showTime.setTime(countDate.getTime());
                    MovieShow movieShow=new MovieShow();
                    movieShow.setMovId(movie.getMovId());
                    int hour=-1;
                    while(true) {
                        /** Between 11-23 h*/
                        hour=11 + rand.nextInt(13);
                        final int fhour=hour;
                        if(hours.stream().noneMatch(h -> h==fhour)) {
                            break;
                        }
                    }
                    hours.add(hour);
                    showTime.set(Calendar.HOUR, hour);
                    movieShow.setDate(showTime.getTime());
                    movieShows.add(movieShow);
                }
                movieShowService.saveShows(movieShows);
            }
            countDate.add(Calendar.DATE, 1);
        }
    }

    public void generateReservationsBetween(Date from, Date until) {
        Calendar countDate=Calendar.getInstance();
        countDate.setTime(from);
        /** Generate reservations for each show until Date until is reached*/
        Random rand=new Random();
        List<Long> userIds=authenticationController.getAllUserIds();
        while(countDate.getTime().before(until)) {
            List<MovieShow> shows=movieShowService.getShowsForDate(countDate.getTime());
            /** For each show generate reservations */
            for(MovieShow show : shows) {
                List<ReservationWithSeats> reservations=new ArrayList<>();
                List<Long> users=new ArrayList<>();
                /** Between 2 - 4 reservations per show*/
                int amtReservations=2 + rand.nextInt(2);
                for(int i=0; i<amtReservations; i++) {
                    Calendar showTime=Calendar.getInstance();
                    showTime.setTime(countDate.getTime());
                    Reservation reservation=new Reservation();
                    reservation.setShowId(show.getShowId());
                    Long user=-1L;
                    while(true) {
                        /** Determine user (never 2 Reservations of same user for same show)*/
                        user=userIds.get(rand.nextInt(userIds.size()));
                        final long fuser=user;
                        if(users.stream().noneMatch(u -> u==fuser)) {
                            break;
                        }
                    }
                    users.add(user);
                    reservation.setUserId(user);
                    ReservationWithSeats reservationWithSeats=new ReservationWithSeats();
                    reservationWithSeats.setReservation(reservation);
                    /** Determine Seats of reservation*/
                    List<Seat> seatList= new ArrayList<>();
                    do{
                        seatList.clear();
                        //TODO int amtSeats=1 + rand.nextInt(4);
                        int amtSeats=1;
                        int startSeat=rand.nextInt(160) - amtSeats;
                        if(startSeat<0) {
                            startSeat=0;
                        }

                        for(int j=0; j<amtSeats; j++) {
                            Seat seat=new Seat();
                            seat.setResId(reservation.getResId());
                            seat.setNumber(startSeat+j);
                            int type=rand.nextInt(4);
                            switch(type){
                                case 0:
                                    seat.setType(Seat.Seat_Type.CHILD);
                                    break;
                                case 1:
                                    seat.setType(Seat.Seat_Type.STUDENT);
                                    break;
                                case 2:
                                    seat.setType(Seat.Seat_Type.ADULT);
                                    break;
                                case 3:
                                    seat.setType(Seat.Seat_Type.DISABLED);
                                    break;
                                default:
                                    seat.setType(Seat.Seat_Type.ADULT);
                                    break;
                            }
                            seatList.add(seat);
                        }
                    }while(!reservationService.areSeatsAvailable(show.getShowId(),seatList));
                    reservationWithSeats.setSeats(seatList);
                    reservations.add(reservationWithSeats);
                }
                reservationService.saveReservationsWithSeats(reservations);
            }
            countDate.add(Calendar.DATE, 1);
        }
    }

    public class ReservationWithSeats {
        private Reservation reservation;
        private List<Seat> seats;

        public Reservation getReservation() {
            return reservation;
        }

        public void setReservation(Reservation reservation) {
            this.reservation=reservation;
        }

        public List<Seat> getSeats() {
            return seats;
        }

        public void setSeats(List<Seat> seats) {
            this.seats=seats;
        }
    }
}
