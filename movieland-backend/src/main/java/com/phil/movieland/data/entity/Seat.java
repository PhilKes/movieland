package com.phil.movieland.data.entity;


import javax.persistence.*;

@Entity
@Table(name="SEAT")
public class Seat {

    public enum Seat_Type{
        CHILD,STUDENT,ADULT,DISABLED
    }

    @Id
    @Column(name="SEAT_ID")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long seatID;

    @Column(name="RESERVATION_ID")
    private long resId;

    @Column(name="SEAT_NR")
    private int number;

    @Column(name="TYPE")
    private Seat_Type type;

    public Seat_Type getType() {
        return type;
    }

    public void setType(Seat_Type type) {
        this.type=type;
    }

    public long getSeatID() {
        return seatID;
    }

    public void setSeatID(long seatID) {
        this.seatID=seatID;
    }

    public long getResId() {
        return resId;
    }

    public void setResId(long resId) {
        this.resId=resId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number=number;
    }
}
