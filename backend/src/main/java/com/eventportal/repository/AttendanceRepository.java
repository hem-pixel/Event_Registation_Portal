package com.eventportal.repository;

import com.eventportal.entity.Attendance;
import com.eventportal.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByRegistration(Registration registration);
    Optional<Attendance> findByRegistrationId(Long registrationId);
    long countByAttendanceStatus(String attendanceStatus);
}
