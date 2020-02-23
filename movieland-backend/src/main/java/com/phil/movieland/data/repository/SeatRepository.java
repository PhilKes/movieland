package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends CrudRepository<Seat, Long> {
    List<Seat> findAllByResId(long resId);

    void deleteAllByResId(long resId);

    //@Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Company c WHERE c.name = :companyName")
    @Query("SELECT s FROM Seat s,Reservation r WHERE s.number=:number AND s.resId= r.resId " +
            "AND r.showId = :showId")
    List<Seat> findSeatDuplicates(@Param("number")int number, @Param("showId") long showId);

    @Query("SELECT s FROM Seat s,Reservation r,MovieShow sh WHERE  s.resId= r.resId " +
            "AND r.showId = :showId AND sh.showId=:showId ORDER BY s.type")
    List<Seat> findSeatsOfShow(@Param("showId") long showId);


}
