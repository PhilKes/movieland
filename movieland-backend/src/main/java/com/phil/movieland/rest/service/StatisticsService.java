package com.phil.movieland.rest.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.phil.movieland.auth.AuthenticationController;
import com.phil.movieland.auth.jwt.entity.Role;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.data.repository.SeatRepository;
import com.phil.movieland.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

@Service
public class StatisticsService {

    private final MovieShowService movieShowService;
    private final AuthenticationController authenticationController;
    private final MovieService movieService;
    private final SeatRepository seatRepository;
    private final ReservationService reservationService;

    private final static HashMap<String, Statistics> precalculatedSummaries=new HashMap<>();

    @Autowired
    public StatisticsService(SeatRepository seatRepository, ReservationService reservationService,
                             MovieShowService movieShowService, MovieService movieService,
                             AuthenticationController authenticationController) {
        this.seatRepository=seatRepository;
        this.reservationService=reservationService;
        this.movieShowService=movieShowService;
        this.movieService=movieService;
        this.authenticationController=authenticationController;
    }

    public void generateShowsBetween(Date from, Date until) {
        Calendar countDate=Calendar.getInstance();
        countDate.setTime(from);
        /** Generate shows for each day until Date until is reached*/
        Random rand=new Random();
        List<Movie> movies=movieService.getAllMovies();
        while(countDate.getTime().before(until)) {
            /** For each movie generate shows every day */
            for(Movie movie : movies) {
                List<MovieShow> movieShows=new ArrayList<>();
                List<Integer> hours=new ArrayList<>();
                /** Between 2 - 5 shows every day per movie*/
                int amtShows=2 + rand.nextInt(3);
                for(int i=0; i<amtShows; i++) {
                    Calendar showTime=Calendar.getInstance();
                    showTime.setTime(countDate.getTime());
                    MovieShow movieShow=new MovieShow();
                    movieShow.setMovId(movie.getMovId());
                    int hour=-1;
                    while(true) {
                        /** Between 11-23 h*/
                        hour=11 + rand.nextInt(13);
                        final int fhour=hour;
                        if(hours.stream().noneMatch(h -> h==fhour)) {
                            break;
                        }
                    }
                    hours.add(hour);
                    showTime.set(Calendar.HOUR, hour);
                    movieShow.setDate(showTime.getTime());
                    movieShows.add(movieShow);
                }
                movieShowService.saveShows(movieShows);
            }
            System.out.println("Generated shows for: " + countDate.getTime());
            countDate.add(Calendar.DATE, 1);
        }
        precalculatedSummaries.clear();
    }

