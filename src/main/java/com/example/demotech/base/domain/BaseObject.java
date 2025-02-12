package com.example.demotech.base.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseObject implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @Column(
            name = "id",
            unique = true,
            nullable = false
    )
    @UuidGenerator
    @JdbcTypeCode(Types.VARCHAR)
    private UUID id;
    @Column(name = "create_by")
    @CreatedBy
    private String createBy;
    @LastModifiedBy
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
    @CreatedDate
    @Column(name = "create_date")
    private LocalDateTime createDate;
    @LastModifiedDate
    @Column(name = "last_modified_date")
    private LocalDateTime modifiedDate;


}
