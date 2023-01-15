package com.phil.movieland.data.entity;


import jakarta.persistence.*;

import java.util.HashMap;

import static com.phil.movieland.data.entity.Seat.Seat_Type.*;

@Entity
@Table(name="SEAT")
public class Seat {

    public enum Seat_Type {
        CHILD, STUDENT, ADULT, DISABLED
    }

    private static final HashMap<Seat_Type, Double> PRICE_MAP=new HashMap();

    static {
        PRICE_MAP.put(CHILD, 5.5);
        PRICE_MAP.put(STUDENT, 6.0);
        PRICE_MAP.put(ADULT, 7.0);
        PRICE_MAP.put(DISABLED, 5.5);
    }

    public static double getPrice(Seat_Type type) {
        if(type==null) {
            return 7.0;
        }
        return PRICE_MAP.get(type);
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

    public Seat() {
    }

    public Seat(int number, Seat_Type type) {
        this.number = number;
        this.type = type;
    }

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
