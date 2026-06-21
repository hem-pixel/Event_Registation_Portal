package com.eventportal.repository;

import com.eventportal.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.event WHERE f.event.id = :eventId")
    List<Feedback> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.event WHERE f.user.id = :userId")
    List<Feedback> findByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId AND f.event.id = :eventId")
    Optional<Feedback> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.event")
    List<Feedback> findAllWithUserAndEvent();
}
