package com.eventportal.service;

import com.eventportal.dto.EventDto;
import com.eventportal.entity.Event;
import com.eventportal.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now());
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));
    }

    public Event createEvent(EventDto eventDto) {
        Event event = Event.builder()
                .title(eventDto.getTitle())
                .description(eventDto.getDescription())
                .eventDate(eventDto.getEventDate())
                .eventDay(eventDto.getEventDay())
                .duration(eventDto.getDuration())
                .location(eventDto.getLocation())
                .organizer(eventDto.getOrganizer())
                .availableSeats(eventDto.getAvailableSeats())
                .category(eventDto.getCategory())
                .imageUrl(eventDto.getImageUrl())
                .registrationDeadline(eventDto.getRegistrationDeadline())
                .build();
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventDto eventDto) {
        Event event = getEventById(id);
        
        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setEventDate(eventDto.getEventDate());
        event.setEventDay(eventDto.getEventDay());
        event.setDuration(eventDto.getDuration());
        event.setLocation(eventDto.getLocation());
        event.setOrganizer(eventDto.getOrganizer());
        event.setAvailableSeats(eventDto.getAvailableSeats());
        event.setCategory(eventDto.getCategory());
        event.setImageUrl(eventDto.getImageUrl());
        event.setRegistrationDeadline(eventDto.getRegistrationDeadline());
        
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}
