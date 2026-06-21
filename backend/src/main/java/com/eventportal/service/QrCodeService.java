package com.eventportal.service;

import com.eventportal.dto.QrCodeDto;
import com.eventportal.entity.QrCode;
import com.eventportal.entity.Registration;
import com.eventportal.repository.QrCodeRepository;
import com.eventportal.repository.RegistrationRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final RegistrationRepository registrationRepository;

    public QrCodeDto generateQrCodeForRegistration(Long registrationId) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (qrCodeRepository.findByRegistrationId(registrationId).isPresent()) {
            throw new RuntimeException("QR Code already generated for this registration");
        }

        try {
            // Generate QR Code Data
            String qrData = String.format("{\"registrationId\": %d, \"userId\": %d, \"eventId\": %d, \"eventName\": \"%s\"}",
                    registration.getId(),
                    registration.getUser().getId(),
                    registration.getEvent().getId(),
                    registration.getEvent().getTitle()
            );

            // Generate Image
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 250, 250);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();

            String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);

            // Save to Database
            QrCode qrCode = QrCode.builder()
                    .registration(registration)
                    .qrCodeUrl(base64Image)
                    .build();

            qrCode = qrCodeRepository.save(qrCode);

            return mapToDto(qrCode);

        } catch (Exception e) {
            log.error("Failed to generate QR code", e);
            throw new RuntimeException("Failed to generate QR code");
        }
    }

    public QrCodeDto getQrCodeByRegistrationId(Long registrationId) {
        QrCode qrCode = qrCodeRepository.findByRegistrationId(registrationId)
                .orElseThrow(() -> new RuntimeException("QR Code not found"));
        return mapToDto(qrCode);
    }

    private QrCodeDto mapToDto(QrCode qrCode) {
        return QrCodeDto.builder()
                .id(qrCode.getId())
                .registrationId(qrCode.getRegistration().getId())
                .userId(qrCode.getRegistration().getUser().getId())
                .eventId(qrCode.getRegistration().getEvent().getId())
                .eventName(qrCode.getRegistration().getEvent().getTitle())
                .qrCodeUrl(qrCode.getQrCodeUrl())
                .generatedAt(qrCode.getGeneratedAt())
                .build();
    }
}
