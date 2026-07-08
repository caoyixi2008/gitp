package com.health.service;

import com.health.entity.SportRecord;
import com.health.mapper.SportRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class SportRecordService {

    @Autowired
    private SportRecordMapper sportRecordMapper;
    
    // 添加运动记录（自动计算卡路里）
    public boolean addSportRecord(SportRecord record) {
        // 简单卡路里计算：跑步 10 千卡/分钟，游泳 8，跳绳 12，走路 4
        int caloriesPerMinute = switch (record.getSportType()) {
            case "跑步" -> 10;
            case "游泳" -> 8;
            case "跳绳" -> 12;
            case "走路" -> 4;
            default -> 5;
        };
        record.setCalories(record.getDuration() * caloriesPerMinute);
        return sportRecordMapper.insert(record) > 0;
    }

    // 查询某天的运动记录
    public List<SportRecord> getRecordsByDate(Integer userId, LocalDate date) {
        return sportRecordMapper.findByUserIdAndDate(userId, date);
    }

    // 查询某段时间的运动记录（报表用）
    public List<SportRecord> getRecordsByDateRange(Integer userId, LocalDate startDate, LocalDate endDate) {
        return sportRecordMapper.findByUserIdAndDateRange(userId, startDate, endDate);
    }
// 删除运动记录
    public boolean deleteRecord(Integer id, Integer userId) {
        return sportRecordMapper.deleteById(id, userId) > 0;
    }
}