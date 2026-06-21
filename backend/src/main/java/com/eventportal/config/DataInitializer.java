package com.eventportal.config;

import com.eventportal.entity.Event;
import com.eventportal.entity.User;
import com.eventportal.repository.EventRepository;
import com.eventportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@eventportal.com");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);

            User user1 = new User();
            user1.setName("John Doe");
            user1.setEmail("john.doe@college.edu");
            user1.setPassword(passwordEncoder.encode("password"));
            user1.setRole("ROLE_USER");
            userRepository.save(user1);
        }

        if (eventRepository.countTotalEvents() == 0) {
            Event event1 = Event.builder()
                .title("AI & Machine Learning Workshop")
                .description("A hands-on workshop covering neural networks, deep learning, and practical applications of machine learning models in modern industry.")
                .eventDate(LocalDateTime.parse("2026-07-15T10:00:00"))
                .duration("4 Hours")
                .location("Seminar Hall A, Tech Block")
                .organizer("Department of Computer Science")
                .availableSeats(50)
                .imageUrl("https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop")
                .category("Workshop")
                .eventDay("Wednesday")
                .build();

            Event event2 = Event.builder()
                .title("Annual Hackathon 2026")
                .description("A 24-hour coding challenge to solve real-world problems. Great prizes, food, and networking opportunities for all registered teams.")
                .eventDate(LocalDateTime.parse("2026-08-01T09:00:00"))
                .duration("24 Hours")
                .location("Main Library & Innovation Lab")
                .organizer("Coding Club")
                .availableSeats(100)
                .imageUrl("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop")
                .category("Hackathon")
                .eventDay("Saturday")
                .build();

            Event event3 = Event.builder()
                .title("Guest Lecture on Cloud Architecture")
                .description("Learn about distributed systems, microservices, and serverless architectures from an industry expert with 15+ years of AWS and GCP experience.")
                .eventDate(LocalDateTime.parse("2026-06-25T14:00:00"))
                .duration("2 Hours")
                .location("Auditorium 2, Main Block")
                .organizer("CSI Student Chapter")
                .availableSeats(120)
                .imageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop")
                .category("Seminar")
                .eventDay("Thursday")
                .build();

            Event event4 = Event.builder()
                .title("UI/UX Design Boot Camp")
                .description("An introductory session on user experience design, wireframing, prototyping with Figma, and conducting user research.")
                .eventDate(LocalDateTime.parse("2026-06-12T11:00:00"))
                .duration("3 Hours")
                .location("Lab 5, CS Block")
                .organizer("Design & Creative Arts Society")
                .availableSeats(0)
                .imageUrl("https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop")
                .category("Bootcamp")
                .eventDay("Friday")
                .build();

            eventRepository.saveAll(List.of(event1, event2, event3, event4));
        }
    }
}
