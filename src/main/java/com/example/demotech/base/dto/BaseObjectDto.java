package com.example.demotech.base.dto;

import com.example.demotech.base.domain.BaseObject;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class BaseObjectDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L; // cố định giá trị này

    private UUID id;
    private String name;
    private String code;
    private String createBy;
    private String lastModifiedBy;
    private LocalDateTime createDate;
    private LocalDateTime modifiedDate;
    private Boolean voided = false;

    public BaseObjectDto(BaseObject baseObject) {
        this.id = baseObject.getId();
        this.createBy = baseObject.getCreateBy();
        this.lastModifiedBy = baseObject.getLastModifiedBy();
        this.createDate = baseObject.getCreateDate();
        this.modifiedDate = baseObject.getModifiedDate();
        this.voided = baseObject.getVoided();
    }
}
