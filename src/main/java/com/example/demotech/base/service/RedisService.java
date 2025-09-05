package com.example.demotech.base.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

public interface RedisService {
    void setValue(String key, String value);
    String getValue(String key);
    void deleteKey(String key);
    void deleteByPrefix(String prefix);
    void clearAll();
}

