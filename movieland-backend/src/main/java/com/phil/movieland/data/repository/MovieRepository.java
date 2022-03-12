package com.phil.movieland.data.repository;

import com.phil.movieland.data.entity.Movie;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends PagingAndSortingRepository<Movie, Long> {
    List<Movie> findAllByOrderByName();

    Slice<Movie> findAllByOrderByName(Pageable pageable);

    List<Movie> findAllByNameContainsOrderByName(String queryName);

    Optional<Movie> findByName(String name);

    Slice<Movie> findAllByNameContainsOrderByName(String queryName, Pageable pageable);

    List<Movie> findAllByMovIdIn(List<Long> movIds);
    Optional<Movie> findFirstByTmdbId(Long tmdbId);

    List<Movie> findAll();
}