    public void generateReservationsBetween(Date from, Date until) {
        Calendar countDate=Calendar.getInstance();
        countDate.setTime(from);
        /** Generate reservations for each show until Date until is reached*/
        Random rand=new Random();
        List<Long> userIds=authenticationController.getAllUserIdsOfRole(Role.RoleName.ROLE_USER);
        while(countDate.getTime().before(until)) {
            List<MovieShow> shows=movieShowService.getShowsForDate(countDate.getTime());
            /** For each show generate reservations */
            for(MovieShow show : shows) {
                List<ReservationWithSeats> reservations=new ArrayList<>();
                List<Long> users=new ArrayList<>();
                /** Between 2 - 4 reservations per show*/
                int amtReservations=2 + rand.nextInt(2);
                for(int i=0; i<amtReservations; i++) {
                    Calendar showTime=Calendar.getInstance();
                    showTime.setTime(countDate.getTime());
                    Reservation reservation=new Reservation();
                    reservation.setShowId(show.getShowId());
                    Long user=-1L;
                    while(true) {
                        /** Determine user (never 2 Reservations of same user for same show)*/
                        user=userIds.get(rand.nextInt(userIds.size()));
                        final long fuser=user;
                        if(users.stream().noneMatch(u -> u==fuser)) {
                            break;
                        }
                    }
                    users.add(user);
                    reservation.setUserId(user);
                    ReservationWithSeats reservationWithSeats=new ReservationWithSeats();
                    reservationWithSeats.setReservation(reservation);
                    /** Determine Seats of reservation*/
                    List<Seat> seatList=new ArrayList<>();
                    do {
                        seatList.clear();
                        int amtSeats=2 + rand.nextInt(4);
                        int startSeat=rand.nextInt(160) - amtSeats;
                        if(startSeat<0) {
                            startSeat=0;
                        }

                        for(int j=0; j<amtSeats; j++) {
                            Seat seat=new Seat();
                            seat.setResId(reservation.getResId());
                            seat.setNumber(startSeat + j);
                            int type=rand.nextInt(4);
                            switch(type) {
                                case 0:
                                    seat.setType(Seat.Seat_Type.CHILD);
                                    break;
                                case 1:
                                    seat.setType(Seat.Seat_Type.STUDENT);
                                    break;
                                case 2:
                                    seat.setType(Seat.Seat_Type.ADULT);
                                    break;
                                case 3:
                                    seat.setType(Seat.Seat_Type.DISABLED);
                                    break;
                                default:
                                    seat.setType(Seat.Seat_Type.ADULT);
                                    break;
                            }
                            seatList.add(seat);
                        }
                    } while(!reservationService.areSeatsAvailable(show.getShowId(), seatList));
                    reservationWithSeats.setSeats(seatList);
                    reservations.add(reservationWithSeats);
                }
                reservationService.saveReservationsWithSeats(reservations);
            }
            System.out.println("Generated reservations for: " + countDate.getTime());
            countDate.add(Calendar.DATE, 1);
        }
        precalculatedSummaries.clear();

    }

    public void deleteStatisticsBetween(Date from, Date until) {
        System.out.println("Deleting Statistics from: " + from + " until " + until);
        List<Long> showIds=movieShowService.getShowsForBetween(from, until).stream().map(MovieShow::getShowId).collect(Collectors.toList());
        long deletedRes=reservationService.deleteReservationsOfShows(showIds);
        System.out.println("Deleted " + deletedRes + " Reservations");
        long deletedShows=movieShowService.deleteShowsByIds(showIds);
        System.out.println("Deleted " + deletedShows + " Shows");
        precalculatedSummaries.clear();

    }

    /**
     * Calculates income based on reservation from Date to Date until
     */
    public double calculateIncomeBetween(Date from, Date until) {
        List<MovieShow> shows=movieShowService.getShowsForBetween(from, until);
        double sum=0.0;
        for(MovieShow show : shows) {
            List<Seat> seats=seatRepository.findSeatsOfShow(show.getShowId());
            sum+=seats.stream().mapToDouble(seat -> Seat.getPrice(seat.getType())).sum();
        }
        return sum;
    }


