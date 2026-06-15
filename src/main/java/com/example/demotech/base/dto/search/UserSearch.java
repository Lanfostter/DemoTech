package com.example.demotech.base.dto.search;

import com.example.demotech.base.helper.Enum;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSearch extends SearchDto {
    @JsonSetter(nulls = Nulls.SET, contentNulls = Nulls.SET)
    private Enum.ROLE role;

    // Cho phép empty string → null thay vì lỗi
    public void setRole(String value) {
        if (value == null || value.isBlank()) {
            this.role = null;
        } else {
            try {
                this.role = Enum.ROLE.valueOf(value.toUpperCase());
            } catch (IllegalArgumentException e) {
                this.role = null;
            }
        }
    }
}
