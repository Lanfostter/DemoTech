package com.example.demotech.base.rest;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.LoginDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.dto.search.UserSearch;
import com.example.demotech.base.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class RestUserController {
    private final UserService service;

    public RestUserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/paging")
    public ApiResponse<Page<UserInfoResponse>> login(@RequestBody UserSearch search) {
        return service.paging(search);
    }
}
