package com.example.demotech.base.service;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.ResponseObject;
import com.example.demotech.base.dto.UserDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.dto.search.UserSearch;
import org.springframework.data.domain.Page;

public interface UserService {
    ApiResponse<UserDto> createUser(UserDto userDto);
    ApiResponse<Page<UserInfoResponse>> paging(UserSearch search);
}
