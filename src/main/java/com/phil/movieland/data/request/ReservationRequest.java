package com.phil.movieland.data.request;

import java.util.List;

public class ReservationRequest {
    private long show_id;
    private List<Integer> seats;

    public long getShow_id() {
        return show_id;
    }

    public void setShow_id(long show_id) {
        this.show_id=show_id;
    }

    public List<Integer> getSeats() {
        return seats;
    }

    public void setSeats(List<Integer> seats) {
        this.seats=seats;
    }
}
