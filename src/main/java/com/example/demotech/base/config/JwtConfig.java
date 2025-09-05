package com.example.demotech.base.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Data
public class JwtConfig {

    @Value("${jwt.access-expiration}")
    private String accessExpirationStr;

    @Value("${jwt.refresh-expiration}")
    private String refreshExpirationStr;
    @Value("${jwt.secret}")
    private String secret;

    public long getAccessExpirationMs() {
        return parseDuration(accessExpirationStr);
    }

    public long getRefreshExpirationMs() {
        return parseDuration(refreshExpirationStr);
    }

    private long parseDuration(String durationStr) {
        long totalMillis = 0;

        Pattern pattern = Pattern.compile("(\\d+)([dhms])");
        Matcher matcher = pattern.matcher(durationStr);

        while (matcher.find()) {
            int value = Integer.parseInt(matcher.group(1));
            String unit = matcher.group(2);

            switch (unit) {
                case "d" -> totalMillis += Duration.ofDays(value).toMillis();
                case "h" -> totalMillis += Duration.ofHours(value).toMillis();
                case "m" -> totalMillis += Duration.ofMinutes(value).toMillis();
                case "s" -> totalMillis += Duration.ofSeconds(value).toMillis();
            }
        }
        return totalMillis;
    }
}
