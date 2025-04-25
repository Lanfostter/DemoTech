package com.example.demotech.base.dto.search;

import com.example.demotech.base.helper.Enum;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSearch extends SearchDto{
    private Enum.ROLE role;
}
