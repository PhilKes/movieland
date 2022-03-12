package com.phil.movieland.data;

import com.phil.movieland.auth.jwt.SignUpWithRoleRequest;
import com.phil.movieland.auth.jwt.entity.Role;
import com.phil.movieland.auth.jwt.entity.RoleRepository;
import com.phil.movieland.auth.jwt.entity.User;
import com.phil.movieland.auth.jwt.entity.UserRepository;
import com.phil.movieland.auth.jwt.util.AppException;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
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
        // Create Roles
        Arrays.stream(Role.RoleName.values()).forEach(role -> createRole(new Role(role)));
        // Create Users with Roles
        createUser(adminUser, 1);
        User user = createUser(userUser, 2);
        Calendar showTodayDate = Calendar.getInstance();
        showTodayDate.set(Calendar.HOUR, 16);
        showTodayDate.set(Calendar.MINUTE, 0);
        showTodayDate.set(Calendar.SECOND, 0);
        showTodayDate.set(Calendar.MILLISECOND, 0);

        List<Date> showDateTimes = Arrays.asList(showTodayDate.getTime(),
                DateUtils.addDays(showTodayDate.getTime(), 1), // Tomorrow
                DateUtils.addDays(showTodayDate.getTime(), -1) //Yesterday
        );
        // Create Movies
        movies.forEach(movie -> {
            // Create MovieShow for every Movie for Today, Yesterday and Tomorrow
            Movie createdMovie = movieService.saveMovieIfNotExists(movie);
            showDateTimes.forEach(showDate -> {
                MovieShow generatedShow = movieShowService.saveMovieShowIfNotExists(createdMovie.getMovId(), showDate);
                if (generatedShow != null) {
                    Reservation reservation = new Reservation(generatedShow.getShowId(), user.getId());
                    // Reserve first 2 seats in MovieShow
                    List<Seat> seats = reservationService.getAllSeatsOfShow(generatedShow.getShowId()).stream().limit(2).collect(Collectors.toList());
                    seats.forEach(seat -> seat.setType(Seat.Seat_Type.ADULT));
                    reservation.setTotalSum(seats.size()* Seat.getPrice(Seat.Seat_Type.ADULT));
                    reservation.setValidated(true);
                    reservation.setMethod(ReservationValidationRequest.PaymentMethod.CASH);
                    reservationService.saveReservation(reservation, seats);
                }
            });
        });

        System.out.println();

    }

    private void createRole(Role role) {
        if (roleRepository.findByName(role.getName()).isEmpty()) {
            roleRepository.save(role);
        }
    }

    private User createUser(SignUpWithRoleRequest signUpWithRoleRequest, long id) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent())
            return existingUser.get();
        User user = new User(signUpWithRoleRequest.getName(), signUpWithRoleRequest.getUsername(),
                signUpWithRoleRequest.getEmail(), signUpWithRoleRequest.getPassword());
        user.setId(id);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));
        user.setRoles(Collections.singleton(userRole));
        return userRepository.save(user);
    }
}

