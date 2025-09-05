package com.example.demotech.base.service.impl;

import com.example.demotech.base.mapper.UserMapper;
import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.dto.UserDto;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.dto.search.UserSearch;
import com.example.demotech.base.helper.QueryHelper;
import com.example.demotech.base.repository.UserRepository;
import com.example.demotech.base.service.UserService;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class UserServiceImpl implements UserService {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository repo;
    private final EntityManager em;

    public UserServiceImpl(UserRepository repo, EntityManager em) {
        this.repo = repo;
        this.em = em;
    }

    @Override
    public ApiResponse<UserDto> createUser(UserDto userDto) {
        if (userDto != null) {
            User user = UserMapper.toUser(userDto);
            repo.save(user);
            return ApiResponse.success("Save successfully", UserMapper.toUserDto(user));
        }
        return ApiResponse.custom("Payload empty", null, HttpStatus.BAD_REQUEST);
    }

    @Override
    @Cacheable(value = "users", key = "{#search.keyword, #search.pageIndex, #search.pageSize}")
    public ApiResponse<Page<UserInfoResponse>> paging(UserSearch search) {
        int pageIndex = search.getPageIndex() - 1;
        int pageSize = search.getPageSize();

        QueryHelper<UserInfoResponse> helper = new QueryHelper<>(
                em,
                "SELECT new com.example.demotech.base.dto.UserInfoResponse(u) FROM User u WHERE 1=1 ",
                "SELECT COUNT(u.id) FROM User u WHERE 1=1 ",
                "u"
        );
        buildSearch(search, helper);
        var result = helper.build(pageIndex, pageSize, UserInfoResponse.class);

        Page<UserInfoResponse> page = new org.springframework.data.domain.PageImpl<>(
                result.list(), PageRequest.of(pageIndex, pageSize), result.total()
        );

        return ApiResponse.success("Oke", page);
    }

    private <T> void buildSearch(UserSearch search, QueryHelper<T> helper) {
        if (search == null) return;

        // search keyword trên nhiều trường
        if (StringUtils.hasText(search.getKeyword())) {
            helper.orLike(new String[]{"name", "code"}, search.getKeyword(), "keyword");
        }

        // voided = null hoặc false
        if (search.isVoided()) {
            helper.equal("voided", true, "voided");
        } else {
            // default: null hoặc false
            helper.isNullOrEqual("voided", "voided");
        }
    }

}
