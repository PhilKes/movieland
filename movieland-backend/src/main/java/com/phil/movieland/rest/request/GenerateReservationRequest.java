package com.phil.movieland.rest.request;

public class GenerateReservationRequest extends BetweenDatesRequest {
    private Integer resPerShow;

    public Integer getResPerShow() {
        return resPerShow;
    }

    public void setResPerShow(Integer resPerShow) {
        this.resPerShow=resPerShow;
    }
}
