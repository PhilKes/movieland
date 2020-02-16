package com.phil.movieland.rest;

import com.phil.movieland.service.ReservationService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringJUnit4ClassRunner.class)
@WebMvcTest(ReservationController.class)
public class RoomReservationWebControllerTest {
    @MockBean
    private ReservationService reservationService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getReservations() throws Exception{
        /*String dateString= "2020-01-01";
        Date date= DateUtils.createDateFromDateString(dateString);
        List<RoomReservation> roomReservations= new ArrayList<>();
        RoomReservation roomReservation= new RoomReservation();
        roomReservation.setLastName("Unit");
        roomReservation.setFirstName("Junit");
        roomReservation.setDate(date);
        roomReservation.setGuestId(1);
        roomReservation.setRoomId(100);
        roomReservation.setRoomNumber("J1");
        roomReservation.setRoomName("Junit Room");
        roomReservations.add(roomReservation);
        given(reservationService.getReservationsOfUser(date)).willReturn(roomReservations);
        mockMvc.perform(get("/reservations?date=2020-01-01"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Unit, Junit")));*/
    }
}
