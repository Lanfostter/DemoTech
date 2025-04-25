package com.example.demotech.base.domain;

import com.example.demotech.base.helper.Enum;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_role")
public class Role extends BaseObject{
    @Enumerated(EnumType.STRING)
    private Enum.ROLE name;
    @Enumerated(EnumType.STRING)
    private Enum.ROLE code;
}
