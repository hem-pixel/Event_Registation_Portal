package com.eventportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long eventId;
    private String eventName;
    private Integer rating;
    private String eventQuality;
    private String speakerRating;
    private String organizationRating;
    private String recommendation;
    private String comments;
    private LocalDateTime submittedAt;
}
