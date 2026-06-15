package com.example.demotech.base.service;

import freemarker.template.Configuration;
import freemarker.template.Template;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.Map;


@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    @Qualifier("customFreeMarkerConfig")
    private Configuration freemarkerConfig;

    public void sendInterviewInvitation(String to, String subject, Map<String, Object> model) throws Exception {
        Template template = freemarkerConfig.getTemplate("email-template.ftl");

        StringWriter writer = new StringWriter();
        template.process(model, writer);
        String htmlBody = writer.toString();

        sendHtmlMessage(to, subject, htmlBody);
    }

    public void sendPasswordResetEmail(String to, String name, String token) throws Exception {
        String subject = "EnglishPro — Đặt lại mật khẩu";
        String html = "<div style='font-family:Arial,sans-serif;max-width:480px;margin:auto'>"
                + "<h2 style='color:#4361EE'>EnglishPro</h2>"
                + "<p>Xin chào <strong>" + name + "</strong>,</p>"
                + "<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn.</p>"
                + "<p>Sử dụng mã token bên dưới để đặt lại (hết hạn sau 15 phút):</p>"
                + "<div style='background:#f0f4ff;padding:16px;border-radius:8px;font-size:20px;font-weight:bold;letter-spacing:2px;color:#4361EE;text-align:center'>"
                + token + "</div>"
                + "<p style='color:#888;font-size:12px;margin-top:24px'>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>"
                + "</div>";
        sendHtmlMessage(to, subject, html);
    }

    private void sendHtmlMessage(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody,true);

        mailSender.send(message);
    }
}