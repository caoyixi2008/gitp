// NoticeService.java
package com.health.service;

import com.health.entity.Notice;
import com.health.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    // 添加提醒
    public boolean addNotice(Notice notice) {
        return noticeMapper.insert(notice) > 0;
    }

    // 查询用户所有提醒
    public List<Notice> getNoticesByUser(Integer userId) {
        return noticeMapper.findByUserId(userId);
    }

    // 查询用户未读提醒
    public List<Notice> getUnreadNotices(Integer userId) {
        return noticeMapper.findUnreadByUserId(userId);
    }

    // 标记为已读
    public boolean markAsRead(Integer id, Integer userId) {
        return noticeMapper.markAsRead(id, userId) > 0;
    }
}