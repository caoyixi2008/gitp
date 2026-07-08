package com.health.entity;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SportRecord {
    private Integer id;
    private Integer userId;
    private String sportType;
    private Integer duration;
    private Integer calories;
    private LocalDate recordDate;
    private LocalDateTime createdAt;
}