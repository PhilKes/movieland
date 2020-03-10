package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Reservation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends CrudRepository<Reservation,Long> {

    Optional<Reservation> findByResIdAndUserId(long resId, long userId);
    List<Reservation> findAllByShowId(long showId);
    List<Reservation> findAll();

    List<Reservation> findAllByUserId(long userId);

    @Query("SELECT r FROM  Reservation r,MovieShow ms WHERE r.userId=:userId AND r.showId=ms.showId " +
            "AND ms.date >= :currDate")
    List<Reservation> findFutureAllByUserId(@Param("userId") long userId, @Param("currDate") Date date);

    Long deleteAllByShowIdIn(List<Long> showIds);
}
