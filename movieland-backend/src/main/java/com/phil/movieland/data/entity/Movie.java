package com.phil.movieland.data.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phil.movieland.utils.DateUtils;
import com.phil.movieland.utils.TmdbApiService;
import info.movito.themoviedbapi.model.MovieDb;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="MOVIE")
public class Movie {

    @Id
    @Column(name="MOVIE_ID")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long movId;

    @Column(name="NAME")
    private String name;

    @Column(name="RELEASE_DATE")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name="DESCRIPTION")
    private String description;

    @Column(name="POSTER_URL", nullable=true)
    private String posterUrl;

    @Column(name="LENGTH", nullable=true)
    private Long length;

    @Column(name="TMDB_ID")
    private Long tmdbId;

    //Additional info, actors,... from TMDB
    @Transient //Ignore for Persistence in Database
    @JsonIgnore
    private MovieDb tmdbMovie;

    public Movie() {
    }

    public Movie(long movId, String name, Date date, String description) {
        this.movId = movId;
        this.name = name;
        this.date = date;
        this.description = description;
    }

    public Long getLength() {
        return length;
    }

    public void setLength(Long length) {
        this.length=length;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId=tmdbId;
    }

    public long getMovId() {
        return movId;
    }

    public void setMovId(long movId) {
        this.movId=movId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name=name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date=date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description=description;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl=posterUrl;
    }

    public MovieDb getTmdbMovie() {
        return tmdbMovie;
    }

    public void setTmdbMovie(MovieDb tmdbMovie) {
        this.tmdbMovie=tmdbMovie;
        this.tmdbId=(long) tmdbMovie.getId();
        this.posterUrl=TmdbApiService.POSTER_BASE_URL + tmdbMovie.getPosterPath();
        this.length=(long) tmdbMovie.getRuntime();

        this.description=tmdbMovie.getOverview();
        if(description.length()>255) {
            description=description.substring(0, 252) + "...";
        }
        if(tmdbMovie.getReleaseDate()!=null && !tmdbMovie.getReleaseDate().isEmpty()) {
            this.date=DateUtils.createDateFromDateString(tmdbMovie.getReleaseDate());
        }
        this.name=tmdbMovie.getTitle();
    }
}
