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

    @PostMapping("/add")
    public Map<String, Object> addNotice(@RequestBody Notice notice) {
        Map<String, Object> result = new HashMap<>();
        boolean success = noticeService.addNotice(notice);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "添加成功" : "添加失败");
        return result;
    }

    @GetMapping("/list")
    public Map<String, Object> getNotices(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        List<Notice> notices = noticeService.getNoticesByUser(userId);
        result.put("code", 0);
        result.put("data", notices);
        return result;
    }

    @GetMapping("/unread")
    public Map<String, Object> getUnreadNotices(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        List<Notice> notices = noticeService.getUnreadNotices(userId);
        result.put("code", 0);
        result.put("data", notices);
        return result;
    }

    @PutMapping("/read")
    public Map<String, Object> markAsRead(@RequestParam Integer id,
                                           @RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        boolean success = noticeService.markAsRead(id, userId);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "已标记为已读" : "操作失败");
        return result;
    }

    @DeleteMapping("/delete")
    public Map<String, Object> deleteNotice(@RequestParam Integer id,
                                             @RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        boolean success = noticeService.deleteNotice(id, userId);
        result.put("code", success ? 0 : -1);
        result.put("message", success ? "删除成功" : "删除失败");
        return result;
    }

    @PostMapping("/generate")
    public Map<String, Object> generateNotice(@RequestParam Integer userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            noticeService.generateDailyNotice(userId);
            result.put("code", 0);
            result.put("message", "提醒生成成功");
        } catch (Exception e) {
            result.put("code", -1);
            result.put("message", "生成失败: " + e.getMessage());
        }
        return result;
    }
}
