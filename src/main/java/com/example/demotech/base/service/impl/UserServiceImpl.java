package com.example.demotech.base.service.impl;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.ResponseObject;
import com.example.demotech.base.dto.UserDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.dto.search.UserSearch;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.base.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository repo;
    public UserServiceImpl(UserRepository repo) {
        this.repo = repo;
    }
    @Override
    public ResponseObject createUser(UserDto userDto) {
        return null;
    }

    @Override
    public ApiResponse<Page<UserInfoResponse>> paging(UserSearch search) {
        int pageIndex = search.getPageIndex() - 1;
        int pageSize = search.getPageSize();
        return ApiResponse.success("Oke",repo.paging(search,PageRequest.of(pageIndex,pageSize)));
    }
}
