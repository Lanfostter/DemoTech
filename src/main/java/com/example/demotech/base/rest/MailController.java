package com.example.demotech.base.rest;

import com.example.demotech.base.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public/api/mail")
public class MailController {

    @Autowired
    private MailService mailService;


    @GetMapping("/test-send")
    public String testSendMail() throws Exception {
        Map<String, Object> model = new HashMap<>();
        model.put("candidateName", "Nguyễn Văn A");
        model.put("jobPosition", "Nhân viên tư vấn");
        model.put("interviewTime", "09:00");
        model.put("interviewDate", "Thứ Năm, ngày 10 tháng 04 năm 2025");
        model.put("interviewMethod", "Trực tiếp tại văn phòng");
        model.put("interviewLocation", "123 Đường ABC, Quận 1, TP.HCM");
        model.put("interviewerName", "Trần Thị B");
        model.put("interviewerTitle", "Trưởng phòng Nhân sự");
        model.put("contactName", "Nguyễn Văn C");
        model.put("contactPhone", "0909xxxxxx");
        model.put("responseDeadline", "09/04/2025, 24:00");
        mailService.sendInterviewInvitation("fostter2@gmail.com", "THƯ MỜI PHỎNG VẤN – LINH ANH", model);
        return "Gửi mail thành công!";
    }

}