    /**
     * Calculates income based on reservation from Date to Date until
     */
    public Statistics calculateStatistics(Date from, Date until) {
        String summaryKey=DateUtils.getDateRangeStringFromDate(from, until);
        if(precalculatedSummaries.containsKey(summaryKey)) {
            System.out.println("Already calculated statistics for: " + from + " until: " + until);
            return precalculatedSummaries.get(summaryKey);
        }
        System.out.println("Calculating statistics for: "+from+" until: "+until);
        Statistics statistics=new Statistics();
        long amtShows=0, amtMovies=0, amtSeats=0, amtWatchedMins=0, income=0;
        List<MovieShow> shows=movieShowService.getShowsForBetween(from, until);
        HashMap<Date, Integer> dailyStats=new HashMap<>();
        LinkedHashMap<Long, MovieStats> movieGrossing=new LinkedHashMap<>();
        HashMap<Long, Movie> movies=getMoviesFromShows(shows);
        amtShows=shows.size();
        amtMovies=movies.size();
        for(MovieShow show : shows) {
            List<Seat> seats=seatRepository.findSeatsOfShow(show.getShowId());
            /** Split seats into Seat Types*/
            Map<Seat.Seat_Type, List<Seat>> seatsMap=seats.stream()
                    .collect(Collectors.groupingBy(s -> s.getType()));
            /** Add amount of seats to types Statistics*/
            seatsMap.entrySet().forEach(seatType ->
                    statistics.addSeatsDistribution(Map.entry(seatType.getKey(), seatType.getValue().size()))
            );

            Calendar showDay=Calendar.getInstance();
            showDay.setTime(show.getDate());
            showDay.set(Calendar.HOUR_OF_DAY,1);
            /*showDay.set(Calendar.MINUTE,0);
            showDay.set(Calendar.SECOND,0);*/
            //showDay.set(Calendar.MILLISECOND,0);
            Date date=showDay.getTime();
            int daySeats=seats.size();
            amtSeats+=daySeats;
            /** Update daily stats*/
            if(!dailyStats.containsKey(date)) {
                dailyStats.put(date, daySeats);
            }else{
                dailyStats.put(date, dailyStats.get(date)+daySeats);
            }
            double seatsIncome=seats.stream().mapToDouble(seat -> Seat.getPrice(seat.getType())).sum();
            income+=seatsIncome;
            long movId=show.getMovId();
            /** Update Movie income stats*/
            if(!movieGrossing.containsKey(movId)) {
                movieGrossing.put(movId, new MovieStats(movId,movies.get(movId).getPosterUrl(),seatsIncome,seats.size()));
            }else{
                movieGrossing.get(movId).addGrossing(seatsIncome);
                movieGrossing.get(movId).addVisitors(seats.size());
            }
            amtWatchedMins+=movies.get(movId).getLength();
        }

        statistics.setAmtMovies(amtMovies);
        statistics.setAmtSeats(amtSeats);
        statistics.setAmtShows(amtShows);
        statistics.setIncome(income);
        statistics.setAmtWatchedMins(amtWatchedMins);
        statistics.setDailyStats(dailyStats);
        statistics.setMovieStats(movieGrossing);
        precalculatedSummaries.put(summaryKey, statistics);
        System.out.println("Finished calculating statistics for: " + from + " until: " + until);
        return statistics;
    }

    private HashMap<Long, Movie> getMoviesFromShows(List<MovieShow> shows) {
        HashMap<Long, Movie> movies=new HashMap<>();
        shows.stream().mapToLong(show -> show.getMovId()).distinct().forEach(
                mov -> movieService.queryMovie(mov).ifPresent(movie -> movies.put(movie.getMovId(), movie))
        );
        return movies;
    }

    public static class Statistics {
        private long amtShows, amtMovies, amtSeats;
        private long amtWatchedMins;
        private long income;
        private HashMap<Date,Integer> dailyStats;
        private Map<Seat.Seat_Type, Integer> seatsDistribution;
        private LinkedHashMap<Long, MovieStats> movieStats;


        public Statistics() {
            seatsDistribution=new HashMap<>();
            for(Seat.Seat_Type type : Seat.Seat_Type.values()) {
                seatsDistribution.put(type, 0);
            }
        }

        //TODO SHOW in REACT
        //TODO USE Highest & LowestGrossing to determine bounds for Chart
        public MovieStats getHighestGrossingMovie(){
            return movieStats.values().stream().max(Comparator.comparing(MovieStats::getGrossing)).orElse(new MovieStats());
        }

        public MovieStats getLowestGrossingMovie(){
            return movieStats.values().stream().min(Comparator.comparing(MovieStats::getGrossing)).orElse(new MovieStats());
        }

        public Map<Seat.Seat_Type, Integer> getSeatsDistribution() {
            return seatsDistribution;
        }

        public void setSeatsDistribution(Map<Seat.Seat_Type, Integer> seatsDistribution) {
            this.seatsDistribution=seatsDistribution;
        }

