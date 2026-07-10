package com.health.schedule;

import com.health.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class NoticeSchedule {

    @Autowired
    private NoticeService noticeService;

    // 每天早上 8:00 执行
    @Scheduled(cron = "0 0 8 * * ?")
    public void generateDailyNotices() {
        // 只给固定用户生成提醒（没有 User 表）
        List<Integer> userIds = Arrays.asList(1);
        for (Integer userId : userIds) {
            try {
                noticeService.generateDailyNotice(userId);
            } catch (Exception e) {
                System.err.println("为用户 " + userId + " 生成提醒失败: " + e.getMessage());
            }
        }
        System.out.println("✅ 每日健康提醒生成完成");
    }
}
