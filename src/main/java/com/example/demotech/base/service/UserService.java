package com.example.demotech.base.service;

import com.example.demotech.base.dto.ResponseObject;
import com.example.demotech.base.dto.UserDto;

public interface UserService {
    ResponseObject createUser(UserDto userDto);
}
