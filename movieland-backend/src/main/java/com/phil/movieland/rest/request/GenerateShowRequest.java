package com.phil.movieland.rest.request;

public class GenerateShowRequest extends BetweenDatesRequest {
    private Integer moviesPerDay;
    private Integer showsPerMovie;

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
}
