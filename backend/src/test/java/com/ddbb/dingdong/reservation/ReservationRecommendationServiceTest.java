package com.ddbb.dingdong.reservation;

import com.ddbb.dingdong.domain.reservation.entity.vo.Direction;
import com.ddbb.dingdong.domain.reservation.service.ReservationManagement;
import com.ddbb.dingdong.domain.user.entity.Timetable;
import org.junit.jupiter.api.Test;

import java.time.*;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ReservationRecommendationServiceTest {

    private final ReservationManagement reservationManagement = new ReservationManagement(null, null);

    @Test
    public void testRecommendReservationTimes_Mixed() {
        YearMonth ym = YearMonth.of(2025, 2);

        Timetable timetable = new Timetable();
        timetable.setMonStartTime(LocalTime.of(8, 30));
        timetable.setMonEndTime(LocalTime.of(16, 0));
        timetable.setTueStartTime(LocalTime.of(9, 0));
        timetable.setTueEndTime(null);
        timetable.setWedStartTime(null);
        timetable.setWedEndTime(LocalTime.of(17, 0));
        timetable.setThuStartTime(LocalTime.of(8, 45));
        timetable.setThuEndTime(LocalTime.of(16, 15));
        timetable.setFriStartTime(LocalTime.of(9, 30));
        timetable.setFriEndTime(LocalTime.of(17, 30));

        List<LocalDateTime> toSchoolRecs = reservationManagement.recommendReservationDates(ym, Direction.TO_SCHOOL, timetable);
        List<LocalDateTime> toHomeRecs = reservationManagement.recommendReservationDates(ym, Direction.TO_HOME, timetable);

        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
            LocalDate date = ym.atDay(day);
            DayOfWeek dow = date.getDayOfWeek();
            if (dow.getValue() >= DayOfWeek.MONDAY.getValue() && dow.getValue() <= DayOfWeek.FRIDAY.getValue()) {
                switch (dow) {
                    case MONDAY:
                        if (timetable.getMonStartTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getMonStartTime());
                            assertTrue(toSchoolRecs.contains(expected), "TO_SCHOOL should contain " + expected);
                        }
                        if (timetable.getMonEndTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getMonEndTime());
                            assertTrue(toHomeRecs.contains(expected), "TO_HOME should contain " + expected);
                        }
                        break;
                    case TUESDAY:
                        if (timetable.getTueStartTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getTueStartTime());
                            assertTrue(toSchoolRecs.contains(expected), "TO_SCHOOL should contain " + expected);
                        }
                        if (timetable.getTueEndTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getTueEndTime());
                            assertTrue(toHomeRecs.contains(expected), "TO_HOME should contain " + expected);
                        }
                        break;
                    case WEDNESDAY:
                        if (timetable.getWedStartTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getWedStartTime());
                            assertTrue(toSchoolRecs.contains(expected), "TO_SCHOOL should contain " + expected);
                        }
                        if (timetable.getWedEndTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getWedEndTime());
                            assertTrue(toHomeRecs.contains(expected), "TO_HOME should contain " + expected);
                        }
                        break;
                    case THURSDAY:
                        if (timetable.getThuStartTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getThuStartTime());
                            assertTrue(toSchoolRecs.contains(expected), "TO_SCHOOL should contain " + expected);
                        }
                        if (timetable.getThuEndTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getThuEndTime());
                            assertTrue(toHomeRecs.contains(expected), "TO_HOME should contain " + expected);
                        }
                        break;
                    case FRIDAY:
                        if (timetable.getFriStartTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getFriStartTime());
                            assertTrue(toSchoolRecs.contains(expected), "TO_SCHOOL should contain " + expected);
                        }
                        if (timetable.getFriEndTime() != null) {
                            LocalDateTime expected = LocalDateTime.of(date, timetable.getFriEndTime());
                            assertTrue(toHomeRecs.contains(expected), "TO_HOME should contain " + expected);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
}