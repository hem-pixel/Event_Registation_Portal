package com.eventportal.repository;

import com.eventportal.entity.Event;
import com.eventportal.entity.Registration;
import com.eventportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUserOrderByRegistrationDateDesc(User user);
    List<Registration> findByEventOrderByRegistrationDateDesc(Event event);
    Optional<Registration> findByUserAndEvent(User user, Event event);
    boolean existsByUserAndEvent(User user, Event event);
    long countByEvent(Event event);
}
