package com.health.entity;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Notice {
    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private Integer isRead;
    private String noticeType;
    private LocalDateTime createdAt;
}