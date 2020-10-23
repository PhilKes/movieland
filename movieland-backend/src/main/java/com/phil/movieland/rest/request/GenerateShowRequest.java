package com.phil.movieland.rest.request;

import org.springframework.lang.Nullable;

import java.util.List;

public class GenerateShowRequest extends BetweenDatesRequest {
    private Integer moviesPerDay;
    private Integer showsPerMovie;

    @Nullable
    private List<Long> movIds;

    public Integer getMoviesPerDay() {
        return moviesPerDay;
    }

    public void setMoviesPerDay(Integer moviesPerDay) {
        this.moviesPerDay=moviesPerDay;
    }

    public Integer getShowsPerMovie() {
        return showsPerMovie;
    }

    public void setShowsPerMovie(Integer showsPerMovie) {
        this.showsPerMovie=showsPerMovie;
    }

    @Nullable
    public List<Long> getMovIds() {
        return movIds;
    }

    public void setMovIds(@Nullable List<Long> movIds) {
        this.movIds=movIds;
    }
}
