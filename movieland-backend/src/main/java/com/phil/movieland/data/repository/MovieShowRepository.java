package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.MovieShow;
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

    List<MovieShow> findAllByDateAndMovId(Date showDate,Long movId);

    Long deleteAllByShowIdIn(List<Long> showIds);
}
