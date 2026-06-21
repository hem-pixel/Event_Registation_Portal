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
public class QrCodeDto {
    private Long id;
    private Long registrationId;
    private Long userId;
    private Long eventId;
    private String eventName;
    private String qrCodeUrl;
    private LocalDateTime generatedAt;
}
