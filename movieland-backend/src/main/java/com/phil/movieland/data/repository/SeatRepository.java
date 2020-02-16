package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends CrudRepository<Seat, Long> {
    List<Seat> findAllByResId(long resId);

    void deleteAllByResId(long resId);

}
