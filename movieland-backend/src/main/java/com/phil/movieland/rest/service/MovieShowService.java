package com.phil.movieland.rest.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.repository.MovieShowRepository;
import com.phil.movieland.utils.DateUtils;
import com.phil.movieland.utils.Utils;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service to interface movieShowRepository
 */
@Service
@Transactional
public class MovieShowService {

    private final MovieShowRepository movieShowRepository;

    private Logger log = LoggerFactory.getLogger(MovieShowService.class);

    @Autowired
    public MovieShowService(MovieShowRepository movieShowRepository) {
        this.movieShowRepository = movieShowRepository;
    }

    public List<MovieShow> getShowsForMovie(Movie movie) {
        List<MovieShow> shows = movieShowRepository.findAllByMovId(movie.getMovId());
        for (MovieShow show : shows) {
            log.info("Show at: " + show.getDate());
        }
        return shows;
    }

    public List<MovieShow> getShowsForMovieDate(Movie movie, String dateString) {
        return getShowsForMovieDate((int) movie.getMovId(), dateString);
    }

    public List<MovieShow> getShowsForMovieDate(Integer movId, String dateString) {
        Date date = DateUtils.createDateFromDateString(dateString);
        Date[] betweenDates = getBetweenDates(date);
        List<MovieShow> shows = movieShowRepository.findAllByMovIdAndDateBetweenOrderByDate(movId, betweenDates[0], betweenDates[1]);
        for (MovieShow show : shows) {
            log.info("Show at: " + show.getDate());
        }
        return shows;
    }

    public void saveMovieShow(Long movieId, Date date) {
        MovieShow show = new MovieShow();
        show.setMovId(movieId);
        show.setDate(date);
        log.info("Saving MovieShow: movId='{}' date='{}'", movieId, date);
        movieShowRepository.save(show);
    }

    public MovieShow saveMovieShowIfNotExists(Long movieId, Date date) {
        MovieShow show = new MovieShow();
        show.setMovId(movieId);
        show.setDate(date);
        if(!movieShowRepository.findAllByDateAndMovId(date,movieId).isEmpty()){
            log.info("MovieShow movId='{}' date='{}' already exists", movieId, date);
            return null;
        }
        log.info("Saving MovieShow: movId='{}' date='{}'", movieId, date);
        return movieShowRepository.save(show);
    }

    public void deleteMovieShow(Long showid) {
        log.info("Deleting MovieShow by showId='{}'", showid);
        movieShowRepository.deleteById(showid);
    }

    public void deleteAll() {
        log.info("Deleting all MovieShows");
        movieShowRepository.deleteAll();
    }

    public List<MovieShow> getShowsForDate(Date date, boolean groupByMovId) {
        log.info("Querying MovieShows for day: '{}'", date);
        Date[] betweenDates = getBetweenDates(date);
        return movieShowRepository.findAllByDateBetweenOrderByDate(betweenDates[0], betweenDates[1]);
    }

    /**
     * Return dates from today 00:00 and 23:59
     */
    private Date[] getBetweenDates(Date date) {
        Date dateStart = new Date(date.getTime());
        dateStart.setHours(0);
        dateStart.setMinutes(0);
        dateStart.setSeconds(0);
        Date dateEnd = new Date(date.getTime());
        dateEnd.setHours(23);
        dateEnd.setMinutes(59);
        dateEnd.setSeconds(59);
        return new Date[]{dateStart, dateEnd};
    }

    public MovieShow saveShow(MovieShow show) {
        log.info("Saving MovieShow for movId: '{}' day: '{}'", show.getMovId(), show.getDate());
        return movieShowRepository.save(show);
    }

    public Optional<MovieShow> queryShow(Long id) {
        log.info("Querying MovieShows by id: '{}'", id);
        return movieShowRepository.findById(id);
    }

    public void deleteById(Long id) {
        log.info("Deleting MovieShows by id: '{}'", id);
        movieShowRepository.deleteById(id);
    }

    public List<MovieShow> getShowsForWeekOf(Date date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        Calendar in7Days = Calendar.getInstance();
        in7Days.setTime(date);
        in7Days.set(Calendar.HOUR_OF_DAY, 23);
        in7Days.set(Calendar.MINUTE, 59);
        in7Days.set(Calendar.SECOND, 59);
        in7Days.add(Calendar.DATE, 7);
        log.info("Querying MovieShows between: '{}' and '{}'", date, in7Days.getTime());
        return movieShowRepository.findAllByDateBetweenOrderByDate(date, in7Days.getTime());
    }

    public List<MovieShow> getMovieShowsForWeekOf(Movie movie, Date date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        Calendar in7Days = Calendar.getInstance();
        in7Days.setTime(date);
        in7Days.set(Calendar.HOUR_OF_DAY, 23);
        in7Days.set(Calendar.MINUTE, 59);
        in7Days.set(Calendar.SECOND, 59);
        in7Days.add(Calendar.DATE, 7);
        log.info("Querying MovieShows for Movie '{}' for week of '{}'", movie.getName(), date);
        return movieShowRepository.findAllByMovIdAndDateBetweenOrderByDate(movie.getMovId(), date, in7Days.getTime());
    }

    public void saveShows(List<MovieShow> movieShows) {
        log.info("Saving MovieShows '{}'", Utils.joinToStringList(movieShows.stream().map(MovieShow::getShowId)));
        movieShows.stream().sorted(Comparator.comparing(MovieShow::getDate)).forEach(this::saveShow);
    }

    public List<MovieShow> getShowsForBetween(Date from, Date until) {
        log.info("Querying MovieShows between: '{}' and '{}'", from, until);
        return movieShowRepository.findAllByDateBetweenOrderByDate(from, until);
    }

    public List<MovieShow> getShowsForMovIdListAndBetweenDates(List<Long> movIds, Date from, Date until) {
        log.info("Querying MovieShows for Movies movIds='{}' between: '{}' and '{}'", Utils.joinToStringList(movIds), from, until);
        return movieShowRepository.findAllByMovIdInAndDateBetweenOrderByDate(movIds, from, until);
    }

    public long deleteShowsByIds(List<Long> showIds) {
        log.info("Deleting MovieShows by ids='{}'", Utils.joinToStringList(showIds));
        return movieShowRepository.deleteAllByShowIdIn(showIds);
    }


}
