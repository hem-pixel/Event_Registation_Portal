package com.eventportal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @Column(name = "event_day", length = 20)
    private String eventDay;

    @Column(nullable = false, length = 50)
    private String duration;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(length = 100)
    private String organizer;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(length = 50)
    private String category;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "registration_deadline")
    private java.time.LocalDate registrationDeadline;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
