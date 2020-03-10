package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.IntermediateStatistic;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.rest.service.StatisticsService;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
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

    //TODO
    @Query("SELECT " +
            "new com.phil.movieland.data.entity.IntermediateStatistic(" +
            "ms,m,r,s) " +
            "FROM MovieShow ms, Reservation r, Seat s, Movie m WHERE " +
            "(ms.date BETWEEN :startDate and :endDate) and m.movId = ms.movId and" +
            " r.showId = ms.showId and r.resId= s.resId GROUP BY YEAR(ms.date)," +
            "MONTH(ms.date),DAY(ms.date)")
    List<IntermediateStatistic> findDailyStatisticsBetweenDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
