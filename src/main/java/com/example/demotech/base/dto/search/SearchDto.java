package com.example.demotech.base.dto.search;

import lombok.*;

import java.util.Date;
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SearchDto {
    private Integer pageIndex = 1;
    private Integer pageSize = 10;
    private String keyword;
    private Date fromDate;
    private Date toDate;
    private boolean voided = false;
}
