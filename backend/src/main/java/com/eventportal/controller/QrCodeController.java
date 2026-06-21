package com.eventportal.controller;

import com.eventportal.dto.QrCodeDto;
import com.eventportal.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @PostMapping("/generate/{registrationId}")
    public ResponseEntity<QrCodeDto> generateQrCode(@PathVariable Long registrationId) {
        return ResponseEntity.ok(qrCodeService.generateQrCodeForRegistration(registrationId));
    }

    @GetMapping("/{registrationId}")
    public ResponseEntity<QrCodeDto> getQrCode(@PathVariable Long registrationId) {
        return ResponseEntity.ok(qrCodeService.getQrCodeByRegistrationId(registrationId));
    }
}
