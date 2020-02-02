package com.phil.movieland.service;

import com.phil.movieland.data.entity.Movie;
import com.phil.movieland.data.entity.Reservation;
import com.phil.movieland.data.entity.User;
import com.phil.movieland.data.repository.MovieRepository;
import com.phil.movieland.data.repository.ReservationRepository;
import com.phil.movieland.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReservationService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(UserRepository roomRepository, MovieRepository guestRepository, ReservationRepository reservationRepository) {
        this.userRepository=roomRepository;
        this.movieRepository=guestRepository;
        this.reservationRepository=reservationRepository;
    }

    public List<Reservation> getReservationsOfUsername(String userName){
        /*Iterable<User> rooms = this.userRepository.findAll();
        Map<Long, RoomReservation> roomReservationMap = new HashMap();
        rooms.forEach(room -> {
            RoomReservation roomReservation = new RoomReservation();
            roomReservation.setRoomId(room.getRoomId());
            roomReservation.setRoomName(room.getRoomName());
            roomReservation.setRoomNumber(room.getRoomNumber());
            roomReservationMap.put(room.getRoomId(), roomReservation);
        });
        Iterable<Reservation> reservations = this.reservationRepository.findReservationByReservationDate(new java.sql.Date(date.getTime()));
        reservations.forEach(reservation -> {
            RoomReservation roomReservation = roomReservationMap.get(reservation.getRoomId());
            roomReservation.setDate(date);
            Movie guest = this.movieRepository.findById(reservation.getGuestId()).get();
            roomReservation.setFirstName(guest.getFirstName());
            roomReservation.setLastName(guest.getLastName());
            roomReservation.setGuestId(guest.getGuestId());
        });
        List<RoomReservation> roomReservations = new ArrayList<>();
        for(Long id: roomReservationMap.keySet()){
            roomReservations.add(roomReservationMap.get(id));
        }
        roomReservations.sort(new Comparator<RoomReservation>() {
            @Override
            public int compare(RoomReservation o1, RoomReservation o2) {
                if (o1.getRoomName() == o2.getRoomName()){
                    return o1.getRoomNumber().compareTo(o2.getRoomNumber());
                }
                return o1.getRoomName().compareTo(o2.getRoomName());
            }
        });*/
        Optional<User> user=userRepository.findFirstByUserName(userName);
        if(user.isEmpty())
            return new ArrayList<>();
        List<Reservation> reservations=reservationRepository.findReservationByUserId(user.get().getUserId());
        System.out.println("Reservations for "+ userName+":");
        reservations.forEach(reservation -> System.out.println(reservations));
        return reservations;
    }
}
