package com.phil.movieland.data.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="MOVIE_SHOW")
public class MovieShow {

    @Id
    @Column(name="SHOW_ID")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long showId;

    @Column(name="MOVIE_ID")
    private long movId;

    @Column(name="RELEASE_DATE")
    @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME)
    private Date date;

    //TODO list of seats, different cinemas

    public long getShowId() {
        return showId;
    }

    public void setShowId(long showId) {
        this.showId=showId;
    }

    public long getMovId() {
        return movId;
    }

    public void setMovId(long movId) {
        this.movId=movId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date=date;
    }
}
