package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.rest.controller.MovieShowController;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MovieShowRepository extends CrudRepository<MovieShow,Long> {
    List<MovieShow> findAllByOrderByDate();
    List<MovieShow> findAllByMovId(long movid);

    List<MovieShow> findAllByMovIdAndDateBetweenOrderByDate(long movid, Date dateStart, Date dateEnd);

    List<MovieShow> findAllByMovIdInAndDateBetweenOrderByDate(List<Long> movIds, Date dateStart, Date dateEnd);

    List<MovieShow> findAllByDateBetweenOrderByDate(Date dateStart,Date dateEnd);

    Long deleteAllByShowIdIn(List<Long> showIds);
}
