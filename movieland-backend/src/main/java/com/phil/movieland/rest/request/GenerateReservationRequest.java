package com.phil.movieland.rest.request;

import org.springframework.lang.Nullable;
import java.util.List;

public class GenerateReservationRequest extends BetweenDatesRequest {
    private Integer resPerShow;

    @Nullable
    private List<Long> movIds;

    public Integer getResPerShow() {
        return resPerShow;
    }

    public void setResPerShow(Integer resPerShow) {
        this.resPerShow=resPerShow;
    }

    @Nullable
    public List<Long> getMovIds() {
        return movIds;
    }

    public void setMovIds(@Nullable List<Long> movIds) {
        this.movIds=movIds;
    }
}
