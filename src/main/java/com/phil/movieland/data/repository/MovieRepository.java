package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Movie;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends CrudRepository<Movie,Long> {
    List<Movie> findAll();
    List<Movie> findAllByNameContains(String queryName);
}
