package com.eventportal.service;

import com.eventportal.dto.FeedbackDto;
import com.eventportal.entity.Event;
import com.eventportal.entity.Feedback;
import com.eventportal.entity.User;
import com.eventportal.repository.EventRepository;
import com.eventportal.repository.FeedbackRepository;
import com.eventportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional
    public FeedbackDto submitFeedback(FeedbackDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + dto.getEventId()));

        if (feedbackRepository.findByUserIdAndEventId(user.getId(), event.getId()).isPresent()) {
            throw new RuntimeException("Feedback already submitted for this event");
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .event(event)
                .rating(dto.getRating())
                .eventQuality(dto.getEventQuality())
                .speakerRating(dto.getSpeakerRating())
                .organizationRating(dto.getOrganizationRating())
                .recommendation(dto.getRecommendation())
                .comments(dto.getComments())
                .build();

        feedback = feedbackRepository.save(feedback);
        return mapToDto(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackDto> getFeedbackByEvent(Long eventId) {
        return feedbackRepository.findByEventId(eventId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDto> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDto> getAllFeedback() {
        return feedbackRepository.findAllWithUserAndEvent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    private FeedbackDto mapToDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .userId(feedback.getUser().getId())
                .userName(feedback.getUser().getName())
                .eventId(feedback.getEvent().getId())
                .eventName(feedback.getEvent().getTitle())
                .rating(feedback.getRating())
                .eventQuality(feedback.getEventQuality())
                .speakerRating(feedback.getSpeakerRating())
                .organizationRating(feedback.getOrganizationRating())
                .recommendation(feedback.getRecommendation())
                .comments(feedback.getComments())
                .submittedAt(feedback.getSubmittedAt())
                .build();
    }
}
