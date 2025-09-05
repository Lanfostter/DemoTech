package com.example.demotech.base.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto extends BaseObjectDto{
    private String username;
    private String password;
    private String rePassword;
    private String email;

}
