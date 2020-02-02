package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MovieShowRepository extends CrudRepository<MovieShow,Long> {
    List<MovieShow> findAll();
    List<MovieShow> findAllByMovId(long movid);
    List<MovieShow> findAllByMovIdAndDateBetween(long movid,Date dateStart,Date dateEnd);
}
