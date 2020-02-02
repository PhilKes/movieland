package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findFirstByUserName(String userName);

}
