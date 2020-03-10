package com.phil.movieland.data.entity;

import java.util.ArrayList;
import java.util.List;

public class IntermediateStatistic {
    private List<MovieShow> shows;
    private List<Movie> movies;
    private List<Reservation> reservations;
    private List<Seat> seats;

    public IntermediateStatistic(List<MovieShow> shows, List<Movie> movies, List<Reservation> reservations,
                                 List<Seat> seats) {
        this.shows=shows;
        this.reservations=reservations;
        this.movies=movies;
        this.seats=seats;
    }

    public IntermediateStatistic(MovieShow shows, Movie movies, Reservation reservations,
                                 Seat seats) {
        this.shows=new ArrayList<>();
        this.shows.add(shows);
        this.movies=new ArrayList<>();
        this.movies.add(movies);
        this.reservations=new ArrayList<>();
        this.reservations.add(reservations);
        this.seats=new ArrayList<>();
        this.seats.add(seats);
    }


    //TODO SHOW in REACT
    //TODO USE Highest & LowestGrossing to determine bounds for Chart

    public List<MovieShow> getShows() {
        return shows;
    }

    public void setShows(List<MovieShow> shows) {
        this.shows=shows;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies=movies;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations=reservations;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public void setSeats(List<Seat> seats) {
        this.seats=seats;
    }
}