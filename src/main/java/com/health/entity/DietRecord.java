package com.health.entity;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DietRecord {
    private Integer id;
    private Integer userId;
    private String foodName;
    private Integer calories;
    private String mealType;
    private LocalDate recordDate;
    private LocalDateTime createdAt;
}