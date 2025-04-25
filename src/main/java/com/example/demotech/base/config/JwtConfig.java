package com.example.demotech.base.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JwtConfig {

    @Value("${jwt.expiration}")
    private String jwtExpirationStr;

    public long getJwtExpirationMs() {
        return parseDuration(jwtExpirationStr);
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