        public void addSeatsDistributions(Map<Seat.Seat_Type, Integer> seatsDistribution) {
            seatsDistribution.entrySet().forEach(entry -> {
                this.seatsDistribution.put(entry.getKey(), this.seatsDistribution.get(entry.getKey()) + entry.getValue());
            });
        }

        public void addSeatsDistribution(Map.Entry<Seat.Seat_Type, Integer> entry) {
            this.seatsDistribution.put(entry.getKey(), this.seatsDistribution.get(entry.getKey()) + entry.getValue());
        }

        @Transient
        @JsonIgnore
        public Map<Long, MovieStats> getMovieStats() {
            return movieStats;
        }

        /** Sorts and sets moveStats Map*/
        public void setMovieStats(LinkedHashMap<Long, MovieStats> movieStats) {
            LinkedHashMap<Long, MovieStats> sorted =  movieStats.entrySet().stream()
                    .sorted((e1,e2)->Double.compare(e1.getValue().getGrossing(),e2.getValue().getGrossing())*-1)
                    .collect(toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue,
                            (a, b) -> { throw new AssertionError();},
                            LinkedHashMap::new
                    ));
            this.movieStats=sorted;
        }

       /* public List<Integer> getSortedDailyStats(){
            return dailyStats.entrySet().stream().sorted(Comparator.comparing(Map.Entry::getKey))
                    .map(e->e.getValue()).collect(Collectors.toList());
        }*/

        public HashMap<Date, Integer> getDailyStats() {
            return dailyStats;
        }

        public void setDailyStats(HashMap<Date, Integer> dailyStats) {
            this.dailyStats=dailyStats;
        }

        public long getAmtShows() {
            return amtShows;
        }

        public void setAmtShows(long amtShows) {
            this.amtShows=amtShows;
        }

        public long getAmtMovies() {
            return amtMovies;
        }

        public void setAmtMovies(long amtMovies) {
            this.amtMovies=amtMovies;
        }

        public long getAmtSeats() {
            return amtSeats;
        }

        public void setAmtSeats(long amtSeats) {
            this.amtSeats=amtSeats;
        }

        public long getAmtWatchedMins() {
            return amtWatchedMins;
        }

        public void setAmtWatchedMins(long amtWatchedMins) {
            this.amtWatchedMins=amtWatchedMins;
        }

        public long getIncome() {
            return income;
        }

        public void setIncome(long income) {
            this.income=income;
        }
    }

    public static class MovieStats {
        private long movId=-1;
        private String posterPath;
        private Double grossing;
        private Integer visitors;

        public MovieStats() {
        }

        public MovieStats(long movId, String posterPath, double grossing, int visitors) {
            this.movId=movId;
            this.posterPath=posterPath;
            this.grossing=grossing;
            this.visitors=visitors;
        }

        public Integer getVisitors() {
            return visitors;
        }

        public void setVisitors(Integer visitors) {
            this.visitors=visitors;
        }

        public void addVisitors(Integer visitors) {
            this.visitors+=visitors;
        }

        public long getMovId() {
            return movId;
        }

        public void setMovId(long movId) {
            this.movId=movId;
        }

        public String getPosterPath() {
            return posterPath;
        }

        public void setPosterPath(String posterPath) {
            this.posterPath=posterPath;
        }

        public Double getGrossing() {
            return grossing;
        }

        public void setGrossing(Double grossing) {
            this.grossing=grossing;
        }

        public void addGrossing(double grossing) {
            this.grossing+=grossing;
        }


    }

    public static class ReservationWithSeats {
        private Reservation reservation;
        private List<Seat> seats;

        public Reservation getReservation() {
            return reservation;
        }

        public void setReservation(Reservation reservation) {
            this.reservation=reservation;
        }

        public List<Seat> getSeats() {
            return seats;
        }

        public void setSeats(List<Seat> seats) {
            this.seats=seats;
        }
    }
}
