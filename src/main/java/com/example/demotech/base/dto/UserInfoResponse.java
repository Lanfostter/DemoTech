package com.example.demotech.base.dto;

import com.example.demotech.base.domain.BaseObject;
import com.example.demotech.base.domain.Role;
import com.example.demotech.base.domain.User;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse extends BaseObjectDto  {
    private String username;
    private String email;
    private List<String> roles;
    private String token;

    public UserInfoResponse(User user) {
        super(user);
        this.setName(user.getName());
        this.username = user.getUsername();
        this.email = user.getEmail();
        if (user.getRoles() != null) {
            this.roles = user.getRoles().stream().map(role -> role.getName().name()).toList();
        }
    }
}
