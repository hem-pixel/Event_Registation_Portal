package com.eventportal.service;

import com.eventportal.dto.DashboardStatsDto;
import com.eventportal.entity.Attendance;
import com.eventportal.entity.Event;
import com.eventportal.entity.Registration;
import com.eventportal.entity.User;
import com.eventportal.repository.AttendanceRepository;
import com.eventportal.repository.EventRepository;
import com.eventportal.repository.RegistrationRepository;
import com.eventportal.repository.UserRepository;
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
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional
    public Attendance markPresent(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration record not found for ID: " + registrationId));

        Attendance attendance = attendanceRepository.findByRegistration(registration)
                .orElseGet(() -> Attendance.builder()
                        .registration(registration)
                        .attendanceStatus("ABSENT")
                        .build());

        if ("PRESENT".equalsIgnoreCase(attendance.getAttendanceStatus())) {
            throw new RuntimeException("Attendance has already been marked as PRESENT for this user");
        }

        attendance.setAttendanceStatus("PRESENT");
        attendance.setCheckInTime(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getMyAttendance(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Registration> registrations = registrationRepository.findByUserOrderByRegistrationDateDesc(user);

        return registrations.stream()
                .map(reg -> attendanceRepository.findByRegistration(reg).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        List<Registration> registrations = registrationRepository.findByEventOrderByRegistrationDateDesc(event);

        return registrations.stream()
                .map(reg -> attendanceRepository.findByRegistration(reg).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<Attendance> getAttendanceByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Registration> registrations = registrationRepository.findByUserOrderByRegistrationDateDesc(user);

        return registrations.stream()
                .map(reg -> attendanceRepository.findByRegistration(reg).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public DashboardStatsDto getDashboardStats() {
        long totalEvents = eventRepository.countTotalEvents();
        long totalRegistrations = registrationRepository.count();
        long totalUsers = userRepository.countByRole("ROLE_USER");
        long presentCount = attendanceRepository.countByAttendanceStatus("PRESENT");
        long absentCount = attendanceRepository.countByAttendanceStatus("ABSENT");

        return DashboardStatsDto.builder()
                .totalEvents(totalEvents)
                .totalRegistrations(totalRegistrations)
                .totalUsers(totalUsers)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .build();
    }

    // ── NEW: Export ALL attendance records across all events to Excel ──
    public ByteArrayInputStream exportAllAttendanceToExcel() {
        List<Attendance> attendances = attendanceRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("All Attendance");

            // Header style — bold + blue background
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.CORNFLOWER_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // PRESENT style — bold green text
            CellStyle presentStyle = workbook.createCellStyle();
            Font presentFont = workbook.createFont();
            presentFont.setBold(true);
            presentFont.setColor(IndexedColors.GREEN.getIndex());
            presentStyle.setFont(presentFont);

            // ABSENT style — red text
            CellStyle absentStyle = workbook.createCellStyle();
            Font absentFont = workbook.createFont();
            absentFont.setColor(IndexedColors.RED.getIndex());
            absentStyle.setFont(absentFont);

            // Header row
            String[] columns = {
                "Reg ID", "Event Name", "Full Name", "Email", "Phone Number",
                "College", "Department", "Year", "Reg Date", "Status", "Check-In Time"
            };
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowIdx = 1;
            for (Attendance att : attendances) {
                Registration reg = att.getRegistration();
                if (reg == null) continue;

                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(reg.getId() != null ? reg.getId() : 0);
                row.createCell(1).setCellValue(reg.getEvent() != null ? reg.getEvent().getTitle() : "N/A");
                row.createCell(2).setCellValue(reg.getFullName() != null ? reg.getFullName() : "");
                row.createCell(3).setCellValue(reg.getEmail() != null ? reg.getEmail() : "");
                row.createCell(4).setCellValue(reg.getPhoneNumber() != null ? reg.getPhoneNumber() : "");
                row.createCell(5).setCellValue(reg.getCollegeName() != null ? reg.getCollegeName() : "");
                row.createCell(6).setCellValue(reg.getDepartment() != null ? reg.getDepartment() : "");
                row.createCell(7).setCellValue(reg.getYear() != null ? reg.getYear() : 0);
                row.createCell(8).setCellValue(reg.getRegistrationDate() != null ? reg.getRegistrationDate().toString() : "");

                // Colour-coded status cell
                Cell statusCell = row.createCell(9);
                String status = att.getAttendanceStatus() != null ? att.getAttendanceStatus() : "ABSENT";
                statusCell.setCellValue(status);
                statusCell.setCellStyle("PRESENT".equalsIgnoreCase(status) ? presentStyle : absentStyle);

                row.createCell(10).setCellValue(att.getCheckInTime() != null ? att.getCheckInTime().toString() : "-");
            }

            // Auto-size all columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            log.error("Failed to generate All-Attendance Excel sheet", e);
            throw new RuntimeException("Failed to export attendance to Excel: " + e.getMessage());
        }
    }
}
