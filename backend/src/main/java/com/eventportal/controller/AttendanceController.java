package com.eventportal.controller;

import com.eventportal.dto.DashboardStatsDto;
import com.eventportal.entity.Attendance;
import com.eventportal.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in/{registrationId}")
    public ResponseEntity<Attendance> markPresent(@PathVariable Long registrationId) {
        return ResponseEntity.ok(attendanceService.markPresent(registrationId));
    }

    @PostMapping("/scan")
    public ResponseEntity<Attendance> scanQrCode(@RequestBody java.util.Map<String, Long> payload) {
        Long registrationId = payload.get("registrationId");
        return ResponseEntity.ok(attendanceService.markPresent(registrationId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEvent(eventId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Attendance>> getAttendanceByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByUser(userId));
    }

    @GetMapping("/my-attendance")
    public ResponseEntity<List<Attendance>> getMyAttendance() {
        String email = getLoggedInUserEmail();
        return ResponseEntity.ok(attendanceService.getMyAttendance(email));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(attendanceService.getDashboardStats());
    }

    // ── NEW: Export all attendance across all events to Excel ──
    @GetMapping("/export/excel/all")
    public ResponseEntity<InputStreamResource> exportAllAttendanceToExcel() {
        ByteArrayInputStream in = attendanceService.exportAllAttendanceToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=all_attendance_report.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<java.util.Map<String, String>> handleRuntimeException(RuntimeException ex) {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}
