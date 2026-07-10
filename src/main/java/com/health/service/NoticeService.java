package com.health.service;

import com.health.entity.Notice;
import com.health.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Autowired
    private SportRecordService sportRecordService;

    @Autowired
    private DietRecordService dietRecordService;

    public boolean addNotice(Notice notice) {
        return noticeMapper.insert(notice) > 0;
    }

    public List<Notice> getNoticesByUser(Integer userId) {
        return noticeMapper.findByUserId(userId);
    }

    public List<Notice> getUnreadNotices(Integer userId) {
        return noticeMapper.findUnreadByUserId(userId);
    }

    public boolean markAsRead(Integer id, Integer userId) {
        return noticeMapper.markAsRead(id, userId) > 0;
    }

    public boolean deleteNotice(Integer id, Integer userId) {
        return noticeMapper.deleteById(id, userId) > 0;
    }

    public void generateDailyNotice(Integer userId) {
        LocalDate today = LocalDate.now();
        
        List<com.health.entity.SportRecord> sportList = sportRecordService.getRecordsByDate(userId, today);
        int totalDuration = sportList.stream().mapToInt(com.health.entity.SportRecord::getDuration).sum();

        List<com.health.entity.DietRecord> dietList = dietRecordService.getRecordsByDate(userId, today);
        int totalIntake = dietList.stream().mapToInt(com.health.entity.DietRecord::getCalories).sum();

        if (totalDuration < 30) {
            Notice notice = new Notice();
            notice.setUserId(userId);
            notice.setTitle("🏃 运动提醒");
            notice.setContent("今日运动仅 " + totalDuration + " 分钟，建议运动 30 分钟以上！");
            notice.setNoticeType("运动");
            noticeMapper.insert(notice);
        }

        if (totalIntake > 2000) {
            Notice notice = new Notice();
            notice.setUserId(userId);
            notice.setTitle("🍔 饮食提醒");
            notice.setContent("今日摄入 " + totalIntake + " 千卡，建议控制在 2000 千卡以内！");
            notice.setNoticeType("饮食");
            noticeMapper.insert(notice);
        }

        if (totalDuration >= 30 && totalIntake <= 2000) {
            Notice notice = new Notice();
            notice.setUserId(userId);
            notice.setTitle("✅ 健康日报");
            notice.setContent("今日运动 " + totalDuration + " 分钟，摄入 " + totalIntake + " 千卡，继续保持！");
            notice.setNoticeType("健康");
            noticeMapper.insert(notice);
        }
    }
}
