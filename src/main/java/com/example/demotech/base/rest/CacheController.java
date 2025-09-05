package com.example.demotech.base.rest;

import com.example.demotech.base.dto.ApiResponse;
import com.example.demotech.base.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cache")
public class CacheController {

    private final RedisService redisService;

    @DeleteMapping("/clear")
    public ApiResponse<Boolean> clearCache() {
        redisService.clearAll();
        return ApiResponse.success("Đã xóa toàn bộ cache", true);
    }

    @DeleteMapping("/key/{key}")
    public ApiResponse<Boolean> clearByKey(@PathVariable String key) {
        redisService.deleteKey(key);
        return ApiResponse.success("Đã xóa key: " + key, true);

    }

    @DeleteMapping("/prefix/{prefix}")
    public ApiResponse<Boolean> clearByPrefix(@PathVariable String prefix) {
        redisService.deleteByPrefix(prefix);
        return ApiResponse.success("Đã xóa cache theo prefix: " + prefix, true);

    }
}

