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

    private void sendHtmlMessage(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody,true);

        mailSender.send(message);
    }
}