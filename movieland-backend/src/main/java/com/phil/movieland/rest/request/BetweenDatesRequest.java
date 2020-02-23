package com.phil.movieland.rest.request;

import java.util.Date;

public class BetweenDatesRequest {
    private Date from,until;

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from=from;
    }

    public Date getUntil() {
        return until;
    }

    public void setUntil(Date until) {
        this.until=until;
    }
}
