// NoticeController.java
package com.health.controller;

import com.health.entity.Notice;
import com.health.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // 查询用户所有提醒
    @GetMapping("/list")
    public Map<String, Object> getNotices(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        List<Notice> notices = noticeService.getNoticesByUser(userId);
        result.put("code", 0);
        result.put("data", notices);
        return result;
    }

    // 查询未读提醒
    @GetMapping("/unread")
    public Map<String, Object> getUnreadNotices(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        List<Notice> notices = noticeService.getUnreadNotices(userId);
        result.put("code", 0);
        result.put("data", notices);
        return result;
    }

    // 标记为已读
    @PutMapping("/read")
    public Map<String, Object> markAsRead(@RequestParam Integer id,
                                           @RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        boolean success = noticeService.markAsRead(id, userId);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "已标记为已读" : "操作失败");
        return result;
    }
}