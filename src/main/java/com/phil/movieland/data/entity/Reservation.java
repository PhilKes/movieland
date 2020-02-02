package com.phil.movieland.data.entity;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name="RESERVATION")
public class Reservation {

    @Id
    @Column(name="RESERVATION_ID")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long reservationId;

    @Column(name="SHOW_ID")
    private long showId;

    @Column(name="USER_ID")
    private long userId;

    public long getReservationId() {
        return reservationId;
    }

    public void setReservationId(long reservationId) {
        this.reservationId=reservationId;
    }

    public long getShowId() {
        return showId;
    }

    public void setShowId(long showId) {
        this.showId=showId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId=userId;
    }
}
