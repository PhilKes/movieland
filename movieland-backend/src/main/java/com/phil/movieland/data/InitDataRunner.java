package com.phil.movieland.data;

import com.phil.movieland.auth.jwt.SignUpWithRoleRequest;
import com.phil.movieland.auth.jwt.entity.Role;
import com.phil.movieland.auth.jwt.entity.RoleRepository;
import com.phil.movieland.auth.jwt.entity.User;
import com.phil.movieland.auth.jwt.entity.UserRepository;
import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.MovieShow;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.Seat;
import com.phil.movieland.rest.request.ReservationValidationRequest;
import com.phil.movieland.rest.service.MovieService;
import com.phil.movieland.rest.service.MovieShowService;
import com.phil.movieland.rest.service.ReservationService;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@Profile("!test")
public class InitDataRunner implements ApplicationRunner {
    private Logger log = LoggerFactory.getLogger(InitDataRunner.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final ReservationService reservationService;
    private final MovieService movieService;
    private final MovieShowService movieShowService;
    private final PasswordEncoder passwordEncoder;

    private final List<Movie> movies = Arrays.asList(
            new Movie(1, "Star Wars", new GregorianCalendar(1977, 10 - 1, 11).getTime(), "A long time ago"),
            new Movie(2, "Star Wars Return of the Jedi", new GregorianCalendar(1984, 10 - 1, 11).getTime(), "A long time ago"),
            new Movie(3, "Indiana Jones", new GregorianCalendar(1981, 10 - 1, 11).getTime(), "Harrison Ford out in the dessert"),
            new Movie(4, "Whiplash", new GregorianCalendar(2014, 10 - 1, 11).getTime(), "A young drummer trying"),
            new Movie(5, "Harry Potter and the Sorcerer's Stone", new GregorianCalendar(2001, 10 - 1, 11).getTime(), "The boy who lived")
    );


    public InitDataRunner(UserRepository userRepository, RoleRepository roleRepository, ReservationService reservationService, MovieService movieService, MovieShowService movieShowService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.reservationService = reservationService;
        this.movieService = movieService;
        this.movieShowService = movieShowService;
        this.passwordEncoder = passwordEncoder;
    }

    private SignUpWithRoleRequest adminUser = new SignUpWithRoleRequest("phil key", "admin", "admin@mail.com", "admin123", Role.RoleName.ROLE_ADMIN.name());
    private SignUpWithRoleRequest userUser = new SignUpWithRoleRequest("user1", "user", "user@mail.com", "user123", Role.RoleName.ROLE_USER.name());

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("Writing initial data to the database...");
        // Create Roles
        Arrays.stream(Role.RoleName.values()).forEach(role -> createRole(new Role(role)));
        // Create Users with Roles
        createUser(adminUser, 1);
        User user = createUser(userUser, 2);
        log.info("CREATED USER {} {}", user.getUsername(), user.getId());
        Calendar showTodayDate = Calendar.getInstance();
        showTodayDate.set(Calendar.HOUR_OF_DAY, 0);
        showTodayDate.set(Calendar.MINUTE, 0);
        showTodayDate.set(Calendar.SECOND, 0);
        showTodayDate.set(Calendar.MILLISECOND, 0);

        List<Date> showDates = Arrays.asList(
                DateUtils.addDays(showTodayDate.getTime(), -1), //Yesterday
                showTodayDate.getTime(), //Today
                DateUtils.addDays(showTodayDate.getTime(), 1), // Tomorrow
                DateUtils.addDays(showTodayDate.getTime(), 2),
                DateUtils.addDays(showTodayDate.getTime(), 3),
                DateUtils.addDays(showTodayDate.getTime(), 4),
                DateUtils.addDays(showTodayDate.getTime(), 5),
                DateUtils.addDays(showTodayDate.getTime(), 6)
        );
        List<Integer> showHours= Arrays.asList(14,17,20);

        // Ensure initial Movies exist
        List<Movie> moviesWithoutIntials = movieService.getAllMovies().stream().filter(movie -> movies.stream().noneMatch(initMovie -> initMovie.getName().equals(movie.getName()))).collect(Collectors.toList());
        moviesWithoutIntials.addAll(movies);
        // Create MovieShow for every Movie for the next 7 days
        moviesWithoutIntials.forEach(movie -> {
            try {
                Movie createdMovie = movieService.saveMovieIfNotExists(movie);
                showDates.forEach(showDate -> {
                    showHours.forEach(showHour->{
                        Date showDateTime= new Date(showDate.getTime());
                        showDateTime.setHours(showHour);
                        MovieShow generatedShow = movieShowService.saveMovieShowIfNotExists(createdMovie.getMovId(), showDateTime);
                        if (generatedShow != null) {
                            Reservation reservation = new Reservation(generatedShow.getShowId(), user.getId());
                            // Reserve first 2 seats in MovieShow
                            List<Seat> seats = Arrays.asList(
                                    new Seat(70, Seat.Seat_Type.ADULT),
                                    new Seat(71, Seat.Seat_Type.ADULT),
                                    new Seat(101, Seat.Seat_Type.STUDENT),
                                    new Seat(102, Seat.Seat_Type.STUDENT)
                            );
                            reservation.setTotalSum(seats.size() * Seat.getPrice(Seat.Seat_Type.ADULT));
                            reservation.setValidated(true);
                            reservation.setMethod(ReservationValidationRequest.PaymentMethod.CASH);
                            reservationService.saveReservation(reservation, seats);
                        }
                    });

                });
            } catch (Exception e) {
                log.warn(e.getMessage());
            }

        });
        log.info("Finished writing initial data to the database");
    }

    private void createRole(Role role) {
        if (roleRepository.findByName(role.getName()).isEmpty()) {
            roleRepository.save(role);
        }
    }

    private User createUser(SignUpWithRoleRequest signUpWithRoleRequest, long id) {
        Optional<User> existingUser = userRepository.findByUsername(signUpWithRoleRequest.getUsername());
        if (existingUser.isPresent())
            return existingUser.get();
        User user = new User(signUpWithRoleRequest.getName(), signUpWithRoleRequest.getUsername(),
                signUpWithRoleRequest.getEmail(), signUpWithRoleRequest.getPassword());
        user.setId(id);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Set<Role> roles = new HashSet<>(Arrays.asList(
                roleRepository.findByName(Role.RoleName.valueOf(Role.RoleName.ROLE_USER.name())).get(),
                roleRepository.findByName(Role.RoleName.valueOf(signUpWithRoleRequest.getRoleName())).get()
        ));
        user.setRoles(roles);
        log.info("Saving User '{}'", signUpWithRoleRequest.getUsername());
        return userRepository.save(user);
    }
}

