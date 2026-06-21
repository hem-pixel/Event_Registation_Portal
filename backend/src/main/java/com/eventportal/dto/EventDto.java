package com.eventportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String eventDay;
    private String duration;
    private String location;
    private String organizer;
    private Integer availableSeats;
    private String category;
    private String imageUrl;
    private LocalDate registrationDeadline;
    private LocalDateTime createdAt;
}
