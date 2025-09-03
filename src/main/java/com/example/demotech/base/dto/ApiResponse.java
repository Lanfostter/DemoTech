package com.example.demotech.base.dto;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private String message;
    private T data;
    private Integer status;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(message, data, HttpStatus.OK.value());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(message, null, HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
    public static <T> ApiResponse<T> custom(String message,T data, HttpStatus status) {
        return new ApiResponse<>(message, data, status.value());
    }

}
