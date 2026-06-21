package com.eventportal.service;

import com.eventportal.dto.RegistrationRequest;
import com.eventportal.entity.Attendance;
import com.eventportal.entity.Event;
import com.eventportal.entity.Registration;
import com.eventportal.entity.User;
import com.eventportal.repository.AttendanceRepository;
import com.eventportal.repository.EventRepository;
import com.eventportal.repository.RegistrationRepository;
import com.eventportal.repository.UserRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmailService emailService;
    private final QrCodeService qrCodeService;

    @Transactional
    public Registration registerForEvent(String userEmail, RegistrationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + request.getEventId()));

        if (registrationRepository.existsByUserAndEvent(user, event)) {
            throw new RuntimeException("You have already registered for this event");
        }

        if (event.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available for this event");
        }

        // Decrease available seats
        event.setAvailableSeats(event.getAvailableSeats() - 1);
        eventRepository.save(event);

        Registration registration = Registration.builder()
                .user(user)
                .event(event)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .collegeName(request.getCollegeName())
                .department(request.getDepartment())
                .year(request.getYear())
                .registrationDate(LocalDateTime.now())
                .status("REGISTERED")
                .build();

        Registration savedRegistration = registrationRepository.save(registration);

        // Pre-create attendance record with status 'ABSENT'
        Attendance attendance = Attendance.builder()
                .registration(savedRegistration)
                .attendanceStatus("ABSENT")
                .checkInTime(null)
                .build();
        attendanceRepository.save(attendance);

        // Generate QR code content and save to DB
        byte[] qrCodeBytes = null;
        try {
            com.eventportal.dto.QrCodeDto qrCodeDto = qrCodeService.generateQrCodeForRegistration(savedRegistration.getId());
            String base64Image = qrCodeDto.getQrCodeUrl().replace("data:image/png;base64,", "");
            qrCodeBytes = java.util.Base64.getDecoder().decode(base64Image);
        } catch (Exception e) {
            log.error("Failed to generate and save QR Code for registration ID: {}", savedRegistration.getId(), e);
        }

        // Send Email Confirmation asynchronously
        String emailSubject = "Registration Confirmation - " + event.getTitle();
        String emailBody = String.format(
                "<h3>Dear %s,</h3>" +
                "<p>Thank you for registering for <b>%s</b>.</p>" +
                "<p><b>Event Details:</b><br/>" +
                "Date: %s<br/>" +
                "Location: %s<br/>" +
                "Duration: %s</p>" +
                "<p>We have attached your attendance check-in QR Code. Please present this QR code at the registration desk on the day of the event.</p>" +
                "<br/>" +
                "<p>Best regards,<br/>%s Team</p>",
                savedRegistration.getFullName(),
                event.getTitle(),
                event.getEventDate().toString(),
                event.getLocation(),
                event.getDuration(),
                event.getOrganizer() != null ? event.getOrganizer() : "Event Portal"
        );

        emailService.sendEmailWithQrCode(savedRegistration.getEmail(), emailSubject, emailBody, qrCodeBytes);

        return savedRegistration;
    }

    public List<Registration> getMyRegistrations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return registrationRepository.findByUserOrderByRegistrationDateDesc(user);
    }

    public List<Registration> getRegistrationsForEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return registrationRepository.findByEventOrderByRegistrationDateDesc(event);
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public ByteArrayInputStream exportRegistrationsToExcel(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        List<Registration> registrations = registrationRepository.findByEventOrderByRegistrationDateDesc(event);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Registrations");

            // Define header style
            CellStyle headerCellStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);

            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Full Name", "Email", "Phone Number", "College Name", "Department", "Year", "Registration Date", "Status"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // Data Rows
            int rowIdx = 1;
            for (Registration reg : registrations) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(reg.getId());
                row.createCell(1).setCellValue(reg.getFullName());
                row.createCell(2).setCellValue(reg.getEmail());
                row.createCell(3).setCellValue(reg.getPhoneNumber());
                row.createCell(4).setCellValue(reg.getCollegeName());
                row.createCell(5).setCellValue(reg.getDepartment());
                row.createCell(6).setCellValue(reg.getYear());
                row.createCell(7).setCellValue(reg.getRegistrationDate().toString());
                row.createCell(8).setCellValue(reg.getStatus());
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            log.error("Failed to generate Excel sheet", e);
            throw new RuntimeException("Failed to export registrations to Excel: " + e.getMessage());
        }
    }

    private byte[] generateQrCodeImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }
}
