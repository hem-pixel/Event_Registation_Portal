package com.eventportal.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendEmailWithQrCode(String toEmail, String subject, String body, byte[] qrCodeBytes) {
        log.info("Sending registration email to: {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            if (qrCodeBytes != null && qrCodeBytes.length > 0) {
                helper.addAttachment("checkin-qrcode.png", new ByteArrayResource(qrCodeBytes));
            }

            mailSender.send(message);
            log.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}. Error: {}", toEmail, e.getMessage());
            log.info("MOCK EMAIL SENT TO: {}\nSubject: {}\nBody: {}\nQR Code Attached: {}", 
                    toEmail, subject, body, (qrCodeBytes != null && qrCodeBytes.length > 0));
        }
    }

    @Async
    public void sendFeedbackRequestEmail(String toEmail, String subject, String body) {
        log.info("Sending feedback request email to: {}", toEmail);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}. Error: {}", toEmail, e.getMessage());
            log.info("MOCK EMAIL SENT TO: {}\nSubject: {}\nBody: {}", toEmail, subject, body);
        }
    }
}
